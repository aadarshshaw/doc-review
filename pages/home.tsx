import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PreviewIcon from "@mui/icons-material/Preview";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DocumentInterface } from "@/interface/document";
import { UserInterface } from "@/interface/user";
import { useSession } from "next-auth/react";
import router from "next/router";
import CreateDocument from "./modals/createDocument";
import EditDocument from "./modals/editModal";

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalReviewers, setModalReviewers] = useState<string[]>([]);
  const [docEditId, setDocEditId] = useState<string>("");
  const { status, data } = useSession();
  const user = data?.user as UserInterface;
  const [userOptions, setUserOptions] = useState<UserInterface[]>([]);

  useEffect(() => {
    axios.get("/api/user").then((res) => {
      setUserOptions(res.data.users.map((user: UserInterface) => user.email));
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/document", { params: { user: user.email } })
      .then((res) => {
        setDocuments(res.data.documents);
      })
      .catch((err) => {});
  }, [status, user]);

  const clearModal = () => {
    setModalTitle("");
    setModalFile(null);
    setModalReviewers([]);
    setDocEditId("");
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenEditModal = (id: string) => {
    const document = documents.find(
      (doc) => doc._id === id
    ) as DocumentInterface;
    setDocEditId(id);
    setModalTitle(document.title);
    setModalReviewers(document.reviewers);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleSubmit = async () => {
    if (!modalFile) {
      return;
    }
    if (!modalTitle) {
      return;
    }
    const formData = new FormData();
    formData.append("file", modalFile as File);
    formData.append("upload_preset", "pbr-files");
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dqf3db9zz/image/upload`,
      formData
    );
    axios
      .post("/api/document", {
        title: modalTitle,
        url: response.data.url,
        user: user.email,
        reviewers: modalReviewers,
      })
      .then((res) => res.data)
      .then((data) => {
        setDocuments((prev) => [...prev, data.document]);
        clearModal();
      });
    setOpenCreateModal(false);
  };

  const handleEdit = async () => {
    if (!modalTitle) {
      return;
    }
    axios
      .patch("/api/document", {
        id: docEditId,
        title: modalTitle,
        reviewers: modalReviewers,
      })
      .then((res) => {
        setDocuments((prev) => {
          const newDocuments = [...prev];
          const index = newDocuments.findIndex((doc) => doc._id === docEditId);
          newDocuments[index] = res.data.document;
          return newDocuments;
        });
        clearModal();
      })
      .catch((err) => {
        console.log(err);
      });
    setOpenEditModal(false);
  };

  const handleDelete = async (id: string) => {
    const document = documents.find(
      (doc) => doc._id === id
    ) as DocumentInterface;
    const newDocuments = documents.filter((doc) => doc._id !== id);
    axios
      .delete("/api/cloudinary", { params: { url: document.url } })
      .then(() => {
        axios
          .delete("/api/document", { params: { id } })
          .then(() => {
            setDocuments(newDocuments);
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  };

  if (status === "loading") return null;
  return (
    <Box
      sx={{
        backgroundColor: "#f2f7fa",
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Button
        variant={"contained"}
        onClick={handleOpenCreateModal}
        sx={{
          my: "auto",
          height: "80%",
          width: "50%",
          maxWidth: 500,
        }}
      >
        Create Document
      </Button>

      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backdropFilter: "blur(2px)" }}
      >
        <CreateDocument
          modalTitle={modalTitle}
          setModalTitle={setModalTitle}
          setModalFile={setModalFile}
          modalReviewers={modalReviewers}
          setModalReviewers={setModalReviewers}
          userOptions={userOptions}
          handleSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backdropFilter: "blur(2px)" }}
      >
        <EditDocument
          modalTitle={modalTitle}
          setModalTitle={setModalTitle}
          modalReviewers={modalReviewers}
          setModalReviewers={setModalReviewers}
          userOptions={userOptions}
          handleEdit={handleEdit}
        />
      </Modal>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        {documents.map((document) => {
          return (
            <Grid item lg={3} md={4} sm={6} xs={12} key={document._id}>
              <Box key={document._id}>
                <Paper
                  elevation={3}
                  sx={{
                    my: { md: 2, xs: 1 },
                    height: 250,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      textAlign: "center",
                      overflow: "hidden",
                      padding: 1,
                    }}
                  >
                    {document.title}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Comments added:</b> {document.notes.length}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textOverflow: "ellipsis",
                    }}
                  >
                    <b>Reviewers</b>: {document.reviewers.join(", ")}
                  </Typography>

                  <ButtonGroup sx={{ marginTop: "auto" }} variant="text">
                    <Tooltip title="View Document">
                      <Button
                        fullWidth
                        sx={{
                          borderRadius: 0,
                          marginTop: "auto",
                        }}
                        onClick={() => {
                          window.open(document.url);
                        }}
                      >
                        <RemoveRedEyeIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="View Comments">
                      <Button
                        fullWidth
                        sx={{
                          borderRadius: 0,
                          marginTop: "auto",
                        }}
                        onClick={() => {
                          router.push({
                            pathname: "/review",
                            query: { id: document._id },
                          });
                        }}
                      >
                        <PreviewIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Edit Document">
                      <Button
                        fullWidth
                        sx={{
                          borderRadius: 0,
                          marginTop: "auto",
                        }}
                        onClick={() => {
                          handleOpenEditModal(document._id);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Document">
                      <Button
                        fullWidth
                        color="error"
                        sx={{
                          borderRadius: 0,
                          marginTop: "auto",
                        }}
                        onClick={() => {
                          handleDelete(document._id);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </Paper>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

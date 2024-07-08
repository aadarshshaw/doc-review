import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Modal,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PreviewIcon from "@mui/icons-material/Preview";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DocumentInterface } from "@/interface/document";
import { UserInterface } from "@/interface/user";
import { useSession } from "next-auth/react";
import router from "next/router";
import CreateDocument from "./modals/createDocument";
import EditDocument from "./modals/editDocument";
import ConfirmDeletion from "./modals/confirmDeletion";
import handleSubmit from "../callbacks/handleSubmit";
import handleEdit from "../callbacks/handleEdit";
import handleDelete from "../callbacks/handleDelete";
import SendReminders from "./modals/sendReminders";

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalReviewers, setModalReviewers] = useState<string[]>([]);
  const [docId, setDocId] = useState("");
  const { status, data } = useSession();
  const user = data?.user as UserInterface;
  const [userOptions, setUserOptions] = useState<UserInterface[]>([]);

  // useEffect(() => {
  //   axios
  //     .get("/api/user", {
  //       params: {
  //         all: true,
  //       },
  //     })
  //     .then((res) => {
  //       setUserOptions(
  //         res.data.users.map(
  //           (user: UserInterface) => user.name + " " + user.email
  //         )
  //       );
  //     });
  // }, []);

  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/document", { params: { user: user.email } })
      .then((res) => {
        setDocuments(res.data.documents.reverse());
      })
      .catch((err) => {});
  }, [status, user]);

  const handleModalState = (
    setModalState: (_: boolean) => void,
    state: boolean
  ) => {
    setModalState(state);
  };

  const clearModal = () => {
    setModalTitle("");
    setModalFile(null);
    setModalReviewers([]);
    setDocId("");
  };

  const handleOpenEditModal = (id: string) => {
    const document = documents.find(
      (doc) => doc._id === id
    ) as DocumentInterface;
    setDocId(id);
    setModalTitle(document.title);
    setModalReviewers(document.reviewers);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);

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
        onClick={() => handleModalState(setOpenCreateModal, true)}
        sx={{
          my: "auto",
          height: "80%",
          width: "50%",
          maxWidth: 500,
        }}
      >
        Create Document
      </Button>

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
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack direction="column" spacing={2}>
                    <Typography
                      variant="h4"
                      sx={{
                        textAlign: "center",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
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
                      <b>Reviewers</b>:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: 13,
                        textOverflow: "ellipsis",
                        height: 50,
                        overflowY: "auto",
                      }}
                    >
                      {document.reviewers.join(", ")}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        textOverflow: "ellipsis",
                      }}
                    >
                      <b>Date Added</b>:{" "}
                      {document.createdAt
                        ? new Date(document.createdAt).toLocaleDateString()
                        : ""}
                    </Typography>
                    <ButtonGroup sx={{ marginTop: "auto" }} variant="text">
                      <Tooltip title="Send Reminders">
                        <Button
                          fullWidth
                          sx={{
                            borderRadius: 0,
                            marginTop: "auto",
                          }}
                          onClick={() => {
                            setDocId(document._id);
                            setModalReviewers(document.reviewers);
                            handleModalState(setOpenReminderModal, true);
                          }}
                        >
                          <NotificationsActiveIcon
                            sx={{
                              color: "grey",
                            }}
                          />
                        </Button>
                      </Tooltip>
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
                            setDocId(document._id);
                            handleModalState(
                              setOpenDeleteConfirmationModal,
                              true
                            );
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Modal
        open={openCreateModal}
        onClose={() => handleModalState(setOpenCreateModal, false)}
        style={{ backdropFilter: "blur(2px)" }}
      >
        {
          <CreateDocument
            modalTitle={modalTitle}
            setModalTitle={setModalTitle}
            setModalFile={setModalFile}
            modalReviewers={modalReviewers}
            setModalReviewers={setModalReviewers}
            userOptions={userOptions}
            handleSubmit={() =>
              handleSubmit({
                modalFile,
                modalTitle,
                userEmail: user.email,
                modalReviewers,
                setDocuments,
                clearModal,
                setOpenCreateModal,
              })
            }
          />
        }
      </Modal>

      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        style={{ backdropFilter: "blur(2px)" }}
      >
        <EditDocument
          modalTitle={modalTitle}
          setModalTitle={setModalTitle}
          modalReviewers={modalReviewers}
          setModalReviewers={setModalReviewers}
          userOptions={userOptions}
          handleEdit={() =>
            handleEdit({
              docId,
              modalTitle,
              modalReviewers,
              setDocuments,
              clearModal,
              setOpenEditModal,
            })
          }
        />
      </Modal>

      <Modal
        open={openDeleteConfirmationModal}
        onClose={() => handleModalState(setOpenDeleteConfirmationModal, false)}
        style={{ backdropFilter: "blur(2px)" }}
      >
        <ConfirmDeletion
          handleCloseDeleteConfirmationModal={() =>
            handleModalState(setOpenDeleteConfirmationModal, false)
          }
          handleDelete={() =>
            handleDelete({
              docId,
              documents,
              setDocuments,
              clearModal,
              setOpenDeleteConfirmationModal,
            })
          }
        />
      </Modal>

      <Modal
        open={openReminderModal}
        onClose={() => handleModalState(setOpenReminderModal, false)}
        style={{ backdropFilter: "blur(2px)" }}
      >
        <SendReminders
          author={user.name}
          title={modalTitle}
          reviewers={modalReviewers}
          handleCloseReminderModal={() =>
            handleModalState(setOpenReminderModal, false)
          }
        />
      </Modal>
    </Box>
  );
}

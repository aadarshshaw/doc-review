import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import { DocumentInterface } from "@/interface/document";
import { UserInterface } from "@/interface/user";
import { useSession } from "next-auth/react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Home() {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [reviewers, setReviewers] = useState<string[]>([]);
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
      .catch((err) => {
        console.log(err);
      });
  }, [status, user]);

  const clearModal = () => {
    setModalTitle("");
    setModalFile(null);
    setReviewers([]);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!modalFile) {
      console.log("no file");
      return;
    }
    if (!modalTitle) {
      console.log("no title");
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
        reviewers: reviewers,
      })
      .then((res) => res.data)
      .then((data) => {
        setDocuments((prev) => [...prev, data.document]);
        clearModal();
      });
    setOpen(false);
  };

  const handleEdit = async (id: string) => {
    const document = documents.find(
      (doc) => doc._id === id
    ) as DocumentInterface;
    const newDocuments = documents.filter((doc) => doc._id !== id);
    setModalFile(null);
    setModalTitle(document.title);
    setReviewers(document.reviewers);
    setModalTitle(document.title);
  };

  const handleDelete = async (id: string) => {
    const document = documents.find(
      (doc) => doc._id === id
    ) as DocumentInterface;
    const newDocuments = documents.filter((doc) => doc._id !== id);
    axios
      .delete("/api/cloudinary", { params: { url: document.url } })
      .then(() => {
        console.log("deleted from cloudinary");
        axios
          .delete("/api/document", { params: { id } })
          .then(() => {
            console.log("deleted from db");
            setDocuments(newDocuments);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      sx={{
        margin: 2,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Button
        variant={"contained"}
        onClick={handleOpen}
        sx={{
          my: "auto",
          height: "80%",
          width: "50%",
          maxWidth: 500,
          bgcolor: "#7451eb",
          ":hover": {
            bgcolor: "#5f3dc4",
          },
        }}
      >
        Create Document
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography variant="h5">New Document</Typography>
            <TextField
              required
              id="outlined-basic"
              label="Title"
              variant="outlined"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
            />
            <Typography variant="h6">Reviewers</Typography>
            <Autocomplete
              multiple
              id="tags-standard"
              options={userOptions}
              defaultValue={[]}
              freeSolo
              value={reviewers}
              onChange={(e, value) => setReviewers(value as string[])}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="Reviewers" />
              )}
            />
            <Typography variant="h6">Upload File</Typography>
            <Button variant="contained" component="label">
              <input
                type="file"
                accept="pdf"
                onChange={(e) =>
                  setModalFile(() => {
                    if (e.target.files) {
                      return e.target.files[0];
                    }
                    return null;
                  })
                }
              />
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Grid container spacing={2} sx={{}}>
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
                    }}
                  >
                    {document.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textOverflow: "ellipsis",
                    }}
                  >
                    <b>Reviewers</b>: {document.reviewers.join(", ")}
                  </Typography>
                  <Typography variant="subtitle1">
                    <b>Comments added:</b> {document.notes.length}
                  </Typography>

                  <Stack
                    direction={"row"}
                    sx={{ marginTop: "auto" }}
                    spacing={2}
                  >
                    <Button
                      variant="contained"
                      color="info"
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
                    <Button
                      variant="contained"
                      color="warning"
                      fullWidth
                      sx={{
                        borderRadius: 0,
                        marginTop: "auto",
                      }}
                      onClick={() => {
                        handleEdit(document._id);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
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
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { DocumentInterface } from "@/interface/document";
import { UserInterface } from "@/interface/user";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { stat } from "fs";

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
  }, [status]);

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
    <>
      <Box
        sx={{
          margin: 2,
        }}
      >
        <Button
          variant={"contained"}
          onClick={handleOpen}
          sx={{
            my: "auto",
            height: "80%",
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
                id="outlined-basic"
                label="Title"
                variant="outlined"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
              />
              <Typography variant="h6">Reviewers</Typography>
              <TextField
                id="outlined-basic"
                label="Reviewers"
                variant="outlined"
                value={reviewers}
                placeholder="comma separated usernames"
                onChange={(e) =>
                  setReviewers(
                    e.target.value.split(",").map((reviewer) => reviewer.trim())
                  )
                }
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

        {documents.map((document) => {
          return (
            <div key={document._id}>
              <Paper
                elevation={3}
                sx={{
                  my: 2,
                  height: 50,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mx: 2,
                    my: "auto",
                  }}
                >
                  <Link href={document.url} target="_blank">
                    {document.title}
                  </Link>
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    borderRadius: 0,
                    marginLeft: "auto",
                  }}
                  onClick={() => {
                    handleDelete(document._id);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Paper>
            </div>
          );
        })}
      </Box>
    </>
  );
}

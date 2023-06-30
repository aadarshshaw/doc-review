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
import { v4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import dbConnect from "@/utils/dbConnect";
import document from "@/models/document";
import Link from "next/link";

interface DocumentInterface {
  _id: string;
  title: string;
  url: string;
  user: string;
  reviewers: string[];
}

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

export default function Home({
  alldocuments,
}: {
  alldocuments: DocumentInterface[];
}) {
  const [documents, setDocuments] = useState<DocumentInterface[]>(alldocuments);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFile, setModalFile] = useState<File | null>(null);

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
        user: "aadarsh",
        reviewers: ["aadarsh", "aadarsh2"],
      })
      .then((res) => res.data)
      .then((data) => {
        setDocuments((prev) => [...prev, data.document]);
      });
    setOpen(false);
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
              <Button variant="contained" component="label">
                Upload File
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
                    const newDocuments = documents.filter(
                      (doc) => doc._id !== document._id
                    );
                    setDocuments(newDocuments);
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

export async function getServerSideProps() {
  await dbConnect();
  const result = await document.find({ user: "aadarsh" });
  const documents = result.map((doc) => {
    const document = {
      _id: doc._id.toString(),
      title: doc.title,
      url: doc.url,
      user: doc.user,
      reviewers: doc.reviewers,
    };
    return document;
  });
  return {
    props: {
      alldocuments: documents,
    },
  };
}

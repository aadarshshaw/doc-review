import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Document {
  id: number;
  name: string;
  tags?: string[];
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

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalFile, setModalFile] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  function addDocumentCard() {
    const newDocument: Document = {
      id: Math.random(),
      name: modalTitle,
    };
    setDocuments([...documents, newDocument]);
    handleClose();
    console.log(modalFile);
    setModalTitle("");
    setModalDescription("");
    setModalFile("");
  }

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
              <Typography variant="h5">Create Document</Typography>
              <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
              />
              <Button variant="contained" component="label">
                Upload File
                <input
                  type="file"
                  hidden
                  accept="pdf"
                  value={modalFile}
                  onChange={(e) => setModalFile(e.target.value)}
                />
              </Button>
              <Button variant="contained" onClick={addDocumentCard}>
                {" "}
                Create{" "}
              </Button>
            </Stack>
          </Box>
        </Modal>

        {documents.map((document) => {
          return (
            <div key={document.id}>
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
                  {document.name}
                </Typography>
                <Button
                  variant="contained"
                  color="info"
                  sx={{
                    marginLeft: "auto",
                    borderRadius: 0,
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    borderRadius: 0,
                  }}
                  onClick={() =>{
                    const newDocuments = documents.filter((doc) => doc.id !== document.id);
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

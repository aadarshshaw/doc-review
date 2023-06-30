import { Paper, Typography, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import { useState } from "react";
import { useRouter } from "next/router";

const documentsToReview = [
  {
    id: 1,
    title: "Placement Tech",
    url: "/Placement_Tech.pdf",
    done: true,
  },
  {
    id: 2,
    title: "Placement Tech",
    url: "/Placement_Tech.pdf",
    done: false,
  },
];

export default function Review() {
  // return <DisplayNotesSidebar fileUrl="/Placement_Tech.pdf" />;
  const [documents, setDocuments] = useState(documentsToReview);
  const router = useRouter();
  return (
    <Box
      sx={{
        margin: 2,
      }}
    >
      <Typography variant="h4">Pending</Typography>
      {documents.map((document) => {
        if (document.done) return null;
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
                {document.title}
              </Typography>
              <Button
                variant="contained"
                color="info"
                sx={{
                  marginLeft: "auto",
                  borderRadius: 0,
                }}
                onClick={() => {
                  router.push(`/review/${document.id}`);
                }}
              >
                <PreviewIcon />
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 0,
                }}
                onClick={() => {
                  const newDocuments = documents.filter(
                    (doc) => doc.id !== document.id
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
      <Typography variant="h4">Done</Typography>
      {documents.map((document) => {
        if (!!!document.done) return null;
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
                {document.title}
              </Typography>
              <Button
                variant="contained"
                color="info"
                sx={{
                  marginLeft: "auto",
                  borderRadius: 0,
                }}
                onClick={() => {
                  router.push(`/review/${document.id}`);
                }}
              >
                <PreviewIcon />
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 0,
                }}
                onClick={() => {
                  const newDocuments = documents.filter(
                    (doc) => doc.id !== document.id
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
  );
}

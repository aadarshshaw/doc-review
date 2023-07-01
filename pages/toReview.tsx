import { Paper, Typography, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DocumentInterface } from "@/interface/document";
import { useSession } from "next-auth/react";
import { UserInterface } from "@/interface/user";
import axios from "axios";

export default function Review() {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const router = useRouter();
  const { status, data } = useSession();
  const user = data?.user as UserInterface;

  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/document", { params: { reviewer: user.email } })
      .then((res) => {
        setDocuments(res.data.documents);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [status]);

  return (
    <Box
      sx={{
        margin: 2,
      }}
    >
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
                  router.push({
                    pathname: "/review",
                    query: { id: document._id },
                  });
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
  );
}

import { Paper, Typography, Button, Box, Grid, Stack } from "@mui/material";
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
  }, [status, user]);

  return (
    <Grid
      container
      sx={{
        margin: 2,
      }}
      spacing={2}
    >
      {documents.map((document) => {
        return (
          <Grid item lg={3} md={4} sm={6} xs={12} key={document._id}>
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
                <b>Author:</b> {document.user} <br></br>
                <b>Comments added:</b> {document.notes.length} <br></br>
                <b>Reviewers</b>: {document.reviewers.join(", ")}
              </Typography>
              <Stack direction={"row"} spacing={2} sx={{ marginTop: "auto" }}>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
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
                  fullWidth
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
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}

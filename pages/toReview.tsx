import {
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
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
      .catch((err) => {});
  }, [status, user]);

  const handleDelete = (id: string) => {
    const newDocuments = documents.filter((doc) => doc._id !== id);
    const document = documents.find((doc) => doc._id === id);
    axios
      .delete("/api/document", { params: { id, reviewer: user.email } })
      .then((res) => {
        console.log(res);
        setDocuments(newDocuments.sort((a, b) => a._id.localeCompare(b._id)));
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
      <Grid
        container
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
        spacing={2}
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
                    <b>Author:</b> {document.user} <br></br>
                    <b>Comments added:</b> {document.notes.length} <br></br>
                    <b>Reviewers</b>: {document.reviewers.join(", ")}
                  </Typography>
                  <ButtonGroup sx={{ marginTop: "auto" }} variant="text">
                    <Tooltip title="View Document">
                      <Button
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
                    </Tooltip>
                    <Tooltip title="Delete Document">
                      <Button
                        color="error"
                        fullWidth
                        sx={{
                          borderRadius: 0,
                        }}
                        onClick={() => handleDelete(document._id)}
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

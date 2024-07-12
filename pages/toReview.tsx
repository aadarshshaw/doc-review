import {
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  ButtonGroup,
  Tooltip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DocumentInterface } from "@/interface/document";
import { useSession } from "next-auth/react";
import { UserInterface } from "@/interface/user";
import axios from "axios";
import handleAuthorNotify from "@/callbacks/toreview/handleAuthorNotify";

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
        setDocuments(res.data.documents.reverse());
      })
      .catch((err) => {});
  }, [status, user]);

  const handleDelete = (id: string) => {
    const newDocuments = documents.filter((doc) => doc._id !== id);
    axios
      .delete("/api/document", { params: { id, reviewer: user.email } })
      .then((res) => {
        setDocuments(newDocuments);
      })
      .catch((err) => {});
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
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack direction="column" spacing={0.5}>
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
                      <b>Author:</b> {document.user}
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
                      <Tooltip title="Notify Author">
                        <Button
                          color="success"
                          fullWidth
                          sx={{
                            marginLeft: "auto",
                            borderRadius: 0,
                          }}
                          onClick={() => {
                            handleAuthorNotify({
                              title: document.title,
                              reviewer: user.email,
                              author: document.user,
                            });
                          }}
                        >
                          <NotificationsActiveIcon />
                        </Button>
                      </Tooltip>
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

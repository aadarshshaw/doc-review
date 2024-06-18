import * as React from "react";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightsProps,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";
import {
  Position,
  PrimaryButton,
  Tooltip,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CrossIcon from "@mui/icons-material/Close";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  Box,
  Stack,
  Typography,
  Button,
  Tooltip as MuiTooltip,
  IconButton,
  AccordionSummary,
  Accordion,
  AccordionActions,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NoteInterface } from "@/interface/note";
import axios from "axios";
import { DocumentInterface } from "@/interface/document";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";

const defaultDocument: DocumentInterface = {
  _id: "",
  title: "",
  url: "/blank.pdf",
  user: "",
  reviewers: [],
  notes: [],
};

interface UserImage {
  name: string;
  email: string;
  image: string;
}

const DisplayNotesSidebar = () => {
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [document, setDocument] = useState<DocumentInterface>(defaultDocument);
  const { status, data } = useSession();
  const router = useRouter();
  const document_id = router.query.id as string;
  const [avatarImages, setImg] = useState<UserImage[]>([]);
  const user = data?.user;

  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/document", { params: { id: document_id } })
      .then((res) => {
        setDocument(res.data.document);
        setNotes(res.data.document.notes);
      })
      .catch((err) => {});
  }, [status, user, document_id]);

  useEffect(() => {
    if (!notes) return;
    const emails = new Set(notes.map((note) => note.addedBy));
    axios
      .get("/api/user", {
        params: { emails: JSON.stringify(Array.from(emails)) },
      })
      .then((res) => {
        setImg(res.data.data);
      })
      .catch((err) => {});
  }, [notes]);

  const noteEles: Map<number, HTMLElement> = new Map();

  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <Box
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <Box style={{ width: "100px" }}>Add a note</Box>}
        offset={{ left: 0, top: -8 }}
      />
    </Box>
  );

  const handleDeleteNote = async (id: number) => {
    const note_id = id;
    axios
      .delete("/api/document/note", {
        params: { note_id, document_id: document._id },
      })
      .then((res) => {
        setNotes(notes.filter((note) => note._id !== note_id));
        enqueueSnackbar("Note deleted", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  const handleResolveNote = async (id: number, resolved: boolean) => {
    const note_id = id;
    axios
      .put("/api/document/note", {
        note_id,
        document_id: document._id,
        resolved,
      })
      .then((res) => {
        enqueueSnackbar(
          `Note marked as ${resolved ? "resolved" : "unresolved"}`,
          { variant: "success" }
        );
        setNotes(
          notes.map((note) => {
            if (note._id === note_id) {
              note.resolved = resolved;
            }
            return note;
          })
        );
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: "error" });
      });
  };

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    const addNote = async () => {
      if (message !== "") {
        const response = await axios.post("/api/document/note", {
          doc_id: document._id,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
          addedBy: user?.email,
        });

        const note: NoteInterface = {
          _id: response.data._id,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
          addedBy: user?.email as string,
          resolved: false,
        };
        setNotes(notes.concat([note]));
        setMessage("");
        props.cancel();
      }
    };

    return (
      <Box
        style={{
          background: "#fff",
          border: "1px solid rgba(0, 0, 0, .3)",
          borderRadius: "2px",
          padding: "8px",
          position: "absolute",
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          zIndex: 1,
        }}
      >
        <Box>
          <textarea
            rows={3}
            style={{
              border: "1px solid rgba(0, 0, 0, .3)",
            }}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </Box>
        <Box
          style={{
            display: "flex",
            marginTop: "8px",
          }}
        >
          <Box style={{ marginRight: "8px" }}>
            <PrimaryButton onClick={addNote}>Add</PrimaryButton>
          </Box>
          <Button onClick={props.cancel}>Cancel</Button>
        </Box>
      </Box>
    );
  };

  const jumpToNote = (note: NoteInterface) => {
    if (noteEles.has(note._id)) {
      noteEles.get(note._id)?.scrollIntoView();
    }
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <Box>
      {notes.map((note) => (
        <React.Fragment key={note._id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <Box
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: "yellow",
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation)
                )}
                onClick={() => jumpToNote(note)}
                ref={(ref): void => {
                  noteEles.set(note._id, ref as HTMLElement);
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </Box>
  );
  6;

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });
  const fileUrl = document.url.replace("http", "https");
  const { jumpToHighlightArea } = highlightPluginInstance;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        sx={{
          borderRight: "1px solid rgba(0, 0, 0, 0.3)",
          width: "100%",
          height: "calc(100vh - 68.5px)",
          overflow: "auto",
          margin: "0 auto !important",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <div
            style={{
              height: "calc(100vh - 68.5px)",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Viewer
              fileUrl={fileUrl}
              plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          overflow: "auto",
          padding: "8px",
          maxHeight: "calc(100vh - 68.5px)",
          overflowY: "scroll",
          margin: "0 auto !important",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: "8px",
          }}
        >
          Comments
        </Typography>
        {notes.length === 0 && (
          <Box sx={{ textAlign: "center" }}>
            No Comments have been made yet!
          </Box>
        )}
        <Stack direction="column" spacing={2}>
          {notes.map((note) => (
            <Accordion
              key={note._id}
              defaultExpanded={!note.resolved}
              onClick={() => {
                jumpToHighlightArea(note.highlightAreas[0]);
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                <Stack direction="row" spacing={2}>
                  <MuiTooltip title={note.addedBy}>
                    <Avatar
                      src={
                        avatarImages.find((user) => user.email === note.addedBy)
                          ?.image
                      }
                      sx={{
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        width: "24px",
                        height: "24px",
                      }}
                      imgProps={{
                        referrerPolicy: "no-referrer",
                      }}
                    ></Avatar>
                  </MuiTooltip>
                  <Typography variant="subtitle2" sx={{ overflow: "hidden" }}>
                    {note.quote}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  wordBreak: "break-all",
                }}
              >
                <Box>{note.content}</Box>
              </AccordionDetails>
              <AccordionActions>
                <Box>
                  {user?.email == document.user && !!!note.resolved && (
                    <MuiTooltip title="Mark as resolved">
                      <IconButton
                        color="success"
                        sx={{
                          marginLeft: "auto",
                        }}
                        onClick={() => handleResolveNote(note._id, true)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    </MuiTooltip>
                  )}
                  {user?.email == document.user && note.resolved && (
                    <MuiTooltip title="Mark as unresolved">
                      <IconButton
                        color="error"
                        sx={{
                          marginLeft: "auto",
                        }}
                        onClick={() => handleResolveNote(note._id, false)}
                      >
                        <CrossIcon fontSize="small" />
                      </IconButton>
                    </MuiTooltip>
                  )}
                  {note.addedBy === user?.email && (
                    <MuiTooltip title="Delete Comment">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </MuiTooltip>
                  )}
                </Box>
              </AccordionActions>
            </Accordion>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default DisplayNotesSidebar;

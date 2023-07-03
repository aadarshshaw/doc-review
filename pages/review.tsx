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

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { NoteInterface } from "@/interface/note";
import axios from "axios";
import { DocumentInterface } from "@/interface/document";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const defaultDocument: DocumentInterface = {
  _id: "",
  title: "",
  url: "/",
  user: "",
  reviewers: [],
  notes: [],
};

const DisplayNotesSidebar = () => {
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<NoteInterface[]>([]);
  const [document, setDocument] = useState<DocumentInterface>(defaultDocument);
  const { status, data } = useSession();
  const router = useRouter();
  const document_id = router.query.id as string;

  const user = data?.user;
  let noteId = notes.length;

  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/document", { params: { id: document_id } })
      .then((res) => {
        console.log(res.data.document);
        setDocument(res.data.document);
        setNotes(res.data.document.notes);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  , [status, user, document_id]);

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

  const renderHighlightContent = (props: RenderHighlightContentProps) => {
    const addNote = async () => {
      if (message !== "") {
        const response = await axios.put("/api/document/note", {
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
        };
        setNotes(notes.concat([note]));
        props.cancel();
        setMessage("");
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
  const fileUrl = document.url.replace("http", "https")
  console.log(fileUrl);
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
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Comments
        </Typography>
        {notes.length === 0 && (
          <Box sx={{ textAlign: "center" }}>
            No Comments have been made yet!
          </Box>
        )}
        {notes.map((note) => {
          return (
            <Paper
              elevation={3}
              key={note._id}
              sx={{
                borderBottom: "1px solid rgba(0, 0, 0, .3)",
                cursor: "pointer",
                padding: "8px",
                wordBreak: "break-all",
                margin: "8px 0",
              }}
              // Jump to the associated highlight area
              onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
            >
              <Stack direction="column" spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {note.addedBy}
                </Typography>
                <blockquote
                  style={{
                    borderLeft: "2px solid rgba(0, 0, 0, 0.2)",
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    margin: "0 0 8px 0",
                    paddingLeft: "8px",
                    textAlign: "justify",
                    maxHeight: "100px",
                    overflow: "hidden",
                  }}
                >
                  {note.quote}
                </blockquote>
                {note.content}
                <Button variant="contained" color="error">
                  <DeleteIcon fontSize="small" />
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
};

export default DisplayNotesSidebar;

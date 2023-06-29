import * as React from "react";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
  RenderHighlightContentProps,
  RenderHighlightsProps,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";
import {
  Button,
  Position,
  PrimaryButton,
  Tooltip,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface DisplayNotesSidebarProps {
  fileUrl: string;
}

interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
}

const DisplayNotesSidebar: React.FC<DisplayNotesSidebarProps> = ({
  fileUrl,
}) => {
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  let noteId = notes.length;

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
    const addNote = () => {
      if (message !== "") {
        const note: Note = {
          id: ++noteId,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
        };
        setNotes(notes.concat([note]));
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

  const jumpToNote = (note: Note) => {
    if (noteEles.has(note.id)) {
      noteEles.get(note.id)?.scrollIntoView();
    }
  };

  const renderHighlights = (props: RenderHighlightsProps) => (
    <Box>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
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
                  noteEles.set(note.id, ref as HTMLElement);
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </Box>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

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
              key={note.id}
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
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
};

export default DisplayNotesSidebar;

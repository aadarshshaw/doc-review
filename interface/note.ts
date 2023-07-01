import { HighlightArea } from "@react-pdf-viewer/highlight";

export interface NoteInterface {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
}

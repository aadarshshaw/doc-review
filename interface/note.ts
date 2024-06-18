import { HighlightArea } from "@react-pdf-viewer/highlight";

export interface NoteInterface {
  resolved: boolean;
  _id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
  addedBy?: string;
}

import mongoose from "mongoose";
import { HighlightAreaSchema } from "./highlightArea";

export const NoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    quote: {
      type: String,
      required: true,
    },

    highlightAreas: [{
      type: HighlightAreaSchema,
      required: true,
    }],
    addedBy: {
      type: String,
      required: true,
    },
    resolved: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);

import mongoose from "mongoose";
import { NoteSchema } from "./note";

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },

    reviewers: {
        type: [String],
    },
    notes:{
        type: [NoteSchema],
    }
}, {
    timestamps: true
});

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
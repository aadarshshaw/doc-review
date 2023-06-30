import mongoose from "mongoose";
export const HighlightAreaSchema = new mongoose.Schema({
    // height: number;
    // left: number;
    // pageIndex: number;
    // top: number;
    // width: number;

    height: {   
        type: Number,
        required: true
    },

    left: {
        type: Number,
        required: true
    },

    pageIndex: {
        type: Number,
        required: true
    },

    top: {
        type: Number,
        required: true
    },

    width: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.models.HighlightArea || mongoose.model("HighlightArea", HighlightAreaSchema);
module.exports.HighlightAreaSchema = HighlightAreaSchema;
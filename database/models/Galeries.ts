import mongoose from "mongoose";

const GaleriesSchema = new mongoose.Schema({
    idTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags", required: true }],
    idModel: [{ type: mongoose.Schema.Types.ObjectId, ref: "Models", required: true }],
    idRelatedVideo: { type: mongoose.Schema.Types.ObjectId, ref: "Video", },
    name: { type: String, required: true },
    images: []
}, { timestamps: true });
export const Galeries = mongoose.models.Galeries || mongoose.model("Galeries", GaleriesSchema);

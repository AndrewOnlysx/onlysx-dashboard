import mongoose from "mongoose";

const GaleriesSchema = new mongoose.Schema({
    idTags: [{ type: String, require: true }],
    idModel: [{ type: String, require: true }],
    idRelatedVideo: { type: String },
    name: { type: String, require: true },
    images: []
}, { timestamps: true });
export const Galeries = mongoose.models.Galeries || mongoose.model("Galeries", GaleriesSchema);

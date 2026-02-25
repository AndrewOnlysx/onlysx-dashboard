import mongoose from "mongoose";

const ModelsSchema = new mongoose.Schema({
    name: { type: String, require: true },
    folder: { type: String, },
    searchCounts: { type: Number },
    image: { type: String, require: true }
});
export const Models = mongoose.models.Models || mongoose.model("Models", ModelsSchema);

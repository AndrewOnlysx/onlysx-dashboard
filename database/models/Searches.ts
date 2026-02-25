import mongoose from "mongoose";

const SearchesSchema = new mongoose.Schema({
    text: { type: String, require: true },
    type: { type: String, enum: ["term", "phrase", "untracked"], require: true },
    count: { type: Number, require: true },
    related: { type: [String], default: [] }
}, { timestamps: true });
export const Searches = mongoose.models.Searches || mongoose.model("Searches", SearchesSchema);

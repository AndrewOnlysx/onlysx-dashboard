import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
    name: { type: String, require: true },
    searches: { type: Number }
});
export const Tags = mongoose.models.Tags || mongoose.model("Tags", TagsSchema);

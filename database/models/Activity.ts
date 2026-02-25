import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    date: { type: String, require: true },
    time: { type: Number, require: true },
    formatedTime: { type: String },
    location: { type: String },
});
export const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

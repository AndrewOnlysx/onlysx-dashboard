import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    message: { type: String, require: true },
}, {
    timestamps: true
});
export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

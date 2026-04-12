import mongoose from "mongoose";

import { attachSlugLifecycle } from '@/database/utils/slug'

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String, required: true },
    video: { type: String, required: true },
    dump: { type: String, required: true },
    quality: { type: String, required: true },
    models: [{ type: mongoose.Schema.Types.ObjectId, ref: "Models", required: true }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags", required: true }],
    views: { type: Number },
    lastViews: { type: String },
    galeries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Galeries" }],
    searchPrarms: { type: [], required: true },
}, {
    timestamps: true
});

attachSlugLifecycle(VideoSchema, 'title')

export const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);
import mongoose from "mongoose";

import { attachSlugLifecycle } from '@/database/utils/slug'

const GaleriesSchema = new mongoose.Schema({
    idTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags", required: true }],
    idModel: [{ type: mongoose.Schema.Types.ObjectId, ref: "Models", required: true }],
    idRelatedVideo: { type: mongoose.Schema.Types.ObjectId, ref: "Video", },
    name: { type: String, required: true },
    images: []
}, { timestamps: true });

attachSlugLifecycle(GaleriesSchema, 'name')

export const Galeries = mongoose.models.Galeries || mongoose.model("Galeries", GaleriesSchema);

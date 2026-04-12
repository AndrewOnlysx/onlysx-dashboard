import mongoose from "mongoose";

import { attachSlugLifecycle } from '@/database/utils/slug'

const ModelsSchema = new mongoose.Schema({
    name: { type: String, require: true },
    folder: { type: String, },
    searchCounts: { type: Number },
    image: { type: String, require: true }
});

attachSlugLifecycle(ModelsSchema, 'name')

export const Models = mongoose.models.Models || mongoose.model("Models", ModelsSchema);

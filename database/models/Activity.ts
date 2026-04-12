import mongoose from "mongoose";

const PageActivitySchema = new mongoose.Schema({
    path: { type: String, required: true },
    visits: { type: Number, required: true, default: 0 },
    activeTimeMs: { type: Number, required: true, default: 0 },
    firstVisitedAt: { type: Date },
    lastVisitedAt: { type: Date },
    pageViewIds: { type: [String], default: [] },
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
    visitorId: { type: String, required: true, index: true },
    dayKey: { type: String, required: true },
    date: { type: String, required: true },
    dayStartUtc: { type: Date, required: true },
    dayEndUtc: { type: Date, required: true },
    time: { type: Number, required: true, default: 0 },
    totalActiveTimeMs: { type: Number, required: true, default: 0 },
    formatedTime: { type: String, default: "00:00:00" },
    location: { type: String, default: "Unknown" },
    ipAddress: { type: String },
    ipDetails: { type: mongoose.Schema.Types.Mixed, default: null },
    userAgent: { type: String },
    firstSeenAt: { type: Date },
    lastSeenAt: { type: Date },
    segmentCount: { type: Number, required: true, default: 0 },
    visitedPages: { type: [String], default: [] },
    favoritePages: { type: [String], default: [] },
    pageStats: { type: [PageActivitySchema], default: [] },
}, {
    timestamps: true,
});

ActivitySchema.index({ visitorId: 1, dayKey: 1 }, { unique: true });

export const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

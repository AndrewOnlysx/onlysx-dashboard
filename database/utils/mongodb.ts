import mongoose from "mongoose";

import { Models } from "../models/Models";
import { Video } from "@/database/models/Video";
const { MONGODB_URI, MONGODB_URI_APP } = process.env;

if (!MONGODB_URI || !MONGODB_URI_APP) {
    throw new Error("MONGODB_URI must be defined" + MONGODB_URI);
}

export const connectDB = async () => {
    try {

        const { connection } = await mongoose.connect(MONGODB_URI);
        if (connection.readyState === 1) {
            //     //console.log("MongoDB Connected");
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};

export const connectDBAPP = async () => {
    try {

        const { connection } = await mongoose.connect(MONGODB_URI_APP);
        if (connection.readyState === 1) {
            //     //console.log("MongoDB Connected");
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};
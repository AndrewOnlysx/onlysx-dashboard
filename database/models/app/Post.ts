// models/Post.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    media: {
        url: string;
        type: 'image' | 'video';
        order: number;
    }[];
    description: string;
    tags: string[];
    likes: mongoose.Types.ObjectId[];
    price: number; // 0 significa gratuita
    createdAt: Date;
}

const PostSchema = new Schema<IPost>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    media: [
        {
            url: { type: String, required: true },
            type: { type: String, enum: ['image', 'video'], required: true },
            order: { type: Number, default: 0 }
        }
    ],
    description: {
        type: String,
        maxlength: 2200 // similar a Instagram
    },
    tags: {
        type: [String],
        index: true // mejora búsquedas por tags
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    price: {
        type: Number,
        default: 0, // si es 0 es gratuita
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

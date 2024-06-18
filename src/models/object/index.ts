import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
    originalName: {
        type: String,
    },
    originalType: {
        type: String,
    },
    originalPath: {
        type: String,
    },
    thumbnailPath: {
        type: String,
    },
    sizeInByte: {
        type: Number,
    },
    extension: {
        type: String,
    },
    parentId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DELETED"]
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const OBJECT = model('object', schema);
export { OBJECT };

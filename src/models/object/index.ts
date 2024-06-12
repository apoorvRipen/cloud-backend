import { model, Schema, Types } from 'mongoose';

const schema = new Schema({
    name: {
        type: String,
    },
    sizeInByte: {
        type: Number,
    },
    type: {
        type: String,
    },
    extension: {
        type: String,
    },
    parentId: {
        type: String,
    },
    isDirectory: {
        type: Boolean
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

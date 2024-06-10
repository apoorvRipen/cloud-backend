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
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const OBJECT = model('object', schema);
export { OBJECT };

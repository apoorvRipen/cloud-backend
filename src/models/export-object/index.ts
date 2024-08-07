import { model, Schema, Types } from 'mongoose';
import { IExportObject } from '../../lib';

const schema = new Schema({
    name: {
        type: String,
    },
    path: {
        type: String,
    },
    totalFiles: {
        type: Number,
    },
    success: {
        type: [String],
    },
    failed: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["INITIATED", "COMPLETED", "EXPIRED"],
        default: "INITIATED"
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const EXPORTOBJECT = model<IExportObject>('export-object', schema);
export { EXPORTOBJECT };

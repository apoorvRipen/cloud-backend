import { model, Schema } from 'mongoose';

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
    }
}, { timestamps: true });

const OBJECT = model('object', schema);
export { OBJECT };

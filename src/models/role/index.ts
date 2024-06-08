import { model, Schema } from 'mongoose';

const schema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    resources: {
        type: [String],
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const ROLE = model('role', schema);
export { ROLE };

import { model, Schema, Types } from 'mongoose';

const userRoleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['USER', 'SUPERADMIN'],
        required: true
    },
    isDefault: {
        type: Boolean
    },
    status: {
        type: String,
        uppercase: true,
        enum: ['ACTIVE', 'DELETED', 'INACTIVE'],
        default: 'ACTIVE'
    },
    resources: {
        type: [String],
        default: []
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

export const ROLE = model('role', userRoleSchema);

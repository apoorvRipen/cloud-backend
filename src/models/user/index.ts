import { model, Schema, Types } from 'mongoose';
import { IUser } from '../../lib';

const phoneSchema = new Schema({
    dialCode: String,
    iso2: {
        type: String,
        uppercase: true,
        max: 2
    },
    country: {
        type: String,
        uppercase: true
    },
    number: String
}, { _id: false });

const schema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'TRANSGENDER']
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED']
    },
    _role: {
        type: Types.ObjectId,
        ref: 'role',
        required: true
    },
    contact: {
        email: {
            type: String,
            lowercase: true
        },
        mobileNumber: phoneSchema
    },
}, { timestamps: true });

const USER = model<IUser>('user', schema);
export { USER };

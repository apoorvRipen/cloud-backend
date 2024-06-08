import { Types } from 'mongoose';

interface PhoneSchema {
    dialCode: string;
    iso2: string;
    country: string;
    number: string;
}

interface Contact {
    email: string;
    mobileNumber: PhoneSchema;
}

export interface IUser {
    _id: Types.ObjectId,
    firstName?: string;
    lastName?: string;
    gender?: 'MALE' | 'FEMALE' | 'TRANSGENDER';
    contact?: Contact;
    isDeleted?: boolean;
}

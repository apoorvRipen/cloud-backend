import { Types } from 'mongoose';

interface IRole {
    _id: Types.ObjectId,
    name: string;
    description: string;
    resources: string[];
    isDefault?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export { IRole };
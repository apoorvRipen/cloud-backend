import { Types } from 'mongoose';

interface IObject {
    _id: Types.ObjectId,
    name: string;
    sizeInByte: number;
    type: string;
    extension: string;
    isFolder: boolean;
    parentId?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export { IObject }
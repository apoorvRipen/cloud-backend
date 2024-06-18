import { Types } from 'mongoose';

interface IObject {
    _id: Types.ObjectId,
    originalName: string;
    sizeInByte: number;
    originalType: string;
    extension: string;
    isFolder: boolean;
    parentId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export { IObject }
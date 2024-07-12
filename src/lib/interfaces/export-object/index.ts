import { Types } from 'mongoose';

export interface IExportObject {
    name?: string;
    path?: string;
    totalFiles?: number;
    success?: string[];
    failed?: string[];
    status?: 'INITIATED' | 'COMPLETED' | 'EXPIRED';
    createdBy?: Types.ObjectId | string; // Assuming Types.ObjectId from Mongoose
    createdAt?: Date;
    updatedAt?: Date;
}
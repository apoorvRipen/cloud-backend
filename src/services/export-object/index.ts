import { EXPORTOBJECT } from '../../models';

const addExportObject = async (payload: any) =>
    EXPORTOBJECT.create(payload);

const getExportObject = async (search = {}, project = {}) =>
    EXPORTOBJECT.findOne(search, project)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .lean()
        .exec();

const getExportObjects = async (search = {}, project = {}) =>
    EXPORTOBJECT.find(search, project)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .sort({ _id: -1 })
        .lean()
        .exec();

const updateExportObject = async (search = {}, payload = {}, optional = {}) =>
    EXPORTOBJECT.findOneAndUpdate(search, payload, optional)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .lean()
        .exec();





export { addExportObject, getExportObject, getExportObjects, updateExportObject };

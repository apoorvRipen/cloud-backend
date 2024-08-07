import { OBJECT } from '../../models';

const addObject = async (payload: any) =>
    OBJECT.create(payload);

const getObject = async (search = {}, project = {}) =>
    OBJECT.findOne(search, project)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .sort({ _id: -1 })
        .lean()
        .exec();

const getObjects = async (search = {}, project = {}) =>
    OBJECT.find(search, project)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .sort({ _id: -1 })
        .lean()
        .exec();

const updateObject = async (search = {}, payload = {}, optional = {}) =>
    OBJECT.findOneAndUpdate(search, payload, optional)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .lean()
        .exec();

const updateObjects = async (search = {}, payload = {}, optional = {}) =>
    OBJECT.updateMany(search, payload, optional)
        .lean()
        .exec();

const getObjectsWithPagination = async (search = {}, project = {}, optional: any) =>
    OBJECT.find(search, project)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName'
        })
        .sort({ _id: -1 })
        .skip(optional.skip)
        .limit(optional.limit)
        .lean()
        .exec();

const getObjectsCount = async (search = {}) => new Promise<number>((resolve, reject) => {
    OBJECT.countDocuments(search)
        .then(resolve)
        .catch(reject);
});
export { addObject, getObject, getObjects, updateObject, updateObjects, getObjectsWithPagination, getObjectsCount };

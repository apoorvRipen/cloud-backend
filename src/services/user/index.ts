import { USER } from '../../models';

const addUser = async (payload: any) =>
  USER.create(payload);

const getUserWithResources = async (search = {}, project = {}) =>
  USER.findOne(search, project)
    .populate({
      path: '_role',
      select: 'name role resources'
    })
    .lean()
    .exec();

const getUser = async (search = {}, project = {}) =>
  USER.findOne(search, project)
    .populate({
      path: '_role',
      select: 'name role'
    })
    .lean()
    .exec();

const getUsers = async (search = {}, project = {}) =>
  USER.find(search, project)
    .sort({ _id: -1 })
    .lean()
    .exec();

const updateUser = async (search = {}, payload = {}, optional = {}) =>
  USER.findOneAndUpdate(search, payload, optional)
    .lean()
    .exec();

const updateUsers = async (search = {}, payload = {}, optional = {}) =>
  USER.updateMany(search, payload, optional)
    .lean()
    .exec();

const getUsersWithPagination = async (search = {}, project = {}, optional: any) =>
  USER.find(search, project)
    .sort({ _id: -1 })
    .skip(optional.skip)
    .limit(optional.limit)
    .lean()
    .exec();

const getUsersCount = async (search = {}) => new Promise<number>((resolve, reject) => {
  USER.countDocuments(search)
    .then(resolve)
    .catch(reject);
});
export { addUser, getUser, getUserWithResources, getUsers, updateUser, updateUsers, getUsersWithPagination, getUsersCount };

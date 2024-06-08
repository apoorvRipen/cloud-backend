import { ROLE } from '../../models';

const addRole = async (payload: any) =>
  ROLE.create(payload);

const getRole = async (search = {}, project = {}) =>
  ROLE.findOne(search, project)
    .sort({ _id: -1 })
    .lean()
    .exec();

const getRoles = async (search = {}, project = {}) =>
  ROLE.find(search, project)
    .sort({ _id: -1 })
    .lean()
    .exec();

const updateRole = async (search = {}, payload = {}, optional={}) =>
  ROLE.findOneAndUpdate(search, payload, optional)
    .lean()
    .exec();

const updateRoles = async (search = {}, payload = {}, optional={}) =>
  ROLE.updateMany(search, payload, optional)
    .lean()
    .exec();

const getRolesWithPagination = async (search = {}, project = {}, optional: any) =>
  ROLE.find(search, project)
    .sort({ _id: -1 })
    .skip(optional.skip)
    .limit(optional.limit)
    .lean()
    .exec();

const getRolesCount = async (search = {}) => new Promise<number>((resolve, reject) => {
  ROLE.countDocuments(search)
    .then(resolve)
    .catch(reject);
});
export { addRole, getRole, getRoles, updateRole, updateRoles, getRolesWithPagination, getRolesCount };

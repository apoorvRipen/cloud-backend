import { Router } from 'express';
import { makeResponse } from '../../lib';
import { addRoleValidation, updateRoleValidation } from '../../middlewares';
import { addRole, updateRole, getRole, getRoles, getRolesWithPagination, getRolesCount, updateRoles } from '../../services';

const router = Router();

router
    .post(
        '/',
        addRoleValidation,
        async (req, res) => {
            const { Role } = req.body;
            const search = {
                'name': Role.name,
            };
            try {
                Role.email
                const exist = await getRole(search);

                if (exist) {
                    return makeResponse(res, 400, false, 'Role already exits', undefined);
                }
                const result = await addRole(req.body);
                await makeResponse(res, 200, true, "Role created successfully", result);
            } catch (error) {
                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);
            }
        })

    .put('/',
        updateRoleValidation,
        async (req, res) => {
            const { _id, ...payload } = req.body;

            try {

                if (payload?.Role) {
                    const isExist = await getRole({
                        _id: { $ne: _id },
                        'name': payload.name,
                    });

                    if (isExist) {
                        return makeResponse(res, 400, true, 'Role already exits');
                    }
                }

                const result = await updateRole({ _id }, payload, { new: true })
                await makeResponse(res, 200, true, 'Role updated successfully', result);
            } catch (error) {

                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);
            }
        })

    .get('/',
        (req, res) => {
            const { _id } = req.query as { _id: string };
            if (!_id) {
                return makeResponse(res, 400, false, "_id is required", undefined);
            }

            getRole({ _id, isDeleted: false })
                .then(async (result) => {
                    await makeResponse(res, 200, true, "Role fetched successfully", result);
                })
                .catch(async error => {
                    await makeResponse(res, 400, false, error.message, undefined);
                });
        }
    )

    .delete('/', (req, res) => {
        const { _ids } = req.body as any;
        if (!_ids || !_ids?.length) {
            return makeResponse(res, 400, false, "_id is required", undefined);
        }
        updateRoles({ _id: { $in: _ids } }, { isDeleted: true }, { new: true })
            .then(async (result) => {
                await makeResponse(res, 200, true, "Role deleted successfully", result);
            })
            .catch(async error => {
                await makeResponse(res, 400, false, error.message, undefined);
            });
    });

router
    .get('/list', async (req, res) => {
        const query = req.query as any;

        const searchQuery: any = query.search ? { isDeleted: false, $or: [] } : { isDeleted: false };

        const keys = Object.keys(query);
        keys.map((key: string) => {
            switch (key) {
                case 'search':
                    const regx = new RegExp(query.search ? query.search?.trim() : '' + '$', 'i');
                    if (searchQuery.$or) {
                        searchQuery.$or.push({ name: regx });
                    }
                    break;
                default:
                    searchQuery.$or.push({ [key]: query[key] });
                    break;
            }
        });

        try {
            if (query.pagination && query.pagination === 'true') {
                let page = 1;
                let limit = 20;
                let skip = 0;
                if (query.page) { page = Number(query.page); }
                if (query.limit) { limit = Number(query.limit); }
                skip = (page - 1) * limit;
                const documentsCount = await getRolesCount(searchQuery);
                const data = await getRolesWithPagination(searchQuery, { __v: 0 }, { skip, limit });
                await makeResponse(res, 200, true, "Role fetched successfully", data, {
                    page,
                    totalPages: Math.ceil(documentsCount / limit),
                    totalRecords: documentsCount
                });
            } else {
                const data = await getRoles(searchQuery, { __v: 0 });
                await makeResponse(res, 200, true, "Role fetched successfully", data);
            }
        } catch (error: any) {
            await makeResponse(res, 400, false, error.message, undefined);
        }
    });

export const RoleController = router;

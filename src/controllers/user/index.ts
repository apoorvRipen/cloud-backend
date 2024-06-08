import { Router } from 'express';
import { makeResponse } from '../../lib';
import { addUserValidation, updateUserValidation } from '../../middlewares';
import { addUser, updateUser, getUser, getUsers, getUsersWithPagination, getUsersCount, updateUsers } from '../../services';

const router = Router();

router
    .post(
        '/',
        addUserValidation,
        async (req, res) => {
            const { User } = req.body;
            const search = {
                'conatct.email': User.email,
                'conatct.mobileNumber.number': User.mobileNumber.number
            };
            try {
                User.email
                const exist = await getUser(search);

                if (exist) {
                    return makeResponse(res, 400, false, 'User already exits', undefined);
                }
                const result = await addUser(req.body);
                await makeResponse(res, 200, true, "User created successfully", result);
            } catch (error) {
                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);
            }
        })

    .put('/',
        updateUserValidation,
        async (req, res) => {
            const { _id, ...payload } = req.body;

            try {

                if (payload?.User) {
                    const isExist = await getUser({
                        _id: { $ne: _id },
                        'conatct.email': payload.User.email,
                        'conatct.mobileNumber.number': payload?.User?.mobileNumber.number,
                    });

                    if (isExist) {
                        return makeResponse(res, 400, true, 'User already exits');
                    }
                }

                const result = await updateUser({ _id }, payload, { new: true })
                await makeResponse(res, 200, true, 'User updated successfully', result);
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

            getUser({ _id, isDeleted: false })
                .then(async (result) => {
                    await makeResponse(res, 200, true, "User fetched successfully", result);
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
        updateUsers({ _id: { $in: _ids } }, { isDeleted: true }, { new: true })
            .then(async (result) => {
                await makeResponse(res, 200, true, "User deleted successfully", result);
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
                const documentsCount = await getUsersCount(searchQuery);
                const data = await getUsersWithPagination(searchQuery, { __v: 0 }, { skip, limit });
                await makeResponse(res, 200, true, "User fetched successfully", data, {
                    page,
                    totalPages: Math.ceil(documentsCount / limit),
                    totalRecords: documentsCount
                });
            } else {
                const data = await getUsers(searchQuery, { __v: 0 });
                await makeResponse(res, 200, true, "User fetched successfully", data);
            }
        } catch (error: any) {
            await makeResponse(res, 400, false, error.message, undefined);
        }
    });

export const UserController = router;

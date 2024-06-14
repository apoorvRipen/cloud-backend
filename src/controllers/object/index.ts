import { Router } from 'express';
import { IUser, RESPONSE_MESSAGE, makeResponse } from '../../lib';
import { addObjectValidation, updateObjectValidation } from '../../middlewares';
import { addObject, updateObject, getObject, getObjects, getObjectsWithPagination, getObjectsCount, updateObjects, singleUpload, generateThumbnail, getFileBlob } from '../../services';

const router = Router();

// add single object 
// add single folder
// Update name only
// Delete File 
// List all the rooot object
// all the object based on parent id 

router
    .post(
        '/upload',
        async (req: any, res) => {
            try {
                const file = await singleUpload(req, res);
                const path = await generateThumbnail(file.path || "", file.originalname || "", file.mimetype || "");

                await makeResponse(res, 200, true, RESPONSE_MESSAGE.create, path);
            } catch (error) {
                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);

            }
        })

    .post(
        '/',
        addObjectValidation,
        async (req, res) => {
            const { object } = req.body;
            const user = req.user as IUser;

            try {
                const result = await updateObject({ name: object.name }, { ...object, createdBy: user._id }, { upsert: true, new: true });
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.create, result);
            } catch (error) {
                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);
            }
        })

    .put('/',
        updateObjectValidation,
        async (req, res) => {
            const { _id, ...payload } = req.body;
            try {

                const isExist = await getObject({
                    _id: { $ne: _id },
                    name: payload.name,
                });

                if (isExist) {
                    return makeResponse(res, 400, true, RESPONSE_MESSAGE.exit);
                }

                const result = await updateObject({ _id }, payload, { new: true })
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.update, result);
            } catch (error) {

                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);
            }
        })

    .get('/',
        async (req, res) => {
            const { _id } = req.query as { _id: string };
            if (!_id) {
                return makeResponse(res, 400, false, RESPONSE_MESSAGE.id_required, undefined);
            }
            
            try {
                const blob = await getFileBlob("uploads/apoorv/images/Screenshot from 2024-06-06 00-09-16.png")
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch, blob);
            } catch (error: any) {
                await makeResponse(res, 400, false, error.message, undefined);
            }

            // getObject({ _id, status: { $ne: "DELETED" } })
            //     .then(async (result) => {
            //         await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch, result);
            //     })
            //     .catch(async error => {
            //     });
        }
    )

    .delete('/', (req, res) => {
        const { _ids } = req.body as any;
        if (!_ids || !_ids?.length) {
            return makeResponse(res, 400, false, RESPONSE_MESSAGE.id_required, undefined);
        }
        updateObjects({ _id: { $in: _ids } }, { status: "DELETED" }, { new: true })
            .then(async (result) => {
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.delete, result);
            })
            .catch(async error => {
                await makeResponse(res, 400, false, error.message, undefined);
            });
    });

router
    .get('/list', async (req, res) => {
        const query = req.query as any;

        const searchQuery: any = query.search ? { status: { $ne: "DELETED" }, $or: [] } : { status: { $ne: "DELETED" } };

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
                const documentsCount = await getObjectsCount(searchQuery);
                const data = await getObjectsWithPagination(searchQuery, { __v: 0 }, { skip, limit });
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch, data, {
                    page,
                    totalPages: Math.ceil(documentsCount / limit),
                    totalRecords: documentsCount
                });
            } else {
                const data = await getObjects(searchQuery, { __v: 0 });
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch, data);
            }
        } catch (error: any) {
            await makeResponse(res, 400, false, error.message, undefined);
        }
    });

export const ObjectController = router;

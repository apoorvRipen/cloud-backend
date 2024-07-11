import archiver from 'archiver';
import fs from 'fs'
import { Router } from 'express';
import { IUser, RESPONSE_MESSAGE, makeResponse } from '../../lib';
import { addObjectValidation, updateObjectValidation } from '../../middlewares';
import { updateObject, getObject, getObjects, getObjectsWithPagination, getObjectsCount, updateObjects, singleUpload, generateThumbnail, getFileBlob, getFilePath, generateZipPath } from '../../services';

const router = Router();

router
    .post(
        '/',
        addObjectValidation,
        async (req, res) => {
            const object = req.body;
            const user = req.user as IUser;

            try {
                const result = await updateObject({ originalName: object.originalName }, { ...object, createdBy: user._id }, { upsert: true, new: true });
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
                    originalName: payload.originalName,
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
                const object = await getObject({ _id, status: { $ne: "DELETED" } });
                const blob = await getFileBlob(String(object?.originalPath))
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch, { ...object, originalPath: blob });
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
    })

    .post('/upload',
        async (req, res) => {
            try {
                let path = {}
                const file = await singleUpload(req, res);

                if (file.path?.length) {
                    path = await generateThumbnail(file.path || "", file.originalname || "", file.mimetype || "");
                }

                await makeResponse(res, 200, true, RESPONSE_MESSAGE.create, { ...req.file, ...path });
            } catch (error) {
                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);

            }
        })

    .get(
        '/export',
        async (req, res) => {
            try {
                const user = req.user as IUser;
                const { objectsIds } = req.query; // Assuming fileIds are passed as query parameters

                const objects = await getObjects({ _id: { $in: objectsIds } });

                if (!objects.length) {
                    return makeResponse(res, 400, false, RESPONSE_MESSAGE.record_not_found, undefined);
                }

                const path = generateZipPath(user.firstName.toLowerCase());
                await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch);

                const archive = archiver('zip', {
                    zlib: { level: 5 }
                });

                for await (const object of objects) {
                    const { originalPath, originalName } = object;
                    const filePath = getFilePath(String(originalPath));

                    if (filePath) {
                        archive.file(filePath, { name: String(originalName) });
                    }
                }

                const output = fs.createWriteStream(path.zipFileName);
                archive.pipe(output);
                archive.finalize();
                output.on('close', () => {
                    console.log(`Zip file created successfully.`);
                });

            } catch (error) {
                await makeResponse(res, 400, false, (error as { message: string }).message, undefined);
            }
        });

router
    .get('/list', async (req, res) => {
        const query = req.query as any;

        const searchQuery: any = query.search ? { parentId: "root", status: { $ne: "DELETED" }, $or: [] } : { parentId: "root", status: { $ne: "DELETED" } };

        const keys = Object.keys(query);
        keys.map((key: string) => {
            switch (key) {
                case 'search':
                    const regx = new RegExp(query.search ? query.search?.trim() : '' + '$', 'i');
                    if (searchQuery.$or) {
                        searchQuery.$or.push({ originalName: regx });
                    }
                    break;
                case 'parentId':
                    searchQuery[key] = query[key];
                    break;
            }
        });

        try {
            if (query.pagination && query.pagination === 'true') {
                let page = 1;
                let limit: number | undefined = 20;
                let skip = 0;
                if (query.page) { page = Number(query.page); }
                if (query.limit) { limit = Number(query.limit); }

                if (query.skip === undefined || query.skip === 'true') {
                    skip = (page - 1) * limit;
                } else {
                    limit = ((page - 1) * limit + limit);
                }

                const documentsCount = await getObjectsCount(searchQuery);
                const data = await getObjectsWithPagination(searchQuery, { __v: 0 }, { skip, limit });

                const result = [];
                for await (const ele of data) {
                    try {
                        const blob = await getFileBlob(String(ele.thumbnailPath));
                        result.push({ ...ele, thumbnailPath: "data:image/webp;base64," + blob })
                    } catch (error) {
                        result.push({ ...ele, thumbnailPath: undefined })
                    }
                }

                await makeResponse(res, 200, true, RESPONSE_MESSAGE.fetch, result, {
                    page,
                    totalPages: typeof limit === "number" && Math.ceil(documentsCount / limit),
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

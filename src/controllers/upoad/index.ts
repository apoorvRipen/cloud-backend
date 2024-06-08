import { Router } from 'express';
import { makeResponse } from '../../lib';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript',
    mp4: 'video/mp4'
} as any;

router
    .post('/', upload.single('file'), async (req, res) => {
        await makeResponse(res, 200, true, "Files uploaded successfully");
    })

router
    .get('/test', async (req, res) => {
        const filePath = path.join(__dirname, '../../../', 'uploads/', 'abc.mp4');
        const {fileName} = req.query as { fileName: string };

        res.download(
            filePath,
            fileName, // Remember to include file extension
            (err) => {
                if (err && err.message.trim() !== "Request aborted") {
                    res.send({
                        error: err,
                        msg: "Problem downloading the file"
                    })
                }
            });

        // const type = mime[path.extname(file).slice(1)] || 'text/plain';
        // const stream = fs.createReadStream(file);
        // stream.on('open', function () {
        //     res.set('Content-Type', type);
        //     stream.pipe(res);
        // });
        // stream.on('error', function () {
        //     res.set('Content-Type', 'text/plain');
        //     res.status(404).end('Not found');
        // });
    })

export const uploadController = router;

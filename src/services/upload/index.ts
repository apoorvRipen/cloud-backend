import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { IUser } from '../../lib';
import { createDirectory } from '../common';

interface ISingleUpload {
    success: boolean,
    path?: string
    originalname?: string
    error?: any
}

const directoryFromMimetype = (mime: string) => {
    const name = mime.split("/")[0];
    switch (name) {
        case "image": return "images"
        case "video": return "videos"
        case "audio": return "audios"
        default: return "documents"
    }
}

const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        const user = req.user as IUser;

        const exactDirectory = directoryFromMimetype(file.mimetype)
        const path = `uploads/${user.firstName.toLowerCase()}/${exactDirectory}`;
        createDirectory(path);
        req.objectPath = { path, originalname: file.originalname };
        cb(null, path); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


const singleUpload = (req: any, res: any): Promise<ISingleUpload> => new Promise((rersolve, reject) => {
    multer({ storage: storage }).single("file")(req, res, (err) => {
        if (err) {
            reject({ success: false, err })
        }
        rersolve({ success: true, ...req.objectPath });
    })
})

const generateThumbnail = (imagePath: string, fileName: string) => new Promise ((resolve, reject) => {
    const splitedFileName = fileName.split(".");
    const allDirectories = imagePath.split("/");
    const originalPath = path.join(__dirname, "../../../", imagePath, "/", fileName);

    const fileNameWithoutExt = splitedFileName.slice(0, splitedFileName.length - 1).join(".");
    const thumbnailPath = allDirectories.slice(0, allDirectories.length - 1).join("/").concat("/thumbnails/");
    createDirectory(thumbnailPath);

    sharp(originalPath)
        .resize(100, 100)
        .toFile(thumbnailPath + fileNameWithoutExt + "_thumbnail.webp", (err, info) => {
            if (err) {
                reject(err)
            }
            resolve(info)
        });
});

export { singleUpload, generateThumbnail };





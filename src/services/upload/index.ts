import multer from 'multer';
import { IUser } from '../../lib';
import { createDirectory } from '../common';

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
    destination: (req, file, cb) => {
        const user = req.user as IUser;

        const exactDirectory = directoryFromMimetype(file.mimetype)
        const path = `uploads/${user.firstName.toLowerCase()}/${exactDirectory}`;

        createDirectory(path);
        cb(null, path); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const singleUpload = multer({ storage: storage }).single("file");

export { singleUpload };





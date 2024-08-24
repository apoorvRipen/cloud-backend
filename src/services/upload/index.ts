import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { IUser } from '../../lib';
import { createDirectory } from '../common';

interface ISingleUpload {
    success: boolean,
    path?: string
    originalname?: string
    mimetype?: string
    error?: any
}

interface IThumbnailGenerate {
    originalPath: string
    thumbnailPath?: string
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
        req.objectPath = { path, originalname: file.originalname, mimetype: file.mimetype };
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

// Function to find the project root by searching for package.json
function findRootDir(currentDir: string) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    
    const parentDir = path.dirname(currentDir);
    
    if (parentDir === currentDir) {
      throw new Error('Could not find the root directory');
    }
  
    return findRootDir(parentDir);
  }

const generateThumbnail = (imagePath: string, fileName: string, mimetype: string): Promise<IThumbnailGenerate> => new Promise((resolve, reject) => {
    const rootPath = findRootDir(__dirname);
    const splitedFileName = fileName.split(".");
    const allDirectories = imagePath.split("/");
    const originalPath = path.join(rootPath, "/", imagePath, "/", fileName);

    const fileNameWithoutExt = splitedFileName.slice(0, splitedFileName.length - 1).join(".");
    const thumbnailPath = allDirectories.slice(0, allDirectories.length - 1).join("/").concat("/thumbnails/");
    createDirectory(thumbnailPath);

    const fileType = directoryFromMimetype(mimetype)

    if (fileType === "images") {
        sharp(originalPath)
            .resize(250, 250)
            .toFile(thumbnailPath + fileNameWithoutExt + "_thumbnail.webp", (err, info) => {
                if (err) {
                    reject(err)
                }
                resolve({ originalPath: imagePath + "/" + fileName, thumbnailPath: thumbnailPath + fileNameWithoutExt + "_thumbnail.webp" })
            });
    } else {
        resolve({ originalPath: imagePath + "/" + fileName })
    }

});

const getFileBlob = (filePath: string) => new Promise((resolve, reject) => {
    const rootPath = findRootDir(__dirname);
    const originalPath = path.join(rootPath, "/", filePath);
    
    if (!fs.existsSync(originalPath)) {
        reject("")
    } else {
        fs.readFile(originalPath, (err, data) => {
            if (err) {
                reject(err)
            }

            const imageBlob = Buffer.from(data).toString('base64');
            resolve(imageBlob)
        });
    }

})

const generateZipPath = (name: string) =>  {
    const uploadPath = `uploads/${name}/export`
    const zipFileName = `files_${Date.now()}.zip`;
    const rootPath = findRootDir(__dirname);

    createDirectory(uploadPath);
    const originalPath = path.join(rootPath, "/", uploadPath);
    const zipFilePath = path.join(originalPath, zipFileName);

    return {zipFilePath, zipFileName, uploadPath};
}

const getFilePath = (filePath: string) =>  {
    const rootPath = findRootDir(__dirname);
    const originalPath = path.join(rootPath, "/", filePath);

    if (fs.existsSync(originalPath)) {
        return originalPath
    } else {
        return null;
    }
}

export { singleUpload, generateThumbnail, getFileBlob, getFilePath, generateZipPath };





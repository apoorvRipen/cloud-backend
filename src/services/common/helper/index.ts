import fs from 'fs';

export const createDirectory = (name: string) => {
    if (!fs.existsSync(name)) {
        const allDirectory = name.split("/");
        let path = "";

        allDirectory.forEach(directory => {
            path = path.concat(directory, "/");
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        })
    }

}
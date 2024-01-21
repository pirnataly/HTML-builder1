const fs = require('fs/promises');
const path = require('path');
const {Dirent} = require("fs");

let dirPath = path.resolve(__dirname, './secret-folder');

const readdir = fs.readdir;

async function read() {
    const files = await readdir(dirPath, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            const stat = await fs.stat(path.resolve(dirPath, file.name));
            const fileExtname = path.extname(file.name).slice(1);
            const fileName = path.parse(file.name).name;
            console.log(`${fileName} - ${fileExtname} - ${stat.size} bytes`);
        }
    }
}

read();

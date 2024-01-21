const fs = require('fs/promises');
const path = require('path');
const {read} = require("fs");

const originDirPath = path.resolve(__dirname, 'files');
const newDirPath = path.resolve(__dirname, 'files-copy');

async function copyDir() {

    const createDir = await fs.mkdir(newDirPath, {recursive: true});
    const files = await fs.readdir(originDirPath, {withFileTypes: true});
    let arr = [];

    files.forEach((file) => {
        arr.push(file.name);
    })

    const readNewDir = await fs.readdir(newDirPath);
    readNewDir.forEach((item) => {
        if (!arr.includes(item)) {
            fs.rm(path.resolve(newDirPath, item))
        }
    });
    for (const file of files) {
        await fs.copyFile(path.resolve(originDirPath, path.parse(file.name).base)
            , path.resolve(newDirPath, path.parse(file.name).base));
    }
}

copyDir();

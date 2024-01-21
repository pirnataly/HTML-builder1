const fsPromise = require('fs/promises');
const path = require('path');
const fs = require('fs');

const stylesPath = path.resolve(__dirname, 'styles');
const stylePath = path.resolve(__dirname, 'project-dist', 'style.css');
const templatePath = path.resolve(__dirname, 'template.html');
const componentsDirPath = path.resolve(__dirname, 'components');
const indexPath = path.resolve(__dirname, 'project-dist', 'index.html');

async function start() {
    await createDir();
    await compileCss();
    await copyAssets();
    await buildHtml();
}

async function createDir() {
    await fsPromise.mkdir(path.resolve(__dirname, 'project-dist'), {recursive: true});
}

async function copyAssets() {
    const src = path.resolve(__dirname, 'assets');
    const dest = path.resolve(__dirname, 'project-dist', 'assets');
    await copyFolder(src, dest)
}


async function copyFolder(src, dest) {
    const createDir = await fsPromise.mkdir(dest, {recursive: true});
    const files = await fsPromise.readdir(src, {withFileTypes: true});
    let arr = [];

    files.forEach((file) => {
        arr.push(file.name);
    })

    const readNewDir = await fsPromise.readdir(dest);
    readNewDir.forEach((item) => {
        if (!arr.includes(item)) {
            fsPromise.rm(path.resolve(dest, item))
        }
    });
    for (const file of files) {
        if (file.isDirectory()) {
            const oldSrcDirPath = path.resolve(src, path.parse(file.name).base);
            const newDestPath = path.resolve(dest, path.parse(file.name).base);
            await copyFolder(oldSrcDirPath, newDestPath);

        } else {
            await fsPromise.copyFile(path.resolve(src, path.parse(file.name).base)
                , path.resolve(dest, path.parse(file.name).base));
        }
    }
}

async function replaceAsync(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

async function buildHtml() {
    const text = await read(templatePath);
    const replacedString = await replaceAsync(text, /{{(.*?)}}/gi, changeText)
    await save(indexPath, replacedString);

}

async function changeText(match) {

    const word = match.replace('{{', '').replace('}}', '');
    const files = await fsPromise.readdir(componentsDirPath, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile() && (path.extname(file.name).slice(1) === 'html' && path.parse(file.name).name) === word) {

            const filePath = path.resolve(componentsDirPath, file.name);
            const newtext = await read(filePath);
            return newtext;
        }
    }
}


const arr = [];

function read(filePath) {
    return new Promise(resolve => {

        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.on('data', chunk => {
            resolve(chunk)
        });
    })


}


async function save(pathFile, data) {
    fsPromise.writeFile(
        pathFile,
        data,
        (err) => {
            if (err) throw err;
        }
    )
}


async function compileCss() {
    const files = await fsPromise.readdir(stylesPath, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile() && (path.extname(file.name).slice(1) === 'css')) {
            const filePath = path.resolve(stylesPath, file.name)
            const text = await read(filePath);
            arr.push(text)
        }
        await save(stylePath, arr);

    }
}

start();


const fsPromise = require('fs/promises');
const path = require('path');
const fs = require('fs');

const stylesPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');

const arr = [];

function read(file) {
    return new Promise(resolve => {
        const filePath = path.resolve(stylesPath, file.name)
        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.on('data', chunk => {
            arr.push(chunk)
            resolve()
        });
    })

}


async function save() {

    fsPromise.writeFile(
        bundlePath,
        arr.join(''),
        (err) => {
            if (err) throw err;
        }
    )
}


async function getlist() {
    const files = await fsPromise.readdir(stylesPath, {withFileTypes: true});
    for (const file of files) {
        if (file.isFile() && (path.extname(file.name).slice(1) === 'css')) {
            await read(file);
        }
        await save();
    }
}

getlist();

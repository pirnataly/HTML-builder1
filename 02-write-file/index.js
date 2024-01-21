const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;
stdout.write('Enter text...\n');

const filePath = path.resolve(__dirname, './text.txt');
fs.writeFile(
    filePath,
    '',
    (err) => {
        if (err) throw err;
    }
);

stdin.on('data', data => {
    if (data.toString().trim()==='exit') {
        stdout.write('Good bye!');
        process.exit();
    }
    fs.appendFile(
        filePath,
        `${data}`,
        err => {
            if (err) throw err;
        }
    )})

process.on("SIGINT", function () {
    stdout.write('Good bye!');
    process.exit();
})

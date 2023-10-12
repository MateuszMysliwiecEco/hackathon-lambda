const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const target = 'bundle.zip';

const output = fs.createWriteStream(target);
output.on('close', function () {
    console.log(`build completed: ${archive.pointer()} total bytes (${target})`);
});

const archive = archiver('zip');
archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

archive.directory(path.resolve(__dirname, 'dist'), false);
archive.directory(path.resolve(__dirname, 'openapi'), 'openapi');

archive.finalize();

const fs = require('fs');
const path = require('path');
const { getFileSize, cutFileToDir, getProcessBar,collectAllFiles, computeFileMD5 } = require('./utils')

const photoDir = path.join(__dirname, 'photos');
const sameDir = path.join(__dirname, 'same');
const bigDir = path.join(__dirname, 'big');

if (!fs.existsSync(sameDir)) fs.mkdirSync(sameDir);
if (!fs.existsSync(bigDir)) fs.mkdirSync(bigDir);

const filesArr = [];

collectAllFiles(photoDir, filesArr);

const md5Set = new Set();

const total = filesArr.length;

console.log(`一共${total}个文件，开始处理`)

filesArr.forEach((perFile, index) => {
    const fileSize = getFileSize(perFile);
    const barStr = getProcessBar(total, index + 1);
    if (fileSize > 10) {
        cutFileToDir(perFile, bigDir);
        process.stdout.cursorTo(0)
        console.log(barStr);
        return
    }

    const md5Str = computeFileMD5(perFile);
    if (md5Set.has(md5Str)) {
        cutFileToDir(perFile, sameDir)
    } else {
        md5Set.add(md5Str);
    }
    process.stdout.cursorTo(0)
    process.stdout.write(barStr);
})
console.log('')
console.log('处理完毕!');


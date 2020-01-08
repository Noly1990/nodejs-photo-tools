const fs = require('fs');
const path = require('path');
const crypto = require('crypto');


function computeFileMD5(filePath) {
    if (fs.statSync(filePath).isDirectory()) throw new Error('computeFileMD5 on dir')
    const hash = crypto.createHash('md5');
    const fileBuffer = fs.readFileSync(filePath);
    hash.update(fileBuffer);
    return hash.digest('hex');
}

function deleteDir(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteDir(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


function copyDir(sourceDir, aimDir) {
    if (!fs.existsSync(aimDir)) fs.mkdirSync(aimDir);
    let files = fs.readdirSync(sourceDir);
    if (files.length > 0) {
        files.forEach(per => {
            let theFilePath = sourceDir + '/' + per;
            if (fs.statSync(theFilePath).isDirectory()) {
                copyDir(theFilePath, aimDir + '/' + per);
            } else {
                fs.copyFileSync(theFilePath, aimDir + '/' + per);
            }
        })
    }
}

function cutFile(sourceDir, aimDir) {
    if (!fs.existsSync(sourceDir)) {
        throw new Error('no source dir')
    }

    if (!fs.existsSync(aimDir)) {
        fs.copyFileSync(sourceDir, aimDir);
        fs.unlinkSync(sourceDir);
    } else {
        fs.copyFileSync(sourceDir, aimDir + '.copy')
        fs.unlinkSync(sourceDir)
    }
}

function getFileSize(path) {
    return parseFloat((fs.statSync(path).size / 1024 / 1024).toFixed(2))
}

function collectAllFiles(dirPath, filesArr) {
    if (!isDirectory(dirPath)) throw new Error('collectAllFiles must a dir path');

    let files = fs.readdirSync(dirPath);
    if (files && files.length > 0) {
        files.forEach(perPath => {
            let childPath = path.join(dirPath, perPath)
            if (isDirectory(childPath)) {
                collectAllFiles(childPath, filesArr)
            } else {
                filesArr.push(childPath);
            }
        })
    }
}

function isDirectory(path) {
    return fs.statSync(path).isDirectory()
}

function cutFileToDir(sourcePath, aimDir) {
    if (!fs.existsSync(sourcePath)) {
        throw new Error('no source dir')
    }

    const fileName = path.basename(sourcePath);
    const aimFile = path.join(aimDir, fileName);

    if (!fs.existsSync(aimFile)) {
        fs.copyFileSync(sourcePath, aimFile);
        fs.unlinkSync(sourcePath);
    } else {
        fs.copyFileSync(sourcePath, aimFile + '.copy')
        fs.unlinkSync(sourcePath)
    }
}


function getProcessBar(total, recent) {
    let arr = [
        '=', '=', '=', '=', '=', '=', '=', '=', '=', '=',
        '=', '=', '=', '=', '=', '=', '=', '=', '=', '=',
        '=', '=', '=', '=', '=', '=', '=', '=', '=', '=',
        '=', '=', '=', '=', '=', '=', '=', '=', '=', '=',
    ]
    const percent = Math.floor(recent / total * 100);
    const starLen = Math.floor(recent / total * arr.length);
    for (let i = 0; i < starLen; i++) {
        arr[i] = '*'
    }
    return `请稍后，${arr.join('')}，${percent}%`
}


module.exports = {
    copyDir,
    deleteDir,
    cutFile,
    computeFileMD5,
    getFileSize,
    collectAllFiles,
    cutFileToDir,
    getProcessBar
}
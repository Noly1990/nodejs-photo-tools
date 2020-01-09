// {
//     ImageWidth: 2736,
//     ImageHeight: 3648,
//     BitsPerSample: 8,
//     Make: 'HUAWEI',
//     Model: 'LYA-AL00',
//     Orientation: 0,
//     XResolution: [ 72 ],
//     YResolution: [ 72 ],
//     ResolutionUnit: 2,
//     Software: 'LYA-AL00 9.1.0.139(C00E133R1P20)',
//     DateTime: '2020:01:01 15:03:15',
//     YCbCrPositioning: 1,
//     ExifIFDPointer: 288,
//     GPSInfoIFDPointer: 1334,
//     DeviceSettingDescription: '0x69707000',
//     SubExif: {
//       ExposureTime: [ 0.02 ],
//       FNumber: [ 1.8 ],
//       ExposureProgram: 2,
//       PhotographicSensitivity: 250,
//       ExifVersion: '0210',
//       DateTimeOriginal: '2020:01:01 15:03:15',
//       DateTimeDigitized: '2020:01:01 15:03:15',
//       ComponentsConfiguration: '0x01020300',
//       CompressedBitsPerPixel: [ 0.95 ],
//       ShutterSpeedValue: 29.8973,
//       ApertureValue: [ 1.69 ],
//       BrightnessValue: 0,
//       ExposureBiasValue: 0,
//       MaxApertureValue: [ 1.69 ],
//       MeteringMode: 5,
//       LightSource: 1,
//       Flash: 0,
//       FocalLength: [ 5.58 ],
//       MakerNote: '0x4175746f00',
//       SubSecTime: '401697',
//       SubSecTimeOriginal: '401697',
//       SubSecTimeDigitized: '401697',
//       FlashpixVersion: '0x30313030',
//       ColorSpace: 1,
//       PixelXDimension: 2736,
//       PixelYDimension: 3648,
//       InteroperabilityIFDPointer: 1304,
//       SensingMethod: 2,
//       FileSource: '0x03000000',
//       SceneType: 1,
//       CustomRendered: 1,
//       ExposureMode: 0,
//       WhiteBalance: 0,
//       DigitalZoomRatio: [ 1 ],
//       FocalLengthIn35mmFilm: 27,
//       SceneCaptureType: 0,
//       GainControl: 0,
//       Contrast: 0,
//       Saturation: 0,
//       Sharpness: 0,
//       SubjectDistanceRange: 0
//     },
//     GPSInfo: {
//       GPSVersionID: 2,
//       GPSLatitudeRef: 'N',
//       GPSLatitude: [ 29, 6, 24.43222 ],
//       GPSLongitudeRef: 'E',
//       GPSLongitude: [ 119, 38, 56.73706 ],
//       GPSAltitudeRef: 1,
//       GPSAltitude: [ 0 ],
//       GPSTimeStamp: [ 7, 3, 13 ],
//       GPSProcessingMethod: 'CELLID',
//       GPSDateStamp: '2020:01:01'
//     }
//   }

const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const exif = require("jpeg-exif");

const fileDir = 'F:\天翼云盘';

// 照片源目录
const photoDir = path.join(fileDir, 'mate20pro');

// 分类后的目录
const classifyDir = path.join(fileDir, 'photos');
const notImgDir = path.join(classifyDir, 'notimg');
const noDateDir = path.join(classifyDir, 'nodate');


utils.dirNoCreate(classifyDir);
utils.dirNoCreate(notImgDir);
utils.dirNoCreate(noDateDir);


const filesArr = [];

utils.collectAllFiles(photoDir, filesArr);

const total = filesArr.length;

console.log(`一共${total}个文件，开始处理`)

filesArr.forEach((perFile, index) => {
    const barStr = utils.getProcessBar(total, index + 1);
    if (utils.isJpg(perFile)) {
        const exifData = exif.parseSync(perFile);
        const dateDir = path.join(classifyDir, utils.parseExifDate(exifData ? exifData.DateTime : ''));
        utils.dirNoCreate(dateDir);
        utils.copyFileToDir(perFile, dateDir);
    }
    utils.myConsole(barStr);
})

console.log('')
console.log('处理完毕!');

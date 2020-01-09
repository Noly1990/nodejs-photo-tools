const fs = require('fs');

const path = require('path');

const exif = require("jpeg-exif");

const data = exif.parseSync('./abc.JPG');

const data2 = exif.parseSync('./cde.jpg');

console.log(data2.DateTime.substring(0, 4), data2.DateTime.substring(5, 7), data2.DateTime.substring(8, 10));
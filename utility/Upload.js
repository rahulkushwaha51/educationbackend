require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const DataUriParser = require("datauri/parser.js");
const path = require("path");
// const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("./errorHandler");

cloudinary.config({
    cloud_name: 'rahul5198',
    api_key: '692923422411118',
    api_secret: 'lmtVseEPdc235zyYaWzK9ksptdU',
    secure: true
});


const uploadFile = async function (file) {
    const parser = new DataUriParser();
    if (!file.originalname) {
        return next(new ErrorHandler("File original is missing"));
    }
    const extName = path.extname(file.originalname).toString();
    formatedata = parser.format(extName, file.buffer);

    return formatedata;
};

module.exports = uploadFile;

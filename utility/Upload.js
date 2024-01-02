require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const DataUriParser = require("datauri/parser.js");
const path = require("path");
// const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("./errorHandler");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure:true
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

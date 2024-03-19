const AWS = require("aws-sdk");
const { v4: uuid } = require('uuid');
require('dotenv').config();

const REGION = process.env.AWS_REGION;
const ACCESS_KEY =process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Cấu hình AWS SDK
AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
});

exports.uploadToS3 = async (file, folder) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: `uploads/${uuid()}-${file.originalname}`, // `uploads/${uuid()}-${file.originalname}`
        Body: file.buffer,
    };
    // console.log(params);
    // return params;
    return await s3.upload(params).promise();
}

// upload mutiple files
exports.uploadMultipleToS3 = async (files, folder) => {
    const s3 = new AWS.S3();
    const uploadPromises = files.map(file => {
        const params = {
            Bucket: BUCKET_NAME,
            Key: `uploads/${uuid()}-${file.originalname}`,
            Body: file.buffer,
        };
        return s3.upload(params).promise();
    });

    return await Promise.all(uploadPromises);
}


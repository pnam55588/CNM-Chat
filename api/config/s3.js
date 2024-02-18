const AWS = require("aws-sdk");
const config = require("./config.json");
const { v4: uuid } = require('uuid');

const REGION = config.AWS_DEFAULT_REGION;
const ACCESS_KEY = config.AWS_ACCESS_KEY;
const SECRET_KEY = config.AWS_SECRET_KEY;

// Cấu hình AWS SDK
AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
});

exports.uploadToS3 = async (file, folder) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${file.originalname}`, // `uploads/${uuid()}-${file.originalname}`
        Body: file.buffer,
    };

    return await s3.upload(params).promise();
}

// upload mutiple files
exports.uploadMultipleToS3 = async (files, folder) => {
    const s3 = new AWS.S3();
    const uploadPromises = files.map(file => {
        const params = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: `uploads/${uuid()}-${file.originalname}`,
            Body: file.buffer,
        };
        return s3.upload(params).promise();
    });

    return await Promise.all(uploadPromises);
}


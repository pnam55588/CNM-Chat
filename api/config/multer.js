const multer = require('multer');
const { v4: uuid } = require('uuid');

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
}
const videoFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'video') {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
}



const uploadImage= multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: 1024 * 1024 * 5 } }); // 5MB
const uploadVideo= multer({ storage: storage, fileFilter: videoFilter, limits: { fileSize: 1024 * 1024 * 50 } }); // 50MB
const uploadFile = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 50 } }); // 50MB


module.exports.uploadImage = uploadImage;
module.exports.uploadVideo = uploadVideo;
module.exports.uploadFile = uploadFile;

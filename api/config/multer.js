const multer = require('multer');
const { v4: uuid } = require('uuid');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } }); // 5MB

module.exports = upload;

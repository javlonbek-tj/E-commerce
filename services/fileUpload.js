import multer from 'multer';
const { ensureDir } = require('fs-extra');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationDir = 'images';
    await ensureDir(destinationDir);
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

export default upload;

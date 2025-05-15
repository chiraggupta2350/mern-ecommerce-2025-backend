import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/s3Config.js';

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `products/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

export default upload;

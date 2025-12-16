import multer from 'multer'

const storage = multer.diskStorage({
  destination: './uploads/userProfiles', // Directory to save files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

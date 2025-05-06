const multer = require("multer");
const Path = require("path");
const fs = require("fs");

module.exports = {
  // upload file
  async fileUpload(req, res) {
    try {
      // Create uploads folder if not exists
      const uploadDir = Path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log("Invalid file type. Only JPEG, PNG, and PDF allowed.");
          cb(new Error("Invalid file type. Only JPEG, PNG, and PDF allowed."));
        }
      };

      // File storage and validation
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          // Use Date.now() + original name for uniqueness
          cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
        },
      });

      const upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter,
      }).single("file");

      upload(req, res, async function (err) {
        if (err) {
          console.error(err.message);
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: "File upload failed" });
        }
        res.status(200).json({
          message: "File uploaded successfully",
          filename: req.file.filename,
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  // fetch file

  async fetchFile(req, res) {
    try {
      const file = req.params.filename
      if (!file || file == ":filename"){
        return res.status(404).json({ error: 'please pass filename' });
      }
      const filename = Path.basename(file);
      const uploadDir = Path.join(__dirname, "uploads");
      const filePath = Path.join(uploadDir, filename);

      // Check file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: 'File not found' });
    }

    

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error downloading file' });
      }
    });

    
  });
    } catch (error) {
      console.log(error);
    }
  },
};

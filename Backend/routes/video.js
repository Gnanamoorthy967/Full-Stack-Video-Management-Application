require("dotenv").config(); // Load environment variables
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const videoDir = path.join(__dirname, "../", process.env.VIDEO_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename); // Ensure unique filenames
  },
});

const upload = multer({ storage });
router.post("/record", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file uploaded." });
  }
  res.status(200).json({
    message: "Video uploaded successfully!",
    filename: req.file.filename,
  });
});
router.get("/videos", (req, res) => {
    fs.readdir(videoDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to retrieve videos." });
      }
  
      const videoList = files.map((file) => ({
        name: file,
        url: `http://localhost:${process.env.PORT}/videos/${file}`,
      }));
  
      res.status(200).json(videoList);
    });
  });
  router.get("/video/:id", (req, res) => {
    const videoPath = path.join(videoDir, req.params.id);
    
    if (!fs.existsSync(videoPath)) {
      console.error("file not found: ", videoPath);
      return res.status(404).json({ error: "Video not found." });
    }
  
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        // Handle range requests for video streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    if (start >= fileSize || end >= fileSize) {
      return res.status(416).send("Requested range not satisfiable");
    }
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        };
    
        res.writeHead(206, headers);
        file.pipe(res);
      } else {
        // Serve entire video file if no range is specified
        const headers = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
      }
    });
    
    module.exports = router;
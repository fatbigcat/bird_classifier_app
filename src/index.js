const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data"); // Add this import
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST"],
  })
);

app.post("/api/classify", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: "audio.webm",
      contentType: "audio/webm",
    });

    const response = await axios.post(
      `https://studio.edgeimpulse.com/v1/api/${process.env.EDGE_IMPULSE_PROJECT_ID}/classify`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.EDGE_IMPULSE_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Classification error:", error);
    res.status(500).json({ error: "Failed to classify audio" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

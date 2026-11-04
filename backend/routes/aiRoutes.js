const express = require("express");

const {
  analyzeTranscript
} = require("../controllers/aiController");

const router = express.Router();

router.post("/analyze", analyzeTranscript);

module.exports = router;
const express = require("express");

const {
  createComplaint,
  getAllComplaints
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", createComplaint);

router.get("/", getAllComplaints);

module.exports = router;
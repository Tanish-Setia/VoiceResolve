const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

  ticketId: {
    type: String,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: [
      "IT",
      "Infrastructure",
      "Electrical",
      "Water",
      "Cleanliness",
      "Hostel",
      "Academic",
      "Other"
    ],
    required: true
  },

  location: {
    type: String,
    required: true,
    trim: true
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  department: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      "Open",
      "In Progress",
      "Resolved",
      "Rejected"
    ],
    default: "Open"
  },

  resolutionNote: {
    type: String,
    default: ""
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Complaint", complaintSchema);
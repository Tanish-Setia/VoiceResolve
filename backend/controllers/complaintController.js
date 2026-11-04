const Complaint = require("../models/Complaint");

const { generateTicketId } =
  require("../services/ticketService");

const createComplaint = async (req, res) => {

  try {

    const {
      title,
      description,
      category,
      location,
      priority,
      department
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !priority ||
      !department
    ) {

      return res.status(400).json({
        success: false,
        message: "All complaint fields are required"
      });

    }

    const ticketId = await generateTicketId();

    const complaint = await Complaint.create({

      ticketId,
      title,
      description,
      category,
      location,
      priority,
      department

    });

    return res.status(201).json({

      success: true,

      message: "Complaint registered successfully",

      complaint

    });

  } catch (error) {

    console.error("Complaint Creation Error:", error);

    return res.status(500).json({

      success: false,

      message: "Unable to register complaint"

    });

  }

};

const getAllComplaints = async (req, res) => {

  try {

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({

      success: true,

      count: complaints.length,

      complaints

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: "Unable to fetch complaints"

    });

  }

};


module.exports = {
  createComplaint,
  getAllComplaints
};
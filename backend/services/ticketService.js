const Counter = require("../models/Counter");

const generateTicketId = async () => {

  const counter = await Counter.findOneAndUpdate(

    { name: "complaintTicket" },

    { $inc: { sequence: 1 } },

    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }

  );

  const ticketNumber = counter.sequence
    .toString()
    .padStart(4, "0");

  return `VR-${ticketNumber}`;
};

module.exports = { generateTicketId };
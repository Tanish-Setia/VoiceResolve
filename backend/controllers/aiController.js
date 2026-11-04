const { analyzeComplaint } =
  require("../services/groqService");

const analyzeTranscript = async (req, res) => {

  try {

    const { transcript } = req.body;

    // Validate input
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required"
      });
    }

    // Call Groq service
    const result = await analyzeComplaint(transcript);

    // Send AI response
    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("AI Analysis Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze complaint"
    });

  }
};

module.exports = { analyzeTranscript };
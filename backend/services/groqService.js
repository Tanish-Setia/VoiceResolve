const Groq = require("groq-sdk");
const { complaintSystemPrompt } = require("../utils/prompts");

const analyzeComplaint = async (transcript) => {

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const completion = await groq.chat.completions.create({

    messages: [
      {
        role: "system",
        content: complaintSystemPrompt
      },
      {
        role: "user",
        content: transcript
      }
    ],

    model: process.env.GROQ_MODEL,
    temperature: 0.2

  });

  const aiResponse =
    completion.choices[0].message.content;

  const parsedResponse = JSON.parse(aiResponse);

  return parsedResponse;
};

module.exports = { analyzeComplaint };
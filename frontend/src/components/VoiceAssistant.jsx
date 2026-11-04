import { useState, useRef } from "react";
import API from "../services/api";
import { startListening, speakResponse } from "../services/speechService";

import "./VoiceAssistant.css";

function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [createdComplaint, setCreatedComplaint] = useState(null);
  const recognitionRef = useRef(null);

  const handleVoiceResult = async (text) => {
    setTranscript(text);
    setAnalysis(null);
    setError("");
    setIsProcessing(true);

    try {
      const response = await API.post("/ai/analyze", {
        transcript: text,
      });

      const result = response.data.data;

      setAnalysis(result);
      const message = result.followUpQuestion || result.response;

      if (message) {
        speakResponse(message);
      }
    } catch (err) {
      console.error("AI Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );

      speakResponse("Sorry, I could not process your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateComplaint = async () => {
    if (!analysis || analysis.intent !== "create_complaint") {
      return;
    }

    if (analysis.missingFields?.length > 0) {
      setError("Please provide the missing complaint details.");
      return;
    }

    if (analysis.followUpQuestion) {
      setError("Please answer the AI's follow-up question first.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await API.post("/complaints", {
        title: analysis.complaint.title,
        description: analysis.complaint.description,
        category: analysis.complaint.category,
        location: analysis.complaint.location,
        priority: analysis.complaint.priority,
        department: analysis.complaint.department,
      });

      const savedComplaint = response.data.complaint;

      setCreatedComplaint(savedComplaint);

      speakResponse(
        `Your complaint has been registered successfully. Your ticket number is ${savedComplaint.ticketId}.`,
      );
    } catch (err) {
      console.error("Complaint Creation Error:", err);

      setError(
        err.response?.data?.message || "Unable to register your complaint.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartListening = () => {
    setError("");
    setTranscript("");
    setAnalysis(null);
    setCreatedComplaint(null);
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = startListening(
      (text) => {
        handleVoiceResult(text);
      },

      (message) => {
        setError(message);
        setIsListening(false);
      },

      () => {
        setIsListening(false);
      },
    );

    recognitionRef.current = recognition;

    if (recognition) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  };

  return (
    <div className="voice-container">
      <div className="voice-header">
        <h1>VoiceResolve</h1>

        <p>Your AI-powered campus grievance assistant</p>
      </div>

      <div className="voice-card">
        <div className="assistant-icon">
          <span>🎙️</span>
        </div>

        <h2>
          {isListening
            ? "Listening to you..."
            : isProcessing
              ? "Understanding your complaint..."
              : "How can I help you today?"}
        </h2>

        <p className="voice-description">
          Speak naturally about any problem you are facing on campus.
        </p>

        <button
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isProcessing}
        >
          {isListening ? "■" : "🎤"}
        </button>

        <p className="mic-label">
          {isListening
            ? "Click to stop listening"
            : isProcessing
              ? "Please wait..."
              : "Click to speak"}
        </p>

        {transcript && (
          <div className="transcript-box">
            <h3>You said:</h3>

            <p>{transcript}</p>
          </div>
        )}

        {isProcessing && (
          <div className="loading-message">AI is analyzing your request...</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {analysis && (
          <div className="analysis-box">
            <h3>AI Understanding</h3>

            <div className="detail-row">
              <span>Intent</span>
              <strong>{analysis.intent}</strong>
            </div>

            {analysis.intent === "create_complaint" && analysis.complaint && (
              <>
                <div className="detail-row">
                  <span>Title</span>
                  <strong>{analysis.complaint.title}</strong>
                </div>

                <div className="detail-row">
                  <span>Category</span>
                  <strong>{analysis.complaint.category}</strong>
                </div>

                <div className="detail-row">
                  <span>Location</span>
                  <strong>
                    {analysis.complaint.location || "Not provided"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Priority</span>
                  <strong>{analysis.complaint.priority}</strong>
                </div>

                <div className="detail-row">
                  <span>Department</span>
                  <strong>{analysis.complaint.department}</strong>
                </div>
              </>
            )}

            <div className="ai-response">
              <strong>VoiceResolve says:</strong>

              <p>{analysis.followUpQuestion || analysis.response}</p>
            </div>
            {analysis.intent === "create_complaint" &&
              analysis.missingFields?.length === 0 &&
              !analysis.followUpQuestion &&
              !createdComplaint && (
                <button
                  className="confirm-button"
                  onClick={handleCreateComplaint}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Registering Complaint..."
                    : "Confirm & Register Complaint"}
                </button>
              )}
            {createdComplaint && (
              <div className="success-box">
                <h3>Complaint Registered Successfully!</h3>

                <h2>{createdComplaint.ticketId}</h2>

                <p>Your complaint has been saved successfully.</p>

                <p>Status: {createdComplaint.status}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceAssistant;

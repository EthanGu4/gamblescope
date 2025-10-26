import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { generateMockBettingActivity } from "../utils/mockDataGenerator";
import "./OpenBet.css";

function OpenBet() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    subject: "",
    testName: "",
    threshold: 70,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // For numeric fields, remove leading zeros
    if (name === "threshold") {
      processedValue = value === "" ? 0 : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create new bet
    const newBet = {
      id: Date.now().toString(),
      openerId: currentUser.id,
      openerUsername: currentUser.username,
      openerAvatar: currentUser.avatar,
      subject: formData.subject,
      testName: formData.testName,
      threshold: parseFloat(formData.threshold),
      description: formData.description,
      status: "open", // open, revealed, closed
      actualScore: null,
      actualPercentage: null,
      createdAt: new Date().toISOString(),
      revealedAt: null,
      totalBets: 0,
      totalPot: 0,
    };

    // Generate mock betting activity for the new bet
    const mockBets = generateMockBettingActivity(newBet.id, newBet);
    const higherBets = mockBets.filter((b) => b.prediction === "higher");
    const lowerBets = mockBets.filter((b) => b.prediction === "lower");
    const higherTotal = higherBets.reduce((sum, b) => sum + b.amount, 0);
    const lowerTotal = lowerBets.reduce((sum, b) => sum + b.amount, 0);

    // Add mock data to the bet
    const betWithMockData = {
      ...newBet,
      individualBets: mockBets,
      totalBets: mockBets.length,
      totalPot: higherTotal + lowerTotal,
      higherTotal: higherTotal,
      lowerTotal: lowerTotal,
    };

    // Save to localStorage
    const existingBets = JSON.parse(
      localStorage.getItem("gamblescope_bets") || "[]",
    );
    const updatedBets = [betWithMockData, ...existingBets];
    localStorage.setItem("gamblescope_bets", JSON.stringify(updatedBets));

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "success",
        text: `Bet opened successfully! Other users can now bet on whether you scored over or under ${formData.threshold}%`,
      });

      // Reset form
      setFormData({
        subject: "",
        testName: "",
        threshold: 85,
        description: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Economics",
    "Psychology",
    "Other",
  ];

  return (
    <div className="open-bet">
      <div className="open-bet-header">
        <h2>Open a Bet</h2>
        <p>Create a bet for others to wager on your test performance</p>
      </div>

      <div className="open-bet-content">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="bet-form">
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="testName">Test Name *</label>
              <input
                type="text"
                id="testName"
                name="testName"
                value={formData.testName}
                onChange={handleInputChange}
                placeholder="e.g., Midterm, Final, Quiz 3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="threshold">Score Threshold (%) *</label>
              <input
                type="number"
                id="threshold"
                name="threshold"
                value={formData.threshold}
                onChange={handleInputChange}
                placeholder="85"
                min="0"
                max="100"
                required
              />
              <small className="form-help">
                Others will bet on whether you scored higher or lower than this
                percentage
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add any additional details about the test..."
                rows="3"
              />
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                <span className="message-icon">
                  {message.type === "success" ? "✅" : "⚠️"}
                </span>
                {message.text}
              </div>
            )}

            <div className="bet-preview">
              <h4>Bet Preview:</h4>
              <div className="preview-card">
                <div className="preview-header">
                  <h5>
                    {formData.subject || "Subject"} -{" "}
                    {formData.testName || "Test Name"}
                  </h5>
                  <span className="preview-status">Open for Betting</span>
                </div>
                <div className="preview-details">
                  <p>
                    <strong>Threshold:</strong> {formData.threshold}%
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {formData.description || "No description provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={() =>
                  setFormData({
                    subject: "",
                    testName: "",
                    threshold: 85,
                    description: "",
                  })
                }
              >
                Reset
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Opening Bet..." : "Open Bet"}
              </button>
            </div>
          </form>
        </div>

        <div className="info-panel">
          <h3>💡 How Opening Bets Works</h3>
          <ul>
            <li>Set a score threshold (e.g., 85%)</li>
            <li>Other users bet on whether you scored higher or lower</li>
            <li>You can reveal your actual score anytime</li>
            <li>Winners get paid based on the odds</li>
            <li>
              You don't need to put money in - others bet on your performance
            </li>
          </ul>

          <div className="recent-bets">
            <h4>🎯 Recent Open Bets</h4>
            <div className="recent-list">
              <div className="recent-item">
                <span className="recent-subject">Math - Calculus Midterm</span>
                <span className="recent-threshold">85% threshold</span>
              </div>
              <div className="recent-item">
                <span className="recent-subject">
                  Physics - Mechanics Final
                </span>
                <span className="recent-threshold">90% threshold</span>
              </div>
              <div className="recent-item">
                <span className="recent-subject">Chemistry - Organic Quiz</span>
                <span className="recent-threshold">75% threshold</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenBet;

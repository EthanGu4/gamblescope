import React, { useState } from "react";
import "./PostScore.css";

function PostScore() {
  const [formData, setFormData] = useState({
    subject: "",
    testName: "",
    score: "",
    maxScore: "",
    isPublic: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const percentage = Math.round((formData.score / formData.maxScore) * 100);
      alert(
        `Score posted successfully!\n${formData.subject} - ${formData.testName}\n${formData.score}/${formData.maxScore} (${percentage}%)\n${formData.isPublic ? "Public" : "Private"}`,
      );

      // Reset form
      setFormData({
        subject: "",
        testName: "",
        score: "",
        maxScore: "",
        isPublic: true,
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
    <div className="post-score">
      <div className="post-score-header">
        <h2>📝 Post Your Score</h2>
        <p>Share your test results for others to bet on</p>
      </div>

      <div className="post-score-content">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="score-form">
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

            <div className="score-inputs">
              <div className="form-group">
                <label htmlFor="score">Your Score *</label>
                <input
                  type="number"
                  id="score"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  placeholder="87"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxScore">Max Score *</label>
                <input
                  type="number"
                  id="maxScore"
                  name="maxScore"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {formData.score && formData.maxScore && (
              <div className="score-preview">
                <h4>Score Preview:</h4>
                <div className="preview-card">
                  <div className="preview-score">
                    <span className="score-value">
                      {formData.score}/{formData.maxScore}
                    </span>
                    <span className="percentage">
                      ({Math.round((formData.score / formData.maxScore) * 100)}
                      %)
                    </span>
                  </div>
                  <div className="preview-info">
                    <p>
                      <strong>{formData.subject}</strong> - {formData.testName}
                    </p>
                    <p className="visibility">
                      {formData.isPublic ? "🌍 Public" : "🔒 Private"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Make this score public for betting
              </label>
              <p className="checkbox-help">
                Public scores can be bet on by other students. Private scores
                are only visible to you.
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="reset-button"
                onClick={() =>
                  setFormData({
                    subject: "",
                    testName: "",
                    score: "",
                    maxScore: "",
                    isPublic: true,
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
                {isSubmitting ? "Posting..." : "Post Score"}
              </button>
            </div>
          </form>
        </div>

        <div className="info-panel">
          <h3>💡 Tips for Posting Scores</h3>
          <ul>
            <li>Be honest about your scores - integrity is important</li>
            <li>Include specific test names for clarity</li>
            <li>Public scores get more betting activity</li>
            <li>You can always change privacy settings later</li>
            <li>Consider the betting potential when making scores public</li>
          </ul>

          <div className="recent-scores">
            <h4>📊 Recent Scores</h4>
            <div className="recent-list">
              <div className="recent-item">
                <span className="recent-score">92/100</span>
                <span className="recent-info">Physics - Mechanics Final</span>
              </div>
              <div className="recent-item">
                <span className="recent-score">87/100</span>
                <span className="recent-info">Math - Calculus Midterm</span>
              </div>
              <div className="recent-item">
                <span className="recent-score">78/100</span>
                <span className="recent-info">Chemistry - Organic Quiz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostScore;

import React, { useState, useEffect } from "react";
import "./BetDetailModal.css";
import { getBerkeleyTimeCourseData } from "../utils/berkeleyTimeAPI";

function BetDetailModal({ bet, onClose }) {
  const [courseData, setCourseData] = useState(null);
  const [loadingCourseData, setLoadingCourseData] = useState(true);
  const [currentBet, setCurrentBet] = useState(bet);

  // Real-time updates for bet data
  useEffect(() => {
    const loadBetData = () => {
      if (bet && bet.id) {
        const savedBets = localStorage.getItem("gamblescope_bets");
        if (savedBets) {
          const allBets = JSON.parse(savedBets);
          const updatedBet = allBets.find((b) => b.id === bet.id);
          if (updatedBet) {
            setCurrentBet(updatedBet);
          }
        }
      }
    };

    // Load initial data
    loadBetData();

    // Listen for storage changes (cross-tab updates)
    const handleStorageChange = () => {
      loadBetData();
    };

    // Listen for custom bet placed events (same-tab updates)
    const handleBetPlaced = (event) => {
      if (event.detail && event.detail.betId === bet.id) {
        setCurrentBet(event.detail.updatedBet);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("betPlaced", handleBetPlaced);

    // Also check periodically for updates
    const interval = setInterval(loadBetData, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("betPlaced", handleBetPlaced);
      clearInterval(interval);
    };
  }, [bet]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (currentBet && currentBet.subject) {
        setLoadingCourseData(true);
        const data = await getBerkeleyTimeCourseData(currentBet.subject);
        setCourseData(data);
        setLoadingCourseData(false);
      }
    };

    fetchCourseData();
  }, [currentBet]);

  if (!currentBet || !currentBet.individualBets) return null;

  // Calculate odds over time
  const calculateOddsOverTime = () => {
    const points = [];
    let higherTotal = 0;
    let lowerTotal = 0;

    // Sort bets by time
    const sortedBets = [...currentBet.individualBets].sort(
      (a, b) => new Date(a.placedAt) - new Date(b.placedAt),
    );

    sortedBets.forEach((individualBet, index) => {
      if (individualBet.prediction === "higher") {
        higherTotal += individualBet.amount;
      } else {
        lowerTotal += individualBet.amount;
      }

      const total = higherTotal + lowerTotal;
      const higherOdds = total > 0 ? (higherTotal / total) * 100 : 50;
      const lowerOdds = total > 0 ? (lowerTotal / total) * 100 : 50;

      points.push({
        time: individualBet.placedAt,
        higherOdds,
        lowerOdds,
        timeIndex: index,
      });
    });

    return points;
  };

  const dataPoints = calculateOddsOverTime();

  // Get max height for scaling
  const maxHeight = 200;
  const maxTime = dataPoints.length - 1;

  return (
    <div className="bet-detail-modal-overlay" onClick={onClose}>
      <div className="bet-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bet-detail-header">
          <h2>Bet Details</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="bet-detail-content">
          <div className="bet-info-section">
            <div className="bet-main-info">
              <h3>
                {currentBet.subject} - {currentBet.testName}
              </h3>
              <p className="opener">Opened by: {currentBet.openerUsername}</p>
              <p className="threshold">Threshold: {currentBet.threshold}%</p>
              {currentBet.description && (
                <p className="description">{currentBet.description}</p>
              )}

              {/* Berkeley Time Course Data */}
              {courseData && !loadingCourseData && (
                <div className="berkeley-time-data">
                  <div className="course-stats">
                    <div className="course-stat">
                      <span className="stat-label-custom">Course Average:</span>
                      <span
                        className="stat-value-custom"
                        style={{ color: "#FFD700" }}
                      >
                        {courseData.average}%
                      </span>
                    </div>
                    {currentBet.threshold && (
                      <div className="threshold-comparison">
                        <span
                          className={`comparison-text ${currentBet.threshold > courseData.average ? "higher" : "lower"}`}
                        >
                          Bet threshold is{" "}
                          {Math.abs(currentBet.threshold - courseData.average)}%
                          {currentBet.threshold > courseData.average
                            ? " higher"
                            : " lower"}{" "}
                          than average
                        </span>
                      </div>
                    )}
                  </div>
                  {courseData && (
                    <a
                      href={courseData.berkeleyTimeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="berkeley-time-link"
                    >
                      📊 View Full Course Data on Berkeley Time →
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="bet-stats">
              <div className="stat">
                <span className="stat-label" style={{ color: "#FFFFFF" }}>
                  Total Bets:
                </span>
                <span className="stat-value" style={{ color: "#FFD700" }}>
                  {currentBet.totalBets}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label" style={{ color: "#FFFFFF" }}>
                  Total Pot:
                </span>
                <span className="stat-value" style={{ color: "#FFD700" }}>
                  ${currentBet.totalPot.toFixed(2)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label" style={{ color: "#FFFFFF" }}>
                  Over Total:
                </span>
                <span className="stat-value" style={{ color: "#FFD700" }}>
                  ${currentBet.higherTotal.toFixed(2)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label" style={{ color: "#FFFFFF" }}>
                  Under Total:
                </span>
                <span className="stat-value" style={{ color: "#FFD700" }}>
                  ${currentBet.lowerTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Berkeley Time Grade Distribution */}
          {courseData && !loadingCourseData && courseData.distribution && (
            <div className="grade-distribution-section">
              <h3>📊 Grade Distribution (Berkeley Time)</h3>
              <div className="distribution-chart">
                <svg className="distribution-graph" viewBox="0 0 400 150">
                  {courseData.distribution.map((value, index) => {
                    const x = 50 + index * 35;
                    const barHeight = value * 300;
                    const y = 120 - barHeight;
                    const fillColor =
                      index >= 7
                        ? "#28a745"
                        : index >= 5
                          ? "#FFD700"
                          : "#dc3545";

                    return (
                      <g key={index}>
                        <rect
                          x={x}
                          y={y}
                          width="30"
                          height={barHeight}
                          fill={fillColor}
                          stroke="#fff"
                          strokeWidth="1"
                        />
                        <text
                          x={x + 15}
                          y="135"
                          fontSize="8"
                          fill="#F5F5DC"
                          textAnchor="middle"
                        >
                          {index * 10}-{(index + 1) * 10}%
                        </text>
                        <text
                          x={x + 15}
                          y={y - 5}
                          fontSize="8"
                          fill="#F5F5DC"
                          textAnchor="middle"
                        >
                          {(value * 100).toFixed(0)}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="distribution-legend">
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ background: "#dc3545" }}
                  ></div>
                  <span>Failing (0-50%)</span>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ background: "#FFD700" }}
                  ></div>
                  <span>Passing (50-70%)</span>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-color"
                    style={{ background: "#28a745" }}
                  ></div>
                  <span>Strong (70-100%)</span>
                </div>
              </div>
              {currentBet.threshold && (
                <div className="threshold-indicator">
                  <div
                    className="threshold-line"
                    style={{
                      left: `${50 + Math.floor(currentBet.threshold / 10) * 35}px`,
                      backgroundColor:
                        currentBet.threshold > courseData.average
                          ? "#28a745"
                          : "#FFD700",
                    }}
                  ></div>
                  <span className="threshold-label">
                    Your Bet: {currentBet.threshold}%
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="graph-section">
            <h3>Odds Over Time</h3>
            <div className="graph-container">
              <svg
                className="odds-graph"
                viewBox={`0 0 ${Math.max(400, dataPoints.length * 20)} ${maxHeight + 40}`}
              >
                {/* Y-axis label */}
                <text x="20" y="12" fontSize="12" fill="#666">
                  Odds %
                </text>

                {/* Y-axis lines and labels */}
                {[0, 25, 50, 75, 100].map((value) => (
                  <g key={value}>
                    <line
                      x1="50"
                      y1={maxHeight - (value / 100) * maxHeight + 20}
                      x2={Math.max(400, dataPoints.length * 20) - 20}
                      y2={maxHeight - (value / 100) * maxHeight + 20}
                      stroke="#e0e0e0"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    <text
                      x="45"
                      y={maxHeight - (value / 100) * maxHeight + 20}
                      fontSize="10"
                      fill="#666"
                      textAnchor="end"
                    >
                      {value}%
                    </text>
                  </g>
                ))}

                {/* Higher odds line */}
                {dataPoints.length > 1 && (
                  <polyline
                    points={dataPoints
                      .map(
                        (pt, i) =>
                          `${50 + (i / maxTime) * (Math.max(400, dataPoints.length * 20) - 70)},${maxHeight - (pt.higherOdds / 100) * maxHeight + 20}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke="#28a745"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}

                {/* Lower odds line */}
                {dataPoints.length > 1 && (
                  <polyline
                    points={dataPoints
                      .map(
                        (pt, i) =>
                          `${50 + (i / maxTime) * (Math.max(400, dataPoints.length * 20) - 70)},${maxHeight - (pt.lowerOdds / 100) * maxHeight + 20}`,
                      )
                      .join(" ")}
                    fill="none"
                    stroke="#dc3545"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}

                {/* X-axis */}
                <line
                  x1="50"
                  y1={maxHeight + 20}
                  x2={Math.max(400, dataPoints.length * 20) - 20}
                  y2={maxHeight + 20}
                  stroke="#333"
                  strokeWidth="2"
                />

                {/* Legend */}
                <g>
                  <line
                    x1={Math.max(400, dataPoints.length * 20) - 120}
                    y1="12"
                    x2={Math.max(400, dataPoints.length * 20) - 100}
                    y2="12"
                    stroke="#28a745"
                    strokeWidth="2"
                  />
                  <text
                    x={Math.max(400, dataPoints.length * 20) - 95}
                    y="17"
                    fontSize="12"
                    fill="#28a745"
                    fontWeight="bold"
                  >
                    Over
                  </text>
                  <line
                    x1={Math.max(400, dataPoints.length * 20) - 120}
                    y1="27"
                    x2={Math.max(400, dataPoints.length * 20) - 100}
                    y2="27"
                    stroke="#dc3545"
                    strokeWidth="2"
                  />
                  <text
                    x={Math.max(400, dataPoints.length * 20) - 95}
                    y="32"
                    fontSize="12"
                    fill="#dc3545"
                    fontWeight="bold"
                  >
                    Under
                  </text>
                </g>
              </svg>
            </div>

            <div className="current-odds">
              <div className="current-odds-item higher">
                <span className="odds-label">Current Over Odds:</span>
                <span className="odds-value">
                  {currentBet.higherTotal + currentBet.lowerTotal > 0
                    ? (
                        (currentBet.higherTotal /
                          (currentBet.higherTotal + currentBet.lowerTotal)) *
                        100
                      ).toFixed(1)
                    : 50}
                  %
                </span>
              </div>
              <div className="current-odds-item lower">
                <span className="odds-label">Current Under Odds:</span>
                <span className="odds-value">
                  {currentBet.higherTotal + currentBet.lowerTotal > 0
                    ? (
                        (currentBet.lowerTotal /
                          (currentBet.higherTotal + currentBet.lowerTotal)) *
                        100
                      ).toFixed(1)
                    : 50}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bet-history">
            <h3>Betting History</h3>
            <div className="history-list">
              {[...currentBet.individualBets]
                .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
                .slice(0, 10)
                .map((individualBet, index) => (
                  <div key={index} className="history-item">
                    <div className="history-user">
                      <img
                        src={individualBet.userAvatar}
                        alt={individualBet.username}
                        className="history-avatar"
                      />
                      <span>{individualBet.username}</span>
                    </div>
                    <div
                      className={`history-prediction ${individualBet.prediction}`}
                    >
                      {individualBet.prediction === "higher" ? "Over" : "Under"}
                    </div>
                    <div className="history-amount">
                      ${individualBet.amount}
                    </div>
                    <div className="history-time">
                      {new Date(individualBet.placedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bet-detail-footer">
          <button className="close-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BetDetailModal;

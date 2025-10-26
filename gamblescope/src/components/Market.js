import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import BetDetailModal from "./BetDetailModal";
import "./Market.css";

function Market() {
  const { currentUser, updateUserWallet } = useAuth();
  const [selectedBet, setSelectedBet] = useState(null);
  const [betDetailBet, setBetDetailBet] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [betPrediction, setBetPrediction] = useState("higher");
  const [openedBets, setOpenedBets] = useState([]);

  // Load opened bets from localStorage
  useEffect(() => {
    const loadOpenedBets = () => {
      const savedBets = localStorage.getItem("gamblescope_bets");
      if (savedBets) {
        setOpenedBets(JSON.parse(savedBets));
      }
    };

    loadOpenedBets();

    // Listen for storage changes (real-time updates)
    const handleStorageChange = () => {
      loadOpenedBets();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for updates
    const interval = setInterval(loadOpenedBets, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handlePlaceBet = (betId) => {
    const selectedBetData = openedBets.find((bet) => bet.id === betId);
    if (!selectedBetData) return;

    // Check if user has enough money
    if (currentUser.wallet < betAmount) {
      alert("Insufficient funds! Please deposit more money to your wallet.");
      return;
    }

    // Create new individual bet
    const newIndividualBet = {
      id: Date.now().toString(),
      betId: betId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      prediction: betPrediction,
      amount: betAmount,
      placedAt: new Date().toISOString(),
    };

    // Update the bet with new individual bet
    const updatedBets = openedBets.map((bet) => {
      if (bet.id === betId) {
        const updatedIndividualBets = [
          ...(bet.individualBets || []),
          newIndividualBet,
        ];
        const higherBets = updatedIndividualBets.filter(
          (b) => b.prediction === "higher",
        );
        const lowerBets = updatedIndividualBets.filter(
          (b) => b.prediction === "lower",
        );
        const higherTotal = higherBets.reduce((sum, b) => sum + b.amount, 0);
        const lowerTotal = lowerBets.reduce((sum, b) => sum + b.amount, 0);

        return {
          ...bet,
          individualBets: updatedIndividualBets,
          totalBets: updatedIndividualBets.length,
          totalPot: higherTotal + lowerTotal,
          higherTotal: higherTotal,
          lowerTotal: lowerTotal,
        };
      }
      return bet;
    });

    // Update localStorage
    localStorage.setItem("gamblescope_bets", JSON.stringify(updatedBets));
    setOpenedBets(updatedBets);

    // Dispatch custom event for real-time updates
    window.dispatchEvent(
      new CustomEvent("betPlaced", {
        detail: {
          betId,
          updatedBet: updatedBets.find((bet) => bet.id === betId),
        },
      }),
    );

    // Deduct money from user's wallet using AuthContext
    updateUserWallet(currentUser.id, -betAmount);

    // Calculate potential payout using LMSR
    const higherTotal =
      updatedBets.find((bet) => bet.id === betId)?.higherTotal || 0;
    const lowerTotal =
      updatedBets.find((bet) => bet.id === betId)?.lowerTotal || 0;
    const oppositeTotal = betPrediction === "higher" ? lowerTotal : higherTotal;
    const potentialPayout =
      oppositeTotal > 0
        ? (betAmount /
            (betPrediction === "higher" ? higherTotal : lowerTotal)) *
          oppositeTotal
        : 0;

    alert(
      `Bet placed!\n${betPrediction === "higher" ? "Over" : "Under"} ${selectedBetData.threshold}%\nAmount: $${betAmount}\nPotential Payout: $${potentialPayout.toFixed(2)}`,
    );

    // Reset form
    setBetAmount(10);
    setBetPrediction("higher");
    setSelectedBet(null);
  };

  const getBetStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#28a745";
      case "revealed":
        return "#dc3545";
      case "closed":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const getBetStatusText = (status) => {
    switch (status) {
      case "open":
        return "Open for Betting";
      case "revealed":
        return "Bet Ended";
      case "closed":
        return "Bet Closed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="market">
      <div className="market-header">
        <h2>Live Betting Market</h2>
        <p>Bet on whether students scored over or under certain thresholds</p>
      </div>

      <div className="bets-grid">
        {openedBets.length > 0 ? (
          openedBets.map((bet) => (
            <div key={bet.id} className="bet-card">
              <div className="bet-header">
                <div className="bet-info">
                  <div className="bet-opener">
                    <img
                      src={bet.openerAvatar}
                      alt={bet.openerUsername}
                      className="opener-avatar"
                    />
                    <div>
                      <h3>{bet.openerUsername}</h3>
                      <p className="test-info">
                        {bet.subject} - {bet.testName}
                      </p>
                    </div>
                  </div>
                  <div className="bet-details">
                    <div className="threshold-display">
                      <span className="threshold-label">Threshold:</span>
                      <span className="threshold-value">{bet.threshold}%</span>
                    </div>
                    <div className="pot-display">
                      <span className="pot-label">Pot:</span>
                      <span className="pot-value">
                        ${bet.totalPot.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bet-status">
                  <span
                    className={`status-badge ${bet.status}`}
                    style={{ color: getBetStatusColor(bet.status) }}
                  >
                    {getBetStatusText(bet.status)}
                  </span>
                </div>
              </div>

              {bet.description && (
                <div className="bet-description">
                  <p>{bet.description}</p>
                </div>
              )}

              {bet.status === "revealed" && (
                <div className="bet-results">
                  <h4>📊 Results</h4>
                  <div className="result-summary">
                    <p>
                      <strong>Actual Score:</strong> {bet.actualScore}%
                    </p>
                    <p>
                      <strong>Threshold:</strong> {bet.threshold}%
                    </p>
                    <p>
                      <strong>Winning Side:</strong> {bet.winningSide}
                    </p>
                    {bet.payouts && bet.payouts.length > 0 && (
                      <div className="payout-summary">
                        <p>
                          <strong>Payouts:</strong>
                        </p>
                        <ul>
                          {bet.payouts.map((payout, index) => (
                            <li key={index}>
                              {payout.username}: ${payout.betAmount} → $
                              {payout.totalWinnings.toFixed(2)} (+$
                              {payout.payout.toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bets-section">
                <h4>Active Bets ({bet.totalBets || 0}):</h4>
                {bet.totalBets > 0 ? (
                  <div className="bets-list">
                    <div className="bet-summary">
                      <div className="bet-side">
                        <span className="side-label">
                          Over: ${(bet.higherTotal || 0).toFixed(2)}
                        </span>
                        <span className="side-count">
                          (
                          {
                            (bet.individualBets || []).filter(
                              (b) => b.prediction === "higher",
                            ).length
                          }{" "}
                          bets)
                        </span>
                      </div>
                      <div className="bet-side">
                        <span className="side-label">
                          Under: ${(bet.lowerTotal || 0).toFixed(2)}
                        </span>
                        <span className="side-count">
                          (
                          {
                            (bet.individualBets || []).filter(
                              (b) => b.prediction === "lower",
                            ).length
                          }{" "}
                          bets)
                        </span>
                      </div>
                    </div>
                    <div className="total-pot">
                      <span className="pot-label">
                        Total Pot: ${(bet.totalPot || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="no-bets">No bets yet - be the first to bet!</p>
                )}
              </div>

              {bet.status === "open" && bet.openerId !== currentUser.id && (
                <div className="bet-actions">
                  <button
                    className="bet-button"
                    onClick={() => setSelectedBet(bet.id)}
                  >
                    Place Bet
                  </button>
                </div>
              )}

              {bet.openerId === currentUser.id && bet.status === "open" && (
                <div className="bet-actions">
                  <span className="own-bet-message">
                    This is your bet - you cannot place bets on your own tests
                  </span>
                  <button
                    className="reveal-button"
                    onClick={() => {
                      // TODO: Implement reveal functionality
                      alert("Reveal functionality coming soon!");
                    }}
                  >
                    Reveal Score
                  </button>
                </div>
              )}

              <div className="bet-actions">
                <button
                  className="view-details-button"
                  onClick={() => setBetDetailBet(bet)}
                >
                  📊 View Details & Graph
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-bets-message">
            <h3>No Open Bets Yet</h3>
            <p>
              Be the first to open a bet! Go to the "Open Bet" tab to create
              one.
            </p>
          </div>
        )}
      </div>

      {/* Betting Modal */}
      {selectedBet && (
        <div className="bet-modal-overlay">
          <div className="bet-modal">
            <h3>Place Your Bet</h3>
            <div className="bet-form">
              <div className="form-group">
                <label>Prediction:</label>
                <select
                  value={betPrediction}
                  onChange={(e) => setBetPrediction(e.target.value)}
                >
                  <option value="higher">Over threshold</option>
                  <option value="lower">Under threshold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bet Amount ($):</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Remove leading zeros and convert to number
                    const numValue = value === "" ? 0 : Number(value);
                    setBetAmount(numValue);
                  }}
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                />
              </div>

              <div className="bet-summary">
                <p>
                  <strong>Your Wallet:</strong> ${currentUser.wallet.toFixed(2)}
                </p>
                <p>
                  <strong>Threshold:</strong>{" "}
                  {selectedBet
                    ? openedBets.find((bet) => bet.id === selectedBet)
                        ?.threshold
                    : 85}
                  %
                </p>
                <p>
                  <strong>Your Prediction:</strong> {betPrediction}
                </p>
                <p>
                  <strong>Your Bet Amount:</strong> ${betAmount}
                </p>
                {(() => {
                  const betData = openedBets.find(
                    (bet) => bet.id === selectedBet,
                  );
                  if (!betData) return null;
                  const higherTotal = betData.higherTotal || 0;
                  const lowerTotal = betData.lowerTotal || 0;
                  const oppositeTotal =
                    betPrediction === "higher" ? lowerTotal : higherTotal;
                  const yourSideTotal =
                    betPrediction === "higher" ? higherTotal : lowerTotal;
                  const potentialPayout =
                    oppositeTotal > 0
                      ? (betAmount / (yourSideTotal + betAmount)) *
                        oppositeTotal
                      : 0;

                  return (
                    <>
                      <p>
                        <strong>Current {betPrediction} total:</strong> $
                        {yourSideTotal.toFixed(2)}
                      </p>
                      <p>
                        <strong>Opposite side total:</strong> $
                        {oppositeTotal.toFixed(2)}
                      </p>
                      <p>
                        <strong>Potential Payout:</strong> $
                        {potentialPayout.toFixed(2)}
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setSelectedBet(null)}
                >
                  Cancel
                </button>
                <button
                  className="place-bet-button"
                  onClick={() => handlePlaceBet(selectedBet)}
                >
                  Place Bet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bet Detail Modal */}
      {betDetailBet && (
        <BetDetailModal
          bet={betDetailBet}
          onClose={() => setBetDetailBet(null)}
        />
      )}
    </div>
  );
}

export default Market;

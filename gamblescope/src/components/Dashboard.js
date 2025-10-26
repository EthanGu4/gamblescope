import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { currentUser, updateUserWallet } = useAuth();
  const [userBets, setUserBets] = useState([]);
  const [openedBets, setOpenedBets] = useState([]);
  const [placedBets, setPlacedBets] = useState([]);
  const [activeTab, setActiveTab] = useState('opened');
  const [userStats, setUserStats] = useState({
    betsPlaced: 0,
    betsOpened: 0,
    totalWinnings: 0,
    totalBetAmount: 0,
    winRate: 0
  });

  // Load user's betting data and calculate stats
  useEffect(() => {
    const loadUserData = () => {
      const savedBets = localStorage.getItem('gamblescope_bets');
      if (savedBets) {
        const allBets = JSON.parse(savedBets);
        
        // Get opened bets (bets this user created)
        const userOpenedBets = allBets.filter(bet => bet.openerId === currentUser.id);
        setOpenedBets(userOpenedBets);
        
        // Get placed bets (individual bets this user made)
        const allPlacedBets = [];
        allBets.forEach(bet => {
          if (bet.individualBets) {
            const userIndividualBets = bet.individualBets.filter(individualBet => 
              individualBet.userId === currentUser.id
            );
            userIndividualBets.forEach(individualBet => {
              allPlacedBets.push({
                ...individualBet,
                betId: bet.id,
                betSubject: bet.subject,
                betTestName: bet.testName,
                betThreshold: bet.threshold,
                betStatus: bet.status,
                betActualScore: bet.actualScore,
                betWinningSide: bet.winningSide,
                betOpenerUsername: bet.openerUsername
              });
            });
          }
        });
        setPlacedBets(allPlacedBets);
        
        // Calculate user statistics
        const stats = calculateUserStats(userOpenedBets, allPlacedBets);
        setUserStats(stats);
      }
    };
    
    loadUserData();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadUserData, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUser.id]);

  // Calculate user statistics
  const calculateUserStats = (openedBets, placedBets) => {
    const betsOpened = openedBets.length;
    const betsPlaced = placedBets.length;
    
    // Calculate total bet amount (money user put into bets)
    const totalBetAmount = placedBets.reduce((sum, bet) => sum + bet.amount, 0);
    
    // Calculate winnings from placed bets
    let totalWinnings = 0;
    let winningBets = 0;
    
    placedBets.forEach(bet => {
      if (bet.betStatus === 'ended') {
        // Check if user won this bet
        const userWon = bet.prediction === bet.betWinningSide;
        if (userWon) {
          // Find the bet to get payout info
          const savedBets = JSON.parse(localStorage.getItem('gamblescope_bets') || '[]');
          const parentBet = savedBets.find(b => b.id === bet.betId);
          if (parentBet && parentBet.payouts) {
            const userPayout = parentBet.payouts.find(p => p.userId === currentUser.id);
            if (userPayout) {
              totalWinnings += userPayout.payout; // Only the winnings, not the original bet
              winningBets++;
            }
          }
        } else {
          // User lost, lost their bet amount
          totalWinnings -= bet.amount;
        }
      }
    });
    
    const winRate = betsPlaced > 0 ? (winningBets / betsPlaced) * 100 : 0;
    
    return {
      betsPlaced,
      betsOpened,
      totalWinnings,
      totalBetAmount,
      winRate: Math.round(winRate)
    };
  };

  const getBetStatusIcon = (status) => {
    switch (status) {
      case 'open': return '●';
      case 'ended': return '✓';
      case 'closed': return '✗';
      default: return '?';
    }
  };

  const getBetStatusColor = (status) => {
    switch (status) {
      case 'open': return '#28a745';
      case 'ended': return '#dc3545';
      case 'closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const handleRevealScore = (betId) => {
    const actualScore = prompt('Enter your actual score percentage:');
    if (actualScore && !isNaN(actualScore)) {
      const score = parseFloat(actualScore);
      if (score >= 0 && score <= 100) {
        const bet = openedBets.find(b => b.id === betId);
        if (!bet) return;

        // Determine winning side
        const wonHigher = score > bet.threshold;
        const winningSide = wonHigher ? 'higher' : 'lower';
        const losingSide = wonHigher ? 'lower' : 'higher';

        // Calculate payouts for each individual bet
        const payouts = [];
        const individualBets = bet.individualBets || [];
        
        individualBets.forEach(individualBet => {
          if (individualBet.prediction === winningSide) {
            // Calculate payout using LMSR
            const winningSideTotal = wonHigher ? bet.higherTotal : bet.lowerTotal;
            const losingSideTotal = wonHigher ? bet.lowerTotal : bet.higherTotal;
            
            if (winningSideTotal > 0 && losingSideTotal > 0) {
              const userShare = individualBet.amount / winningSideTotal;
              const payout = userShare * losingSideTotal;
              const totalWinnings = individualBet.amount + payout;
              
              payouts.push({
                userId: individualBet.userId,
                username: individualBet.username,
                betAmount: individualBet.amount,
                payout: payout,
                totalWinnings: totalWinnings
              });
            }
          }
        });

        // Update user wallets with payouts using AuthContext
        payouts.forEach(payout => {
          try {
            // Use AuthContext to update wallet (this handles both registered users and current user)
            updateUserWallet(payout.userId, payout.totalWinnings);
            console.log(`Payout: ${payout.username} received $${payout.totalWinnings.toFixed(2)} (bet: $${payout.betAmount} + winnings: $${payout.payout.toFixed(2)})`);
          } catch (error) {
            console.log(`Skipping payout for user ${payout.username} - user not found in system`);
          }
        });

        // Update the bet with actual score and payout info
        const updatedBets = openedBets.map(bet => 
          bet.id === betId 
            ? { 
                ...bet, 
                status: 'ended', 
                actualScore: score,
                actualPercentage: score,
                endedAt: new Date().toISOString(),
                winningSide: winningSide,
                payouts: payouts
              }
            : bet
        );
        
        // Update localStorage
        const allBets = JSON.parse(localStorage.getItem('gamblescope_bets') || '[]');
        const updatedAllBets = allBets.map(bet => 
          bet.id === betId 
            ? { 
                ...bet, 
                status: 'ended', 
                actualScore: score,
                actualPercentage: score,
                endedAt: new Date().toISOString(),
                winningSide: winningSide,
                payouts: payouts
              }
            : bet
        );
        localStorage.setItem('gamblescope_bets', JSON.stringify(updatedAllBets));
        
        setOpenedBets(updatedBets);
        
        // Show payout summary
        const payoutSummary = payouts.length > 0 
          ? `\n\nPayouts:\n${payouts.map(p => `- ${p.username}: $${p.betAmount} → $${p.totalWinnings.toFixed(2)} (+$${p.payout.toFixed(2)})`).join('\n')}`
          : '\n\nNo winning bets to payout.';
        
        alert(`Bet ended! You scored ${score}% (${winningSide} than ${bet.threshold}%)${payoutSummary}`);
      } else {
        alert('Please enter a valid score between 0 and 100');
      }
    }
  };

  return (
    <div className="dashboard">
        <div className="dashboard-header">
          <h2>My Dashboard</h2>
          <p>Track your betting performance and history</p>
        </div>

      <div className="dashboard-content">
            {/* User Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">$</div>
                <div className="stat-info">
                  <h3>Wallet Balance</h3>
                  <p className="stat-value positive">
                    ${currentUser.wallet.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">→</div>
                <div className="stat-info">
                  <h3>Bets Placed</h3>
                  <p className="stat-value">{userStats.betsPlaced}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">+</div>
                <div className="stat-info">
                  <h3>Bets Opened</h3>
                  <p className="stat-value">{userStats.betsOpened}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">±</div>
                <div className="stat-info">
                  <h3>Total Winnings</h3>
                  <p className={`stat-value ${userStats.totalWinnings >= 0 ? 'positive' : 'negative'}`}>
                    {userStats.totalWinnings >= 0 ? '+' : ''}${userStats.totalWinnings.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">%</div>
                <div className="stat-info">
                  <h3>Win Rate</h3>
                  <p className="stat-value">{userStats.winRate}%</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">Σ</div>
                <div className="stat-info">
                  <h3>Total Bet</h3>
                  <p className="stat-value">${userStats.totalBetAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

        {/* User Profile */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-header">
              <img src={currentUser.avatar} alt={currentUser.username} className="profile-avatar" />
              <div className="profile-info">
                <h3>{currentUser.username}</h3>
                <p className="profile-stats">
                  {currentUser.totalBets} bets • {currentUser.totalWinnings >= 0 ? '+' : ''}${currentUser.totalWinnings} winnings
                </p>
              </div>
            </div>
          </div>
        </div>

            {/* Tabs */}
            <div className="dashboard-tabs">
              <button 
                className={`tab-button ${activeTab === 'opened' ? 'active' : ''}`}
                onClick={() => setActiveTab('opened')}
              >
                My Opened Bets ({openedBets.length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'placed' ? 'active' : ''}`}
                onClick={() => setActiveTab('placed')}
              >
                My Placed Bets ({placedBets.length})
              </button>
            </div>

        {/* Opened Bets */}
        {activeTab === 'opened' && (
          <div className="bets-section">
            <h3>My Opened Bets</h3>
            {openedBets.length > 0 ? (
              <div className="bets-list">
                {openedBets.map(bet => (
                  <div key={bet.id} className="bet-history-item">
                    <div className="bet-main-info">
                      <div className="bet-prediction">
                        <span className="bet-icon">{getBetStatusIcon(bet.status)}</span>
                        <span className="bet-text">
                          <strong>{bet.subject} - {bet.testName}</strong>
                          <br />
                          Threshold: {bet.threshold}% • Pot: ${bet.totalPot.toFixed(2)} • {bet.totalBets} bet{bet.totalBets !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="bet-amounts">
                        {bet.actualScore !== null && (
                          <span className="actual-score">
                            Actual: {bet.actualScore}% ({bet.winningSide})
                          </span>
                        )}
                        {bet.payouts && bet.payouts.length > 0 && (
                          <span className="payout-info">
                            ${bet.payouts.reduce((sum, p) => sum + p.totalWinnings, 0).toFixed(2)} paid out
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bet-status">
                      <span 
                        className="status-badge"
                        style={{ color: getBetStatusColor(bet.status) }}
                      >
                        {bet.status.toUpperCase()}
                      </span>
                      <span className="bet-date">
                        {new Date(bet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {bet.status === 'open' && (
                      <div className="bet-actions">
                            <button 
                              className="reveal-button"
                              onClick={() => handleRevealScore(bet.id)}
                            >
                              End Bet
                            </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bets">
                <p>No bets opened yet. Go to "Open Bet" to create your first bet!</p>
              </div>
            )}
          </div>
        )}

            {/* Placed Bets */}
            {activeTab === 'placed' && (
              <div className="bets-section">
                <h3>My Placed Bets</h3>
                {placedBets.length > 0 ? (
                  <div className="bets-list">
                    {placedBets.map((bet, index) => (
                      <div key={`${bet.betId}-${index}`} className="bet-history-item">
                        <div className="bet-main-info">
                          <div className="bet-prediction">
                            <span className="bet-icon">
                              {bet.betStatus === 'open' ? '●' : 
                               bet.betStatus === 'ended' ? '✓' : '✗'}
                            </span>
                            <span className="bet-text">
                              <strong>{bet.betSubject} - {bet.betTestName}</strong>
                              <br />
                              Prediction: <strong>{bet.prediction === 'higher' ? 'Over' : 'Under'}</strong> {bet.betThreshold}% • 
                              Amount: <strong>${bet.amount}</strong> • 
                              Opened by: {bet.betOpenerUsername}
                            </span>
                          </div>
                          <div className="bet-amounts">
                            {bet.betStatus === 'ended' && (
                              <span className={`bet-result ${bet.prediction === bet.betWinningSide ? 'won' : 'lost'}`}>
                                {bet.prediction === bet.betWinningSide ? 'WON' : 'LOST'}
                                <br />
                                Actual: {bet.betActualScore}% ({bet.betWinningSide === 'higher' ? 'Over' : 'Under'})
                              </span>
                            )}
                            {bet.betStatus === 'open' && (
                              <span className="bet-status-open">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bet-status">
                          <span className={`status-badge ${bet.betStatus}`}>
                            {bet.betStatus.toUpperCase()}
                          </span>
                          <span className="bet-date">
                            {new Date(bet.placedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bets">
                    <p>No bets placed yet. Go to "Live Market" to place bets on other users' tests!</p>
                  </div>
                )}
              </div>
            )}
      </div>
    </div>
  );
}

export default Dashboard;

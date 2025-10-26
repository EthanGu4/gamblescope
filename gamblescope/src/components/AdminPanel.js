import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateMockBetsForDemo } from '../utils/mockDataGenerator';
import './AdminPanel.css';

function AdminPanel() {
  const { currentUser, users, clearAllBets, clearUserBets, clearIndividualBet, makeAdmin, updateUserWallet } = useAuth();
  const [message, setMessage] = useState('');
  const [allBets, setAllBets] = useState([]);
  const [adminUsername, setAdminUsername] = useState('');

  // Load all bets
  useEffect(() => {
    const loadBets = () => {
      const savedBets = localStorage.getItem('gamblescope_bets');
      if (savedBets) {
        setAllBets(JSON.parse(savedBets));
      }
    };
    
    loadBets();
    const interval = setInterval(loadBets, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClearAllBets = () => {
    if (window.confirm('Are you sure you want to clear ALL bets? This action cannot be undone.')) {
      const result = clearAllBets();
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setAllBets([]);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const handleClearUserBets = (userId, username) => {
    if (window.confirm(`Are you sure you want to clear all bets for ${username}?`)) {
      const result = clearUserBets(userId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reload bets
        const savedBets = localStorage.getItem('gamblescope_bets');
        if (savedBets) {
          setAllBets(JSON.parse(savedBets));
        } else {
          setAllBets([]);
        }
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const handleMakeAdmin = () => {
    if (!adminUsername.trim()) {
      setMessage({ type: 'error', text: 'Please enter a username' });
      return;
    }
    
    const result = makeAdmin(adminUsername);
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setAdminUsername('');
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleClearIndividualBet = (betId, betTitle) => {
    if (window.confirm(`Are you sure you want to clear the bet "${betTitle}"?`)) {
      const result = clearIndividualBet(betId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reload bets
        const savedBets = localStorage.getItem('gamblescope_bets');
        if (savedBets) {
          setAllBets(JSON.parse(savedBets));
        } else {
          setAllBets([]);
        }
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const handleGenerateMockData = () => {
    if (window.confirm('This will generate 10 demo bets with mock betting activity. Continue?')) {
      const mockBets = generateMockBetsForDemo();
      const existingBets = JSON.parse(localStorage.getItem('gamblescope_bets') || '[]');
      const updatedBets = [...mockBets, ...existingBets];
      localStorage.setItem('gamblescope_bets', JSON.stringify(updatedBets));
      setAllBets(updatedBets);
      setMessage({ type: 'success', text: 'Mock data generated successfully!' });
    }
  };

  const handleRevealScore = (betId) => {
    const actualScore = prompt('Enter the actual score percentage:');
    if (actualScore && !isNaN(actualScore)) {
      const score = parseFloat(actualScore);
      if (score >= 0 && score <= 100) {
        const bet = allBets.find(b => b.id === betId);
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

        // Update user wallets with payouts
        payouts.forEach(payout => {
          try {
            updateUserWallet(payout.userId, payout.totalWinnings);
            console.log(`Admin payout: ${payout.username} received $${payout.totalWinnings.toFixed(2)}`);
          } catch (error) {
            console.log(`Skipping payout for user ${payout.username} - user not found in system`);
          }
        });

        // Update the bet with actual score and payout info
        const updatedBets = allBets.map(bet => 
          bet.id === betId 
            ? { 
                ...bet, 
                status: 'revealed', 
                actualScore: score,
                actualPercentage: score,
                revealedAt: new Date().toISOString(),
                winningSide: winningSide,
                payouts: payouts
              }
            : bet
        );
        
        // Update localStorage
        localStorage.setItem('gamblescope_bets', JSON.stringify(updatedBets));
        setAllBets(updatedBets);
        
        // Show payout summary
        const payoutSummary = payouts.length > 0 
          ? `\n\nPayouts:\n${payouts.map(p => `- ${p.username}: $${p.betAmount} → $${p.totalWinnings.toFixed(2)} (+$${p.payout.toFixed(2)})`).join('\n')}`
          : '\n\nNo winning bets to payout.';
        
        alert(`Score revealed! Actual score: ${score}% (${winningSide} than ${bet.threshold}%)${payoutSummary}`);
      } else {
        alert('Please enter a valid score between 0 and 100');
      }
    }
  };

  // Check if current user is admin
  if (!currentUser) {
    return (
      <div className="admin-panel">
        <div className="admin-access-denied">
          <h2>🔒 Not Logged In</h2>
          <p>Please log in to access this panel.</p>
        </div>
      </div>
    );
  }

  if (!currentUser.isAdmin) {
    return (
      <div className="admin-panel">
        <div className="admin-access-denied">
          <h2>🔒 Admin Access Required</h2>
          <p>You need admin privileges to access this panel.</p>
          <p>Current user: {currentUser.username}</p>
          <p>Is Admin: {currentUser.isAdmin ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p>Manage bets and users</p>
        </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✓' : '!'}
          </span>
          {message.text}
        </div>
      )}

      <div className="admin-content">
        {/* Bet Management */}
        <div className="admin-section">
          <h3>Bet Management</h3>
          
          <div className="bet-stats">
            <div className="stat-card">
              <h4>Total Bets</h4>
              <p className="stat-number">{allBets.length}</p>
            </div>
            <div className="stat-card">
              <h4>Open Bets</h4>
              <p className="stat-number">{allBets.filter(bet => bet.status === 'open').length}</p>
            </div>
            <div className="stat-card">
              <h4>Revealed Bets</h4>
              <p className="stat-number">{allBets.filter(bet => bet.status === 'revealed').length}</p>
            </div>
          </div>

            <div className="admin-actions">
              <button 
                className="danger-button"
                onClick={handleClearAllBets}
              >
                Clear All Bets
              </button>
              <button 
                className="demo-button"
                onClick={handleGenerateMockData}
              >
                Generate Demo Data
              </button>
            </div>
        </div>

        {/* User Management */}
        <div className="admin-section">
          <h3>User Management</h3>
          
          <div className="make-admin-section">
            <h4>Make User Admin</h4>
            <div className="admin-form">
              <input
                type="text"
                placeholder="Enter username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
              <button onClick={handleMakeAdmin}>
                Make Admin
              </button>
            </div>
          </div>

          <div className="users-list">
            <h4>All Users</h4>
            <div className="users-grid">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <img src={user.avatar} alt={user.username} className="user-avatar" />
                    <div>
                      <h5>{user.username}</h5>
                      <p>Wallet: ${user.wallet.toFixed(2)}</p>
                      {user.isAdmin && <span className="admin-badge">Admin</span>}
                    </div>
                  </div>
                  <div className="user-actions">
                    <button 
                      className="clear-user-button"
                      onClick={() => handleClearUserBets(user.id, user.username)}
                    >
                      Clear Bets
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bets */}
        <div className="admin-section">
          <h3>Recent Bets</h3>
          {allBets.length > 0 ? (
            <div className="bets-list">
              {allBets.slice(0, 10).map(bet => (
                <div key={bet.id} className="bet-item">
                  <div className="bet-info">
                    <h5>{bet.subject} - {bet.testName}</h5>
                    <p>Opened by: {bet.openerUsername}</p>
                    <p>Threshold: {bet.threshold}% • Status: {bet.status}</p>
                    {bet.actualScore && <p>Actual Score: {bet.actualScore}%</p>}
                  </div>
                  <div className="bet-stats">
                    <span>Pot: ${bet.totalPot?.toFixed(2) || '0.00'}</span>
                    <span>Bets: {bet.totalBets || 0}</span>
                    <div className="bet-admin-actions">
                      {bet.status === 'open' && (
                        <button 
                          className="reveal-button"
                          onClick={() => handleRevealScore(bet.id)}
                          title="Reveal score"
                        >
                          Reveal
                        </button>
                      )}
                      <button 
                        className="clear-bet-button"
                        onClick={() => handleClearIndividualBet(bet.id, `${bet.subject} - ${bet.testName}`)}
                        title="Clear this bet"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-bets">No bets found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

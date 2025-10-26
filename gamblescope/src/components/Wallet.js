import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Wallet.css';

function Wallet() {
  const { currentUser, depositMoney, withdrawMoney } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState('deposit');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem(`gamblescope_transactions_${currentUser.id}`);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, [currentUser.id]);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(`gamblescope_transactions_${currentUser.id}`, JSON.stringify(transactions));
  }, [transactions, currentUser.id]);

  const addTransaction = (type, amount, description) => {
    const newTransaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setIsLoading(true);
    const result = depositMoney(currentUser.id, parseFloat(depositAmount));
    
    if (result.success) {
      addTransaction('deposit', depositAmount, 'Wallet Deposit');
      setMessage({ type: 'success', text: `Successfully deposited $${depositAmount}` });
      setDepositAmount('');
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setIsLoading(false);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setIsLoading(true);
    const result = withdrawMoney(currentUser.id, parseFloat(withdrawAmount));
    
    if (result.success) {
      addTransaction('withdraw', withdrawAmount, 'Wallet Withdrawal');
      setMessage({ type: 'success', text: `Successfully withdrew $${withdrawAmount}` });
      setWithdrawAmount('');
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setIsLoading(false);
  };

  const quickDeposit = (amount) => {
    setDepositAmount(amount.toString());
    setActiveTab('deposit');
  };

  return (
    <div className="wallet">
      <div className="wallet-header">
        <h2>My Wallet</h2>
        <p>Manage your funds for betting</p>
      </div>

      <div className="wallet-content">
        {/* Wallet Balance Card */}
        <div className="balance-card">
          <div className="balance-info">
            <h3>Current Balance</h3>
            <div className="balance-amount">
              ${currentUser.wallet.toFixed(2)}
            </div>
            <p className="balance-subtitle">Available for betting</p>
          </div>
          <div className="balance-icon">
            💳
          </div>
        </div>

        {/* Quick Deposit Buttons */}
        <div className="quick-deposit">
          <h4>Quick Deposit</h4>
          <div className="quick-buttons">
            <button onClick={() => quickDeposit(10)} className="quick-btn">$10</button>
            <button onClick={() => quickDeposit(25)} className="quick-btn">$25</button>
            <button onClick={() => quickDeposit(50)} className="quick-btn">$50</button>
            <button onClick={() => quickDeposit(100)} className="quick-btn">$100</button>
          </div>
        </div>

        {/* Transaction Tabs */}
        <div className="transaction-section">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'deposit' ? 'active' : ''}`}
              onClick={() => setActiveTab('deposit')}
            >
              📥 Deposit
            </button>
            <button 
              className={`tab-button ${activeTab === 'withdraw' ? 'active' : ''}`}
              onClick={() => setActiveTab('withdraw')}
            >
              📤 Withdraw
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'deposit' ? (
              <form onSubmit={handleDeposit} className="transaction-form">
                <div className="form-group">
                  <label htmlFor="depositAmount">Deposit Amount ($)</label>
                  <input
                    type="number"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Remove leading zeros and convert to number
                      const numValue = value === '' ? 0 : Number(value);
                      setDepositAmount(numValue);
                    }}
                    placeholder="Enter amount to deposit"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="action-button deposit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Deposit Money'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleWithdraw} className="transaction-form">
                <div className="form-group">
                  <label htmlFor="withdrawAmount">Withdraw Amount ($)</label>
                  <input
                    type="number"
                    id="withdrawAmount"
                    value={withdrawAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Remove leading zeros and convert to number
                      const numValue = value === '' ? 0 : Number(value);
                      setWithdrawAmount(numValue);
                    }}
                    placeholder="Enter amount to withdraw"
                    min="0.01"
                    step="0.01"
                    max={currentUser.wallet}
                    required
                  />
                  <small className="form-help">
                    Available: ${currentUser.wallet.toFixed(2)}
                  </small>
                </div>
                <button 
                  type="submit" 
                  className="action-button withdraw-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Withdraw Money'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`message ${message.type}`}>
            <span className="message-icon">
              {message.type === 'success' ? '✅' : '⚠️'}
            </span>
            {message.text}
          </div>
        )}

        {/* Transaction History */}
        <div className="transaction-history">
          <h4>📋 Recent Transactions</h4>
          {transactions.length > 0 ? (
            <div className="history-list">
              {transactions.map(transaction => (
                <div key={transaction.id} className="history-item">
                  <div className="history-info">
                    <span className={`history-type ${transaction.type}`}>
                      {transaction.type === 'deposit' ? 'Deposit' : 
                       transaction.type === 'withdraw' ? 'Withdrawal' : 
                       transaction.type === 'bet' ? 'Bet Placed' :
                       transaction.type === 'win' ? 'Bet Won' : 'Transaction'}
                    </span>
                    <span className="history-date">{transaction.timestamp}</span>
                    <span className="history-description">{transaction.description}</span>
                  </div>
                  <span className={`history-amount ${transaction.type === 'deposit' || transaction.type === 'win' ? 'positive' : 'negative'}`}>
                    {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions">
              <p>No transactions yet. Make your first deposit to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;

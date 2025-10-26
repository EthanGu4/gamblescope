import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

function Header({ currentView, setCurrentView }) {
  const { currentUser, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>GambleScope</h1>
          <span>promoting gambling one student at a time</span>
        </div>

        <div className="header-right">
          <nav className="nav">
            <button
              className={`nav-button ${currentView === "market" ? "active" : ""}`}
              onClick={() => setCurrentView("market")}
            >
              Live Market
            </button>
            <button
              className={`nav-button ${currentView === "wallet" ? "active" : ""}`}
              onClick={() => setCurrentView("wallet")}
            >
              Wallet
            </button>
            <button
              className={`nav-button ${currentView === "dashboard" ? "active" : ""}`}
              onClick={() => setCurrentView("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`nav-button ${currentView === "openbet" ? "active" : ""}`}
              onClick={() => setCurrentView("openbet")}
            >
              Open Bet
            </button>
            {currentUser && currentUser.isAdmin && (
              <button
                className={`nav-button ${currentView === "admin" ? "active" : ""}`}
                onClick={() => setCurrentView("admin")}
              >
                Admin
              </button>
            )}
          </nav>

          <div className="user-section">
            <div className="user-info">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="user-avatar"
              />
              <div className="user-details">
                <span className="username">{currentUser.username}</span>
                <span className="wallet-balance">
                  ${currentUser.wallet.toFixed(2)}
                </span>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

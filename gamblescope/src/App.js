import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Homepage from './components/Homepage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Market from './components/Market';
import OpenBet from './components/OpenBet';
import Wallet from './components/Wallet';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('market');

  // If no user is logged in, show homepage
  if (!currentUser) {
    return <Homepage />;
  }

  // Check if this is a new user (created in this session)
  const isNewUser = currentUser.createdAt && 
    (new Date().getTime() - new Date(currentUser.createdAt).getTime()) < 5000; // Created within last 5 seconds

  // If new user, force redirect to market
  if (isNewUser && currentView !== 'market') {
    setCurrentView('market');
  }

  const renderView = () => {
    switch (currentView) {
      case 'market':
        return <Market />;
      case 'wallet':
        return <Wallet />;
      case 'dashboard':
        return <Dashboard />;
      case 'openbet':
        return <OpenBet />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Market />;
    }
  };

  return (
    <div className="App">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

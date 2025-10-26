import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]); // Store all created users in session

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('gamblescope_registered_users');
    let parsedUsers = [];
    
    if (savedUsers) {
      parsedUsers = JSON.parse(savedUsers);
      console.log('Loaded users from localStorage:', parsedUsers);
    }
    
    // Always ensure admin user exists
    const adminExists = parsedUsers.some(user => user.username === 'admin' && user.isAdmin);
    if (!adminExists) {
      const initialAdmin = {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@gamblescope.com',
        password: 'admin123',
        wallet: 1000,
        totalBets: 0,
        totalWinnings: 0,
        winRate: 0,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        avatar: '/images/pfp.jpg'
      };
      parsedUsers = [initialAdmin, ...parsedUsers];
      console.log('Added admin user to existing users:', initialAdmin);
    }
    
    setUsers(parsedUsers);
    localStorage.setItem('gamblescope_registered_users', JSON.stringify(parsedUsers));
    
    const savedCurrentUser = localStorage.getItem('gamblescope_current_user');
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('gamblescope_registered_users', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gamblescope_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gamblescope_current_user');
    }
  }, [currentUser]);

  const signUp = (userData) => {
    const { username, email, password } = userData;
    
    // Check if username or email already exists
    const existingUser = users.find(user => 
      user.username === username || user.email === email
    );
    
    if (existingUser) {
      return { success: false, error: 'Username or email already exists' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      username,
      email,
      password, // In real app, this would be hashed
      wallet: 0,
      totalBets: 0,
      totalWinnings: 0,
      winRate: 0,
      isAdmin: false, // Regular users are not admin by default
      createdAt: new Date().toISOString(),
      avatar: '/images/pfp.jpg'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    
    return { success: true, user: newUser, redirectTo: 'market' };
  };

  const signIn = (credentials) => {
    const { username, password } = credentials;
    
    console.log('Sign in attempt:', { username, password });
    console.log('Available users:', users);
    
    const user = users.find(user => 
      user.username === username && user.password === password
    );
    
    console.log('Found user:', user);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('gamblescope_current_user', JSON.stringify(user));
      console.log('User signed in successfully:', user);
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('gamblescope_current_user');
  };

  const updateUserWallet = (userId, amount) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, wallet: user.wallet + amount }
        : user
    ));
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, wallet: prev.wallet + amount }));
    }
  };

  const depositMoney = (userId, amount) => {
    if (amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }
    
    updateUserWallet(userId, amount);
    return { success: true };
  };

  const withdrawMoney = (userId, amount) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    if (user.wallet < amount) {
      return { success: false, error: 'Insufficient funds' };
    }
    
    updateUserWallet(userId, -amount);
    return { success: true };
  };

  const clearAllBets = () => {
    if (!currentUser || !currentUser.isAdmin) {
      return { success: false, error: 'Admin access required' };
    }
    
    localStorage.removeItem('gamblescope_bets');
    return { success: true, message: 'All bets cleared successfully' };
  };

  const clearUserBets = (userId) => {
    if (!currentUser || !currentUser.isAdmin) {
      return { success: false, error: 'Admin access required' };
    }
    
    const allBets = JSON.parse(localStorage.getItem('gamblescope_bets') || '[]');
    const filteredBets = allBets.filter(bet => bet.openerId !== userId);
    localStorage.setItem('gamblescope_bets', JSON.stringify(filteredBets));
    
    return { success: true, message: `Bets for user ${userId} cleared successfully` };
  };

  const clearIndividualBet = (betId) => {
    if (!currentUser || !currentUser.isAdmin) {
      return { success: false, error: 'Admin access required' };
    }
    
    const allBets = JSON.parse(localStorage.getItem('gamblescope_bets') || '[]');
    const betToDelete = allBets.find(bet => bet.id === betId);
    if (!betToDelete) {
      return { success: false, error: 'Bet not found' };
    }
    
    // Return original bet amounts to all users who placed bets
    if (betToDelete.individualBets && betToDelete.individualBets.length > 0) {
      betToDelete.individualBets.forEach(individualBet => {
        try {
          // Return the original bet amount to the user
          updateUserWallet(individualBet.userId, individualBet.amount);
          console.log(`Returned $${individualBet.amount} to ${individualBet.username} (bet closed by admin)`);
        } catch (error) {
          console.log(`Could not return bet amount to user ${individualBet.username} - user not found`);
        }
      });
    }
    
    const filteredBets = allBets.filter(bet => bet.id !== betId);
    localStorage.setItem('gamblescope_bets', JSON.stringify(filteredBets));
    
    return { success: true, message: `Bet "${betToDelete.subject} - ${betToDelete.testName}" cleared successfully. All bettors received refunds.` };
  };

  const makeAdmin = (username) => {
    if (!currentUser || !currentUser.isAdmin) {
      return { success: false, error: 'Admin access required' };
    }
    
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
    
    const updatedUsers = [...users];
    updatedUsers[userIndex].isAdmin = true;
    setUsers(updatedUsers);
    
    return { success: true, message: `${username} is now an admin` };
  };

  const createAdminUser = () => {
    const adminUser = {
      id: 'admin-manual-' + Date.now(),
      username: 'admin',
      email: 'admin@gamblescope.com',
      password: 'admin123',
      wallet: 1000,
      totalBets: 0,
      totalWinnings: 0,
      winRate: 0,
      isAdmin: true,
      createdAt: new Date().toISOString(),
      avatar: '/images/pfp.jpg'
    };
    
    setUsers(prev => [...prev, adminUser]);
    localStorage.setItem('gamblescope_registered_users', JSON.stringify([...users, adminUser]));
    console.log('Manually created admin user:', adminUser);
    
    return { success: true, message: 'Admin user created successfully' };
  };

  const value = {
    currentUser,
    users,
    signUp,
    signIn,
    signOut,
    depositMoney,
    withdrawMoney,
    updateUserWallet,
    clearAllBets,
    clearUserBets,
    clearIndividualBet,
    makeAdmin,
    createAdminUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

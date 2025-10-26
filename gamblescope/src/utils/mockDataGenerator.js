// Mock Data Generator for GambleScope
// Generates realistic betting activity for demo purposes

export const generateMockBettingActivity = (betId, betData) => {
  const mockBets = [];
  const timeIntervals = Math.floor(Math.random() * 11) + 15; // Generate 15-25 betting intervals
  const baseTime = new Date(betData.createdAt).getTime();
  
  // Sample usernames for mock bettors
  const mockUsernames = [
    'alex_student', 'sarah_math', 'mike_physics', 'emma_chem', 'jake_bio',
    'lisa_cs', 'tom_eng', 'anna_econ', 'dave_stats', 'zoe_psych',
    'ryan_hist', 'maya_art', 'sam_geo', 'lucy_lit', 'noah_phil',
    'chloe_bus', 'liam_med', 'ava_law', 'ethan_eng', 'sophia_sci'
  ];
  
  // Sample avatars
  const avatars = [
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg',
    '/images/pfp.jpg'
  ];
  
  for (let i = 0; i < timeIntervals; i++) {
    // Random time interval between 1-30 minutes after bet creation
    const randomMinutes = Math.random() * 30 + 1;
    const betTime = new Date(baseTime + (randomMinutes * 60 * 1000));
    
    // Random username and avatar
    const randomUsername = mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    // 50/50 chance of higher vs lower
    const prediction = Math.random() < 0.5 ? 'higher' : 'lower';
    
    // Random bet amount between $100-$1000
    const betAmount = Math.floor(Math.random() * 900) + 100;
    
    // Generate unique user ID
    const userId = `mock_user_${Date.now()}_${i}`;
    
    const mockBet = {
      id: `${betId}_mock_${i}`,
      betId: betId,
      userId: userId,
      username: randomUsername,
      userAvatar: randomAvatar,
      prediction: prediction,
      amount: betAmount,
      placedAt: betTime.toISOString()
    };
    
    mockBets.push(mockBet);
  }
  
  return mockBets;
};

export const populateBetWithMockData = (bet) => {
  const mockBets = generateMockBettingActivity(bet.id, bet);
  
  // Calculate totals
  const higherBets = mockBets.filter(b => b.prediction === 'higher');
  const lowerBets = mockBets.filter(b => b.prediction === 'lower');
  const higherTotal = higherBets.reduce((sum, b) => sum + b.amount, 0);
  const lowerTotal = lowerBets.reduce((sum, b) => sum + b.amount, 0);
  const totalPot = higherTotal + lowerTotal;
  
  return {
    ...bet,
    individualBets: mockBets,
    totalBets: mockBets.length,
    totalPot: totalPot,
    higherTotal: higherTotal,
    lowerTotal: lowerTotal
  };
};

export const generateMockBetsForDemo = () => {
  const sampleBets = [
    {
      id: 'demo_bet_1',
      openerId: 'demo_opener_1',
      openerUsername: 'prof_smith',
      openerAvatar: '/images/pfp.jpg',
      subject: 'Calculus I',
      testName: 'Midterm Exam',
      threshold: 75,
      description: 'Will students score above 75% on the calculus midterm?',
      status: 'open',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: 'demo_bet_2',
      openerId: 'demo_opener_2',
      openerUsername: 'dr_jones',
      openerAvatar: '/images/pfp.jpg',
      subject: 'Physics 101',
      testName: 'Quantum Mechanics Quiz',
      threshold: 85,
      description: 'Quantum mechanics is challenging - will students beat 85%?',
      status: 'open',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      id: 'demo_bet_3',
      openerId: 'demo_opener_3',
      openerUsername: 'ms_wilson',
      openerAvatar: '/images/pfp.jpg',
      subject: 'Chemistry Lab',
      testName: 'Organic Synthesis Report',
      threshold: 90,
      description: 'Lab reports are usually high-scoring. Will this one hit 90%?',
      status: 'open',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
      id: 'demo_bet_4',
      openerId: 'demo_opener_4',
      openerUsername: 'prof_brown',
      openerAvatar: '/images/pfp.jpg',
      subject: 'Computer Science',
      testName: 'Data Structures Final',
      threshold: 80,
      description: 'Tough final exam - will students crack 80%?',
      status: 'open',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
    },
    {
      id: 'demo_bet_5',
      openerId: 'demo_opener_5',
      openerUsername: 'dr_taylor',
      openerAvatar: '/images/pfp.jpg',
      subject: 'Biology',
      testName: 'Genetics Problem Set',
      threshold: 70,
      description: 'Genetics problems are tricky. Will students reach 70%?',
      status: 'open',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    }
  ];
  
  return sampleBets.map(bet => populateBetWithMockData(bet));
};

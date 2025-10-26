// Achievement System Utility

// Badge Definitions
export const ACHIEVEMENT_BADGES = {
  // Early Achievements
  FIRST_BET: {
    id: "first_bet",
    name: "First Bet",
    description: "Place your very first bet",
    icon: "🎯",
    type: "early",
    rarity: "common",
  },
  FIRST_WIN: {
    id: "first_win",
    name: "First Victory",
    description: "Win your first bet",
    icon: "🏆",
    type: "early",
    rarity: "common",
  },

  // Financial Achievements
  HIGH_ROLLER: {
    id: "high_roller",
    name: "High Roller",
    description: "Place a single bet of $100 or more",
    icon: "💰",
    type: "financial",
    rarity: "rare",
  },
  BIG_WINNER: {
    id: "big_winner",
    name: "Big Winner",
    description: "Win $100 or more in a single bet",
    icon: "💸",
    type: "financial",
    rarity: "rare",
  },
  MILLIONAIRE: {
    id: "millionaire",
    name: "Millionaire Status",
    description: "Accumulate $1000 in your wallet",
    icon: "💵",
    type: "financial",
    rarity: "legendary",
  },

  // Risk Achievements
  RISK_TAKER: {
    id: "risk_taker",
    name: "Risk Taker",
    description: "Bet on a 90%+ threshold",
    icon: "🎲",
    type: "risk",
    rarity: "epic",
  },
  CAUTIOUS_PLAYER: {
    id: "cautious_player",
    name: "Cautious Player",
    description: "Bet on a 60% or lower threshold",
    icon: "🛡️",
    type: "risk",
    rarity: "uncommon",
  },

  // Streak Achievements
  WINNING_STREAK_3: {
    id: "winning_streak_3",
    name: "On a Roll",
    description: "Win 3 bets in a row",
    icon: "🔥",
    type: "streak",
    rarity: "uncommon",
  },
  WINNING_STREAK_5: {
    id: "winning_streak_5",
    name: "Lucky Streak",
    description: "Win 5 bets in a row",
    icon: "⚡",
    type: "streak",
    rarity: "rare",
  },
  WINNING_STREAK_10: {
    id: "winning_streak_10",
    name: "Unstoppable",
    description: "Win 10 bets in a row",
    icon: "👑",
    type: "streak",
    rarity: "legendary",
  },

  // Activity Achievements
  ACTIVE_BETTOR: {
    id: "active_bettor",
    name: "Active Bettor",
    description: "Place 10 total bets",
    icon: "📊",
    type: "activity",
    rarity: "common",
  },
  DEDICATED_BETTOR: {
    id: "dedicated_bettor",
    name: "Dedicated Bettor",
    description: "Place 50 total bets",
    icon: "🎖️",
    type: "activity",
    rarity: "rare",
  },
  BETTING_LEGEND: {
    id: "betting_legend",
    name: "Betting Legend",
    description: "Place 100 total bets",
    icon: "🌟",
    type: "activity",
    rarity: "legendary",
  },

  // Creator Achievements
  CREATIVE_BETTOR: {
    id: "creative_bettor",
    name: "Creative Bettor",
    description: "Open your first bet",
    icon: "✨",
    type: "creator",
    rarity: "common",
  },
  BET_CREATOR: {
    id: "bet_creator",
    name: "Bet Creator",
    description: "Open 5 bets",
    icon: "📝",
    type: "creator",
    rarity: "uncommon",
  },
  MASTER_CREATOR: {
    id: "master_creator",
    name: "Master Creator",
    description: "Open 20 bets",
    icon: "🎨",
    type: "creator",
    rarity: "epic",
  },

  // Accuracy Achievements
  PERFECT_PREDICTOR: {
    id: "perfect_predictor",
    name: "Perfect Predictor",
    description: "Achieve 80% or higher win rate with 10+ bets",
    icon: "🎯",
    type: "accuracy",
    rarity: "epic",
  },
  ORACLE: {
    id: "oracle",
    name: "Oracle",
    description: "Achieve 90% or higher win rate with 20+ bets",
    icon: "🔮",
    type: "accuracy",
    rarity: "legendary",
  },

  // Social Achievements
  SOCIAL_BUTTERFLY: {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Place bets on 10 different users",
    icon: "🦋",
    type: "social",
    rarity: "uncommon",
  },

  // Miscellaneous
  NIGHT_OWL: {
    id: "night_owl",
    name: "Night Owl",
    description: "Place a bet between 2 AM and 5 AM",
    icon: "🦉",
    type: "misc",
    rarity: "rare",
  },
  EARLY_BIRD: {
    id: "early_bird",
    name: "Early Bird",
    description: "Place a bet before 7 AM",
    icon: "🐦",
    type: "misc",
    rarity: "uncommon",
  },

  // Secret Achievements
  SECRET_67: {
    id: "secret_67",
    name: "67",
    description: "Place a bet of exactly $67",
    icon: "👑",
    type: "secret",
    rarity: "secret",
  },
  OWNER: {
    id: "owner",
    name: "Owner",
    description: "The one who created this platform",
    icon: "👤",
    type: "secret",
    rarity: "secret",
  },
};

// Title Definitions
export const TITLES = {
  NOVICE: {
    id: "novice",
    name: "Novice Bettor",
    description: "Starting your betting journey",
    requirement: 0,
    icon: "🌱",
  },
  BEGINNER: {
    id: "beginner",
    name: "Beginner Bettor",
    description: "5+ bets placed",
    requirement: 5,
    icon: "📚",
  },
  APPRENTICE: {
    id: "apprentice",
    name: "Apprentice Bettor",
    description: "15+ bets placed",
    requirement: 15,
    icon: "🎓",
  },
  SKILLED: {
    id: "skilled",
    name: "Skilled Bettor",
    description: "30+ bets placed",
    requirement: 30,
    icon: "⚔️",
  },
  VETERAN: {
    id: "veteran",
    name: "Veteran Bettor",
    description: "50+ bets placed",
    requirement: 50,
    icon: "🗡️",
  },
  EXPERT: {
    id: "expert",
    name: "Expert Bettor",
    description: "75+ bets placed, 60%+ win rate",
    requirement: 75,
    icon: "🏅",
  },
  MASTER: {
    id: "master",
    name: "Master Bettor",
    description: "100+ bets placed, 70%+ win rate",
    requirement: 100,
    icon: "👑",
  },
  LEGEND: {
    id: "legend",
    name: "Legendary Bettor",
    description: "200+ bets placed, 75%+ win rate",
    requirement: 200,
    icon: "🌟",
  },
};

// Calculate user statistics for achievement checking
export const calculateUserStats = (
  placedBets,
  openedBets,
  currentUser,
  allBets,
) => {
  const stats = {
    totalBetsPlaced: placedBets.length,
    totalBetsOpened: openedBets.length,
    totalWinnings: 0,
    highestSingleBet: 0,
    highestWin: 0,
    winningStreak: 0,
    losingStreak: 0,
    currentStreak: 0,
    totalBetAmount: 0,
    winRate: 0,
    betsWon: 0,
    uniqueUsersBetOn: new Set(),
    hasBet90Plus: false,
    hasBet60Minus: false,
    hasBetLateNight: false,
    hasBetEarlyMorning: false,
    hasBet67: false,
    username: currentUser.username,
  };

  // Process placed bets
  placedBets.forEach((bet) => {
    // Track highest bet amount
    if (bet.amount > stats.highestSingleBet) {
      stats.highestSingleBet = bet.amount;
    }

    stats.totalBetAmount += bet.amount;

    // Track unique users bet on
    if (bet.betOpenerUsername) {
      stats.uniqueUsersBetOn.add(bet.betOpenerUsername);
    }

    // Check threshold achievements
    if (bet.betThreshold >= 90) {
      stats.hasBet90Plus = true;
    }
    if (bet.betThreshold <= 60) {
      stats.hasBet60Minus = true;
    }

    // Check time-based achievements
    const betTime = new Date(bet.placedAt).getHours();
    if (betTime >= 2 && betTime < 5) {
      stats.hasBetLateNight = true;
    }
    if (betTime < 7) {
      stats.hasBetEarlyMorning = true;
    }

    // Check for secret $67 bet
    if (bet.amount === 67) {
      stats.hasBet67 = true;
    }

    // Process ended bets
    if (bet.betStatus === "ended") {
      const userWon = bet.prediction === bet.betWinningSide;

      if (userWon) {
        stats.betsWon++;

        // Find the bet to get payout info
        const parentBet = allBets.find((b) => b.id === bet.betId);
        if (parentBet && parentBet.payouts) {
          const userPayout = parentBet.payouts.find(
            (p) => p.userId === currentUser.id,
          );
          if (userPayout) {
            const winAmount = userPayout.payout;
            stats.totalWinnings += winAmount;

            if (winAmount > stats.highestWin) {
              stats.highestWin = winAmount;
            }
          }
        }

        // Update streak (if this continues winning streak)
        if (stats.currentStreak >= 0) {
          stats.currentStreak++;
          if (stats.currentStreak > stats.winningStreak) {
            stats.winningStreak = stats.currentStreak;
          }
        } else {
          stats.currentStreak = 1;
        }
      } else {
        // User lost
        stats.totalWinnings -= bet.amount;

        // Update streak (if this continues losing streak)
        if (stats.currentStreak <= 0) {
          stats.currentStreak--;
          if (Math.abs(stats.currentStreak) > Math.abs(stats.losingStreak)) {
            stats.losingStreak = stats.currentStreak;
          }
        } else {
          stats.currentStreak = -1;
        }
      }
    }
  });

  stats.winRate =
    stats.totalBetsPlaced > 0
      ? (stats.betsWon / stats.totalBetsPlaced) * 100
      : 0;
  stats.uniqueUsersCount = stats.uniqueUsersBetOn.size;

  return stats;
};

// Check which achievements should be unlocked based on stats
export const checkAchievements = (stats, unlockedAchievements = []) => {
  const newAchievements = [];

  // First Bet
  if (
    stats.totalBetsPlaced >= 1 &&
    !unlockedAchievements.includes("first_bet")
  ) {
    newAchievements.push("first_bet");
  }

  // First Win
  if (stats.betsWon >= 1 && !unlockedAchievements.includes("first_win")) {
    newAchievements.push("first_win");
  }

  // High Roller
  if (
    stats.highestSingleBet >= 100 &&
    !unlockedAchievements.includes("high_roller")
  ) {
    newAchievements.push("high_roller");
  }

  // Big Winner
  if (stats.highestWin >= 100 && !unlockedAchievements.includes("big_winner")) {
    newAchievements.push("big_winner");
  }

  // Risk Taker
  if (stats.hasBet90Plus && !unlockedAchievements.includes("risk_taker")) {
    newAchievements.push("risk_taker");
  }

  // Cautious Player
  if (
    stats.hasBet60Minus &&
    !unlockedAchievements.includes("cautious_player")
  ) {
    newAchievements.push("cautious_player");
  }

  // Winning Streaks
  if (
    stats.winningStreak >= 3 &&
    !unlockedAchievements.includes("winning_streak_3")
  ) {
    newAchievements.push("winning_streak_3");
  }
  if (
    stats.winningStreak >= 5 &&
    !unlockedAchievements.includes("winning_streak_5")
  ) {
    newAchievements.push("winning_streak_5");
  }
  if (
    stats.winningStreak >= 10 &&
    !unlockedAchievements.includes("winning_streak_10")
  ) {
    newAchievements.push("winning_streak_10");
  }

  // Activity Achievements
  if (
    stats.totalBetsPlaced >= 10 &&
    !unlockedAchievements.includes("active_bettor")
  ) {
    newAchievements.push("active_bettor");
  }
  if (
    stats.totalBetsPlaced >= 50 &&
    !unlockedAchievements.includes("dedicated_bettor")
  ) {
    newAchievements.push("dedicated_bettor");
  }
  if (
    stats.totalBetsPlaced >= 100 &&
    !unlockedAchievements.includes("betting_legend")
  ) {
    newAchievements.push("betting_legend");
  }

  // Creator Achievements
  if (
    stats.totalBetsOpened >= 1 &&
    !unlockedAchievements.includes("creative_bettor")
  ) {
    newAchievements.push("creative_bettor");
  }
  if (
    stats.totalBetsOpened >= 5 &&
    !unlockedAchievements.includes("bet_creator")
  ) {
    newAchievements.push("bet_creator");
  }
  if (
    stats.totalBetsOpened >= 20 &&
    !unlockedAchievements.includes("master_creator")
  ) {
    newAchievements.push("master_creator");
  }

  // Accuracy Achievements
  if (
    stats.totalBetsPlaced >= 10 &&
    stats.winRate >= 80 &&
    !unlockedAchievements.includes("perfect_predictor")
  ) {
    newAchievements.push("perfect_predictor");
  }
  if (
    stats.totalBetsPlaced >= 20 &&
    stats.winRate >= 90 &&
    !unlockedAchievements.includes("oracle")
  ) {
    newAchievements.push("oracle");
  }

  // Social Achievements
  if (
    stats.uniqueUsersCount >= 10 &&
    !unlockedAchievements.includes("social_butterfly")
  ) {
    newAchievements.push("social_butterfly");
  }

  // Time-based Achievements
  if (stats.hasBetLateNight && !unlockedAchievements.includes("night_owl")) {
    newAchievements.push("night_owl");
  }
  if (
    stats.hasBetEarlyMorning &&
    !unlockedAchievements.includes("early_bird")
  ) {
    newAchievements.push("early_bird");
  }

  // Secret Achievements
  if (stats.hasBet67 && !unlockedAchievements.includes("secret_67")) {
    newAchievements.push("secret_67");
  }

  // Owner achievement
  if (
    stats.username &&
    stats.username.toLowerCase() === "ethangu" &&
    !unlockedAchievements.includes("owner")
  ) {
    newAchievements.push("owner");
  }

  return newAchievements;
};

// Get user's current title based on stats
export const getUserTitle = (stats) => {
  // Check in reverse order (highest first)
  const titleKeys = Object.keys(TITLES).reverse();

  for (const key of titleKeys) {
    const title = TITLES[key];

    // Basic requirement check
    if (stats.totalBetsPlaced >= title.requirement) {
      // For advanced titles, check win rate requirements
      if (title.id === "expert" && stats.winRate < 60) continue;
      if (title.id === "master" && stats.winRate < 70) continue;
      if (title.id === "legend" && stats.winRate < 75) continue;

      return title;
    }
  }

  return TITLES.NOVICE;
};

// Get rarity color
export const getRarityColor = (rarity) => {
  switch (rarity) {
    case "common":
      return "#9e9e9e"; // Gray
    case "uncommon":
      return "#4caf50"; // Green
    case "rare":
      return "#2196f3"; // Blue
    case "epic":
      return "#9c27b0"; // Purple
    case "legendary":
      return "#ff9800"; // Orange
    case "secret":
      return "#e91e63"; // Pink
    default:
      return "#9e9e9e";
  }
};

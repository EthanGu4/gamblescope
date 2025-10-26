import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  ACHIEVEMENT_BADGES,
  TITLES,
  calculateUserStats,
  checkAchievements,
  getUserTitle,
  getRarityColor,
} from "../utils/achievements";
import "./Achievements.css";

function Achievements() {
  const { currentUser } = useAuth();
  const [userAchievements, setUserAchievements] = useState([]);
  const [userTitle, setUserTitle] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rarity");

  // Load user's achievements from localStorage
  useEffect(() => {
    const loadAchievements = () => {
      const savedAchievements = localStorage.getItem(
        `gamblescope_achievements_${currentUser.id}`,
      );
      const achievements = savedAchievements
        ? JSON.parse(savedAchievements)
        : [];

      // Get all bets to calculate stats
      const savedBets = localStorage.getItem("gamblescope_bets");
      const allBets = savedBets ? JSON.parse(savedBets) : [];

      // Calculate user stats
      const openedBets = allBets.filter(
        (bet) => bet.openerId === currentUser.id,
      );
      const allPlacedBets = [];
      allBets.forEach((bet) => {
        if (bet.individualBets) {
          const userIndividualBets = bet.individualBets.filter(
            (individualBet) => individualBet.userId === currentUser.id,
          );
          userIndividualBets.forEach((individualBet) => {
            allPlacedBets.push({
              ...individualBet,
              betId: bet.id,
              betSubject: bet.subject,
              betTestName: bet.testName,
              betThreshold: bet.threshold,
              betStatus: bet.status,
              betActualScore: bet.actualScore,
              betWinningSide: bet.winningSide,
              betOpenerUsername: bet.openerUsername,
            });
          });
        }
      });

      const calculatedStats = calculateUserStats(
        allPlacedBets,
        openedBets,
        currentUser,
        allBets,
      );
      setStats(calculatedStats);

      // Check for new achievements
      const newAchievements = checkAchievements(calculatedStats, achievements);

      if (newAchievements.length > 0) {
        const updatedAchievements = [...achievements, ...newAchievements];
        localStorage.setItem(
          `gamblescope_achievements_${currentUser.id}`,
          JSON.stringify(updatedAchievements),
        );
        setUserAchievements(updatedAchievements);

        // Show notification for new achievements
        alert(
          `🎉 Achievement Unlocked! ${newAchievements.map((id) => ACHIEVEMENT_BADGES[Object.values(ACHIEVEMENT_BADGES).find((b) => b.id === id)?.id]?.name || id).join(", ")}`,
        );
      } else {
        setUserAchievements(achievements);
      }

      // Get user's current title
      const title = getUserTitle(calculatedStats);
      setUserTitle(title);
    };

    loadAchievements();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadAchievements();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(loadAchievements, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [currentUser.id]);

  // Get filtered and sorted achievements
  const getDisplayedAchievements = () => {
    const allBadges = Object.values(ACHIEVEMENT_BADGES);

    // Filter by selected category
    let filtered = allBadges;
    if (selectedFilter !== "all") {
      if (selectedFilter === "unlocked") {
        filtered = allBadges.filter((badge) =>
          userAchievements.includes(badge.id),
        );
      } else if (selectedFilter === "locked") {
        filtered = allBadges.filter(
          (badge) => !userAchievements.includes(badge.id),
        );
      } else {
        filtered = allBadges.filter((badge) => badge.type === selectedFilter);
      }
    }

    // Hide secret achievements until unlocked
    filtered = filtered.filter((badge) => {
      if (badge.rarity === "secret" && !userAchievements.includes(badge.id)) {
        return false;
      }
      return true;
    });

    // Sort achievements
    const sorted = [...filtered].sort((a, b) => {
      const aUnlocked = userAchievements.includes(a.id);
      const bUnlocked = userAchievements.includes(b.id);

      if (sortBy === "rarity") {
        const rarityOrder = {
          secret: 0,
          legendary: 1,
          epic: 2,
          rare: 3,
          uncommon: 4,
          common: 5,
        };
        if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        }
        return aUnlocked === bUnlocked ? 0 : aUnlocked ? -1 : 1;
      } else if (sortBy === "type") {
        if (a.type !== b.type) {
          return a.type.localeCompare(b.type);
        }
        return aUnlocked === bUnlocked ? 0 : aUnlocked ? -1 : 1;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return sorted;
  };

  const rarityOrder = {
    secret: 6,
    legendary: 5,
    epic: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
  };
  const unlockedCount = userAchievements.length;
  // Count total achievements excluding locked secret achievements
  const totalCount = Object.values(ACHIEVEMENT_BADGES).filter((badge) => {
    if (badge.rarity === "secret" && !userAchievements.includes(badge.id)) {
      return false;
    }
    return true;
  }).length;
  const completionPercentage = ((unlockedCount / totalCount) * 100).toFixed(0);

  return (
    <div className="achievements">
      <div className="achievements-header">
        <h2>🏆 Achievements</h2>
        <p>Track your progress and unlock badges</p>
      </div>

      {/* User Overview */}
      <div className="achievements-overview">
        <div className="overview-card">
          <div className="overview-item">
            <div className="overview-icon">👤</div>
            <div className="overview-info">
              <h3>Current Title</h3>
              <p className="title-display">
                <span className="title-icon">{userTitle?.icon}</span>
                <span className="title-name">{userTitle?.name}</span>
              </p>
              <small>{userTitle?.description}</small>
            </div>
          </div>

          {stats && (
            <>
              <div className="overview-item">
                <div className="overview-icon">🔥</div>
                <div className="overview-info">
                  <h3>Best Streak</h3>
                  <p className="stat-value">{stats.winningStreak} wins</p>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-icon">💰</div>
                <div className="overview-info">
                  <h3>Total Winnings</h3>
                  <p
                    className={`stat-value ${stats.totalWinnings >= 0 ? "positive" : "negative"}`}
                  >
                    {stats.totalWinnings >= 0 ? "+" : ""}$
                    {stats.totalWinnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="progress-card">
          <h3>Achievement Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {unlockedCount} / {totalCount} ({completionPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="achievements-controls">
        <div className="filter-buttons">
          <span>Filter:</span>
          <button
            className={selectedFilter === "all" ? "active" : ""}
            onClick={() => setSelectedFilter("all")}
          >
            All
          </button>
          <button
            className={selectedFilter === "unlocked" ? "active" : ""}
            onClick={() => setSelectedFilter("unlocked")}
          >
            Unlocked
          </button>
          <button
            className={selectedFilter === "locked" ? "active" : ""}
            onClick={() => setSelectedFilter("locked")}
          >
            Locked
          </button>
        </div>

        <div className="sort-select">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rarity">Rarity</option>
            <option value="type">Type</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {getDisplayedAchievements().map((badge) => {
          const isUnlocked = userAchievements.includes(badge.id);

          return (
            <div
              key={badge.id}
              className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}
            >
              <div
                className="achievement-icon"
                style={{
                  filter: isUnlocked ? "none" : "grayscale(100%)",
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {badge.icon}
              </div>
              <div className="achievement-info">
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="achievement-meta">
                  <span className="badge-type">{badge.type}</span>
                  <span
                    className="badge-rarity"
                    style={{ color: getRarityColor(badge.rarity) }}
                  >
                    {badge.rarity}
                  </span>
                </div>
              </div>
              <div className="achievement-status">
                {isUnlocked ? (
                  <span className="status-unlocked">✓</span>
                ) : (
                  <span className="status-locked">🔒</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {getDisplayedAchievements().length === 0 && (
        <div className="no-achievements">
          <p>No achievements found with the current filter.</p>
        </div>
      )}
    </div>
  );
}

export default Achievements;

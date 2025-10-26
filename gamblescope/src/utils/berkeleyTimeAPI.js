// Berkeley Time API utility
// Note: Berkeley Time doesn't have a public API, so we'll create mock data
// that simulates what we would get from their API

// Helper function to convert course code to Berkeley Time URL format
const getBerkeleyTimeUrl = (courseCode) => {
  // Normalize course code (remove spaces, handle special cases)
  const normalized = courseCode.replace(/\s+/g, "").toUpperCase();

  // Common department mappings
  const departmentMap = {
    CS: "COMPSCI",
    MATH: "MATH",
    PHYSICS: "PHYSICS",
    EECS: "EECS",
    ECON: "ECON",
    CHEM: "CHEM",
    BIO: "BIOLOGY",
    MCB: "MCB",
    ENGIN: "ENGIN",
    STAT: "STAT",
    PSYCH: "PSYCH",
    POL: "POLSCI",
    POLSCI: "POLSCI",
    HISTORY: "HISTORY",
    ANTHRO: "ANTHRO",
    SOCIOL: "SOCIOL",
  };

  // Extract department and number
  let department = "";
  let number = "";

  // Try to match department prefix
  for (const [abbrev, fullName] of Object.entries(departmentMap)) {
    if (normalized.startsWith(abbrev)) {
      department = fullName;
      number = normalized.substring(abbrev.length);
      break;
    }
  }

  // Fallback: try to extract numbers at the end
  if (!department) {
    const match = normalized.match(/^([A-Z]+)(\d+[A-Z]*)/);
    if (match) {
      const abbrev = match[1];
      department = departmentMap[abbrev] || abbrev;
      number = match[2];
    } else {
      // Last resort: use first letters and numbers
      const letterMatch = normalized.match(/^([A-Z]+)/);
      const numMatch = normalized.match(/(\d+)/);
      if (letterMatch) department = letterMatch[1];
      if (numMatch) number = numMatch[1];
    }
  }

  // Construct URL
  const query = courseCode.replace(/\s+/g, "").toLowerCase();
  return `https://berkeleytime.com/catalog/Fall%202025/${department}/${number}?q=${query}`;
};

export const getBerkeleyTimeCourseData = async (courseCode) => {
  // Simulate API call with realistic UC Berkeley course data
  // In a real implementation, this would fetch from Berkeley Time's API

  // Mock course data with realistic distributions
  const mockCourseData = {
    "CS 61A": {
      average: 75,
      distribution: [
        0.02, 0.03, 0.05, 0.08, 0.12, 0.15, 0.18, 0.16, 0.12, 0.09,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CS 61A"),
    },
    "CS 61B": {
      average: 78,
      distribution: [0.01, 0.02, 0.04, 0.07, 0.11, 0.14, 0.19, 0.18, 0.14, 0.1],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CS 61B"),
    },
    "CS 61C": {
      average: 73,
      distribution: [
        0.03, 0.04, 0.06, 0.09, 0.13, 0.16, 0.17, 0.15, 0.11, 0.06,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CS 61C"),
    },
    "CS 70": {
      average: 70,
      distribution: [
        0.05, 0.07, 0.09, 0.12, 0.14, 0.16, 0.15, 0.12, 0.07, 0.03,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CS 70"),
    },
    "CS 170": {
      average: 82,
      distribution: [0.01, 0.01, 0.02, 0.04, 0.08, 0.12, 0.18, 0.22, 0.2, 0.12],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CS 170"),
    },
    "CS 189": {
      average: 85,
      distribution: [
        0.01, 0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.18, 0.25, 0.25,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CS 189"),
    },
    "MATH 1A": {
      average: 72,
      distribution: [0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.16, 0.14, 0.1, 0.05],
      berkeleyTimeUrl: getBerkeleyTimeUrl("MATH 1A"),
    },
    "MATH 1B": {
      average: 71,
      distribution: [
        0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.15, 0.13, 0.09, 0.03,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("MATH 1B"),
    },
    "MATH 53": {
      average: 74,
      distribution: [
        0.03, 0.05, 0.07, 0.09, 0.12, 0.15, 0.17, 0.15, 0.12, 0.05,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("MATH 53"),
    },
    "MATH 54": {
      average: 76,
      distribution: [
        0.02, 0.04, 0.06, 0.08, 0.12, 0.15, 0.18, 0.16, 0.13, 0.06,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("MATH 54"),
    },
    "PHYSICS 7A": {
      average: 77,
      distribution: [
        0.02, 0.03, 0.05, 0.08, 0.11, 0.14, 0.18, 0.17, 0.13, 0.09,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("PHYSICS 7A"),
    },
    "EECS 16A": {
      average: 73,
      distribution: [
        0.03, 0.04, 0.06, 0.09, 0.12, 0.15, 0.17, 0.16, 0.12, 0.06,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("EECS 16A"),
    },
    "EECS 16B": {
      average: 71,
      distribution: [0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.16, 0.14, 0.1, 0.01],
      berkeleyTimeUrl: getBerkeleyTimeUrl("EECS 16B"),
    },
    "ECON 1": {
      average: 80,
      distribution: [
        0.01, 0.02, 0.03, 0.06, 0.09, 0.13, 0.18, 0.21, 0.18, 0.09,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("ECON 1"),
    },
    "CHEM 1A": {
      average: 74,
      distribution: [
        0.03, 0.04, 0.06, 0.09, 0.12, 0.15, 0.17, 0.16, 0.13, 0.05,
      ],
      berkeleyTimeUrl: getBerkeleyTimeUrl("CHEM 1A"),
    },
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Return mock data if available, otherwise return default
  if (mockCourseData[courseCode]) {
    return mockCourseData[courseCode];
  }

  // Return default data for courses not in the mock data
  return {
    average: 75,
    distribution: [0.03, 0.05, 0.07, 0.1, 0.13, 0.15, 0.17, 0.15, 0.11, 0.04],
    berkeleyTimeUrl: getBerkeleyTimeUrl(courseCode),
  };
};

export const getDefaultCourseData = (courseCode = "CS 61A") => ({
  average: 75,
  distribution: [0.03, 0.05, 0.07, 0.1, 0.13, 0.15, 0.17, 0.15, 0.11, 0.04],
  berkeleyTimeUrl: getBerkeleyTimeUrl(courseCode),
});

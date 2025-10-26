// Mock Data Generator for GambleScope
// Generates realistic betting activity for demo purposes

export const generateMockBettingActivity = (betId, betData) => {
  const mockBets = [];
  const timeIntervals = Math.floor(Math.random() * 11) + 15; // Generate 15-25 betting intervals
  const baseTime = new Date(betData.createdAt).getTime();

  // Sample usernames for mock bettors - unique first and last names
  const mockUsernames = [
    "Alexander Martinez",
    "Sarah Johnson",
    "Michael Chen",
    "Emma Williams",
    "Jake Thompson",
    "Lisa Rodriguez",
    "Thomas Anderson",
    "Anna Gupta",
    "David Kim",
    "Zoe Patel",
    "Ryan O'Connor",
    "Maya Patel",
    "Samuel Lee",
    "Lucy Brown",
    "Noah Taylor",
    "Chloe Wilson",
    "Liam Garcia",
    "Ava Smith",
    "Ethan Davis",
    "Sophia Moore",
    "Isabella Jackson",
    "Mason White",
    "Olivia Harris",
    "Lucas Martin",
    "Amelia Lewis",
    "Aiden Walker",
    "Harper Hall",
    "Evelyn Allen",
    "Benjamin Young",
    "Charlotte King",
    "James Wright",
    "Abigail Lopez",
    "William Hill",
    "Emily Scott",
    "Daniel Green",
    "Sofia Adams",
    "Matthew Baker",
    "Madison Nelson",
    "Joseph Carter",
    "Avery Mitchell",
    "Mia Perez",
    "Andrew Roberts",
    "Victoria Turner",
    "Christopher Phillips",
    "Grace Campbell",
    "Nathan Parker",
    "Hannah Evans",
    "Joshua Edwards",
    "Natalie Collins",
    "Tyler Stewart",
    "Lily Sanchez",
    "Jacob Morris",
    "Zoe Rogers",
    "Ryan Reed",
    "Chloe Cook",
    "Maya Morgan",
    "Ethan Bell",
    "Emma Murphy",
    "Lucas Bailey",
    "Aria Rivera",
    "Carter Cooper",
    "Scarlett Richardson",
    "Jack Cox",
    "Hazel Howard",
    "Owen Ward",
    "Piper Torres",
    "Landon Peterson",
    "Layla Gray",
    "Ezra Ramirez",
    "Sienna James",
    "Julian Watson",
    "Eleanor Brooks",
    "Audrey Kelly",
    "Parker Sanders",
    "Quinn Price",
    "Ruby Bennett",
    "Xavier Wood",
    "Paisley Ross",
    "Ivy Butler",
    "Blake Hughes",
    "Willow Alexander",
    "Levi Russell",
    "Nova Griffin",
    "Kai Diaz",
    "Daisy Hayes",
    "Theo Myers",
    "Maya Ford",
    "Felix Hamilton",
    "Violet Graham",
    "Sage Sullivan",
    "Margot Wallace",
    "Orion Woods",
    "Iris Collins",
    "Phoenix Stone",
    "Luna Floyd",
  ];

  // Sample avatars
  const avatars = [
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
    "/images/pfp.jpg",
  ];

  for (let i = 0; i < timeIntervals; i++) {
    // Random time interval between 1-30 minutes after bet creation
    const randomMinutes = Math.random() * 30 + 1;
    const betTime = new Date(baseTime + randomMinutes * 60 * 1000);

    // Random username and avatar
    const randomUsername =
      mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    // 50/50 chance of higher vs lower
    const prediction = Math.random() < 0.5 ? "higher" : "lower";

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
      placedAt: betTime.toISOString(),
    };

    mockBets.push(mockBet);
  }

  return mockBets;
};

export const populateBetWithMockData = (bet) => {
  const mockBets = generateMockBettingActivity(bet.id, bet);

  const higherBets = mockBets.filter((b) => b.prediction === "higher");
  const lowerBets = mockBets.filter((b) => b.prediction === "lower");
  const higherTotal = higherBets.reduce((sum, b) => sum + b.amount, 0);
  const lowerTotal = lowerBets.reduce((sum, b) => sum + b.amount, 0);
  const totalPot = higherTotal + lowerTotal;

  return {
    ...bet,
    individualBets: mockBets,
    totalBets: mockBets.length,
    totalPot: totalPot,
    higherTotal: higherTotal,
    lowerTotal: lowerTotal,
  };
};

export const generateMockBetsForDemo = () => {
  // Array of potential opener usernames - mix of professors and students
  const openerUsernames = [
    // Professors
    "Dr. Robert Chen",
    "Prof. Sarah Anderson",
    "Dr. Michael Thompson",
    "Prof. Jennifer Martinez",
    "Dr. David Wilson",
    "Prof. Emily Brown",
    "Dr. James Garcia",
    "Prof. Lisa Rodriguez",
    "Dr. Christopher Lee",
    "Prof. Amanda White",
    "Dr. Daniel Kim",
    "Prof. Rachel Johnson",
    "Dr. Matthew Davis",
    "Prof. Nicole Taylor",
    "Dr. Kevin Moore",
    "Prof. Stephanie Clark",
    "Dr. Brandon Lewis",
    "Prof. Lauren Walker",
    "Dr. Justin Hall",
    "Prof. Megan Young",
    "Dr. Ryan Scott",
    "Prof. Jessica Green",
    "Dr. Nicholas Adams",
    "Prof. Samantha Baker",
    "Dr. Tyler Hill",
    // Students
    "Marcus Johnson",
    "Emma Rodriguez",
    "Jordan Williams",
    "Taylor Mitchell",
    "Alex Rivera",
    "Casey Martinez",
    "Riley Thompson",
    "Quinn Anderson",
    "Avery Parker",
    "Morgan Davis",
    "Cameron White",
    "Reagan Harris",
    "Dakota Martin",
    "Phoenix Walker",
    "River Lewis",
    "Rowan King",
    "Sage Young",
    "Blake Wright",
    "Ellis Lopez",
    "Ellery Green",
    "Hayden Hill",
    "Logan Baker",
    "Micah Nelson",
    "Finley Carter",
    "Riley Evans",
  ];

  // UC Berkeley courses
  const ucBerkeleyCourses = [
    "CS 61A",
    "CS 61B",
    "CS 61C",
    "CS 70",
    "CS 170",
    "CS 161",
    "CS 188",
    "CS 189",
    "MATH 1A",
    "MATH 1B",
    "MATH 53",
    "MATH 54",
    "MATH 110",
    "MATH 113",
    "MATH 104",
    "PHYSICS 7A",
    "PHYSICS 7B",
    "PHYSICS 7C",
    "PHYSICS 137A",
    "PHYSICS 137B",
    "CHEM 1A",
    "CHEM 1B",
    "CHEM 3A",
    "CHEM 3B",
    "CHEM 112A",
    "CHEM 112B",
    "ECON 1",
    "ECON 2",
    "ECON 100A",
    "ECON 100B",
    "ECON 101",
    "BIO 1A",
    "BIO 1B",
    "MCB 102",
    "MCB 110",
    "MCB 140",
    "ENGIN 7",
    "EECS 16A",
    "EECS 16B",
    "EECS 120",
    "EECS 127",
    "STAT 2",
    "STAT 20",
    "STAT 134",
    "STAT 140",
    "STAT 150",
    "PSYCH 1",
    "PSYCH 101",
    "PSYCH 104",
    "PSYCH 110",
    "POL SCI 1",
    "POL SCI 2",
    "POL SCI 140A",
    "POL SCI 140C",
    "HISTORY 7A",
    "HISTORY 7B",
    "ANTHRO 2AC",
    "SOCIOL 1",
  ];

  const testTypes = ["Midterm", "Final", "Quiz"];

  // Various description templates
  const descriptionTemplates = [
    (course, threshold) =>
      `Challenging ${course}. Can students pull through with ${threshold}%+?`,
    (course, threshold) =>
      `Rumor has it this exam is tough. Will students exceed ${threshold}%?`,
    (course, threshold) =>
      `${course} exam coming up - will students score ${threshold}% or higher?`,
    (course, threshold) =>
      `This ${course} test has a ${threshold}% pass rate. Bet on if they beat it!`,
    (course, threshold) =>
      `Study groups going crazy for this one. Who thinks ${threshold}%+?`,
    (course, threshold) =>
      `${course} - historically students average ${threshold - 5}%. Can they hit ${threshold}%?`,
    (course, threshold) =>
      `Heard this exam is easier than expected. Will it show with ${threshold}%+ scores?`,
    (course, threshold) =>
      `Rate my professor gave it 2/5 difficulty. ${threshold}% over/under?`,
    (course, threshold) =>
      `${course} curve is usually generous - ${threshold}% achievable?`,
    (course, threshold) =>
      `Class average predictions around ${threshold - 3}%. Anyone betting on ${threshold}%+?`,
    (course, threshold) =>
      `${course} final grades typically skew high. Will students hit ${threshold}%?`,
    (course, threshold) =>
      `Study guide looks comprehensive. Betting it leads to ${threshold}%+ scores!`,
  ];

  // Helper function to get random course
  const getRandomCourse = () =>
    ucBerkeleyCourses[Math.floor(Math.random() * ucBerkeleyCourses.length)];
  const getRandomTestType = () =>
    testTypes[Math.floor(Math.random() * testTypes.length)];
  const getRandomThreshold = () => Math.floor(Math.random() * 20) + 65; // 65-85
  const getRandomHoursAgo = (min, max) =>
    new Date(
      Date.now() -
        (Math.floor(Math.random() * (max - min + 1)) + min) * 60 * 60 * 1000,
    ).toISOString();
  const getRandomDescription = (course, threshold) => {
    const template =
      descriptionTemplates[
        Math.floor(Math.random() * descriptionTemplates.length)
      ];
    return template(course, threshold);
  };

  // Generate each bet with its own course and threshold
  const createBet = (id, openerId, hoursRange) => {
    const course = getRandomCourse();
    const threshold = getRandomThreshold();
    return {
      id: id,
      openerId: openerId,
      openerUsername:
        openerUsernames[Math.floor(Math.random() * openerUsernames.length)],
      openerAvatar: "/images/pfp.jpg",
      subject: course,
      testName: getRandomTestType(),
      threshold: threshold,
      description: getRandomDescription(course, threshold),
      status: "open",
      createdAt: getRandomHoursAgo(hoursRange[0], hoursRange[1]),
    };
  };

  const sampleBets = [
    createBet("demo_bet_1", "demo_opener_1", [2, 6]),
    createBet("demo_bet_2", "demo_opener_2", [1, 5]),
    createBet("demo_bet_3", "demo_opener_3", [3, 8]),
    createBet("demo_bet_4", "demo_opener_4", [4, 10]),
    createBet("demo_bet_5", "demo_opener_5", [5, 12]),
    createBet("demo_bet_6", "demo_opener_6", [6, 14]),
    createBet("demo_bet_7", "demo_opener_7", [7, 16]),
    createBet("demo_bet_8", "demo_opener_8", [8, 18]),
    createBet("demo_bet_9", "demo_opener_9", [9, 20]),
    createBet("demo_bet_10", "demo_opener_10", [10, 24]),
  ];

  return sampleBets.map((bet) => populateBetWithMockData(bet));
};

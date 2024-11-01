export const mockUsers = [
  {
    _id: "66a00d32edc03ba51c163acb",
    username: "levabu",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Oscar",
    email: "admin@gmail.com",
    role: "admin",
    loginMethod: "email",
    isBlocked: false,
    emailVerified: true,
    lastLogin: "2024-02-02T10:30:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    previousUsernames: [
      { username: "levabuuu", updatedAt: "2024-02-01T15:30:00Z" },
      { username: "levabunew", updatedAt: "2024-01-25T12:45:00Z" },
    ],
  },
  {
    _id: "66a00d32edc03ba51c163acc",
    username: "johnsmith",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=John",
    email: "john@example.com",
    role: "user",
    loginMethod: "google",
    isBlocked: true,
    emailVerified: true,
    lastLogin: "2024-02-01T14:20:00Z",
    createdAt: "2024-01-10T09:15:00Z",
    previousUsernames: [],
  },
];

export const mockCards = [
  {
    _id: "66a10ca1edc03ba51c163ad7",
    cardName: "Chase Sapphire Preferred",
    bankName: "Chase J.P. Morgan",
    cardImageUrl:
      "https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png",
    bayesianRating: 3.125,
    averageRating: 5.0,
    reviewCount: 1,
    creditScoreRequired: "700+",
    fees: [
      { name: "Annual Fee", value: "$0" },
      { name: "Foreign Fee", value: "0%" },
    ],
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    _id: "66a10ca1edc03ba51c163ad8",
    cardName: "Amex Gold Card",
    bankName: "American Express",
    cardImageUrl:
      "https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png",
    bayesianRating: 4.2,
    averageRating: 4.5,
    reviewCount: 15,
    creditScoreRequired: "690+",
    fees: [
      { name: "Annual Fee", value: "$250" },
      { name: "Foreign Fee", value: "0%" },
    ],
    createdAt: "2024-01-18T11:30:00Z",
  },
];

export const mockReviews = [
  {
    _id: "66bd078ffeb4176c7e227110",
    userId: {
      username: "levabu",
      email: "admin@gmail.com",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Oscar",
    },
    cardId: {
      cardName: "Chase Sapphire Preferred",
      cardImageUrl:
        "https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png",
    },
    rating: 5,
    title: "Great Travel Card",
    content:
      "This is an excellent card for travelers. The rewards are great and the benefits are worth it.",
    createdAt: "2024-02-01T15:30:00Z",
  },
  {
    _id: "66bd078ffeb4176c7e227111",
    userId: {
      username: "johnsmith",
      email: "john@example.com",
      avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=John",
    },
    cardId: {
      cardName: "Amex Gold Card",
      cardImageUrl:
        "https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/gold-card.png",
    },
    rating: 4,
    title: "Good Dining Rewards",
    content:
      "The dining rewards are excellent, but the annual fee is a bit high.",
    createdAt: "2024-01-25T09:45:00Z",
  },
];

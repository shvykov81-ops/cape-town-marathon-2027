import Fuse from "fuse.js";

interface FaqEntry {
  keywords: string[];
  answer: string;
}

export const FAQ_KNOWLEDGE_BASE: FaqEntry[] = [
  {
    keywords: ["book", "booking", "reserve", "spot", "camp", "prep camp", "lagoon", "package"],
    answer: "🎯 To book a prep camp spot:\n1. Visit our website: capetownmarathon2027.com/prep-camp\n2. Select your dates\n3. Complete the booking form\n\nNeed help? Contact us via the website form or email info@cape-town-marathon.com"
  },
  {
    keywords: ["trainer", "coach", "personal trainer", "training", "certified", "instructor"],
    answer: "💪 We have 12+ certified trainers! Browse profiles at capetownmarathon2027.com/trainers and click 'Book with [Name]' to secure your preferred coach."
  },
  {
    keywords: ["price", "cost", "fee", "how much", "payment", "pay", "expensive", "cheap", "dollar", "usd"],
    answer: "💰 Prep camp packages start from $1,200 per person (7 days, accommodation + training). Premium packages with 1-on-1 coaching available. Full pricing: capetownmarathon2027.com/pricing"
  },
  {
    keywords: ["date", "when", "schedule", "time", "2027", "september", "october", "race day"],
    answer: "📅 Cape Town Marathon 2027 will take place in September-October 2027 (exact date TBA). Prep camps open 7-14 days before race day. Subscribe to our newsletter for updates!"
  },
  {
    keywords: ["refund", "cancel", "money back", "return", "policy"],
    answer: "🔄 Refund policy:\n• Full refund: 30+ days before event\n• 50% refund: 14-30 days before\n• No refund: < 14 days\n\nContact info@cape-town-marathon.com for refund requests."
  },
  {
    keywords: ["visa", "passport", "travel", "flight", "airport", "cape town", "south africa", "fly"],
    answer: "✈️ Cape Town International Airport (CPT) is 20km from the city center. We offer airport transfers for prep camp participants. Visa requirements vary by nationality — check with your local South African embassy."
  },
  {
    keywords: ["accommodation", "hotel", "stay", "sleep", "room", "lodging", "apartment"],
    answer: "🏨 Prep camp packages include accommodation near Green Point Stadium. Options range from shared apartments to private suites. Book at capetownmarathon2027.com/prep-camp"
  },
  {
    keywords: ["route", "course", "distance", "42k", "42.2", "km", "marathon distance", "42.195"],
    answer: "🏃‍♂️ The marathon is 42.195km, starting at Green Point Stadium. The route passes Sea Point, Camps Bay, and finishes back at the stadium. Interactive map: capetownmarathon2027.com/race-week"
  },
  {
    keywords: ["abbott", "world marathon majors", "wmm", "candidate", "major", "prestigious", "majors"],
    answer: "🏆 Cape Town Marathon is Africa's FIRST Abbott World Marathon Majors candidate! This puts us alongside Tokyo, Boston, London, Berlin, Chicago, and NYC. Join history in the making!"
  },
  {
    keywords: ["contact", "email", "phone", "reach", "help", "support", "question", "how to contact"],
    answer: "📞 Contact options:\n• Website form: capetownmarathon2027.com/contact\n• Email: info@cape-town-marathon.com\n• This bot: type your question and I'll try to help!\n• Response time: within 24 hours"
  }
];

// Build fuse index for fuzzy matching
const fuseIndex = FAQ_KNOWLEDGE_BASE.map((entry, index) => ({
  index,
  keywords: entry.keywords.join(" ")
}));

const fuse = new Fuse(fuseIndex, {
  keys: ["keywords"],
  threshold: 0.4,
  includeScore: true
});

export function findFaqAnswer(userMessage: string): string | null {
  const normalized = userMessage.toLowerCase().trim();

  // Direct keyword match first
  for (const entry of FAQ_KNOWLEDGE_BASE) {
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return entry.answer;
      }
    }
  }

  // Fuzzy fallback
  const results = fuse.search(normalized);
  if (results.length > 0 && results[0].score! < 0.4) {
    return FAQ_KNOWLEDGE_BASE[results[0].item.index].answer;
  }

  return null;
}

export const FALLBACK_MESSAGE = 
  "Thanks for your question! I've forwarded it to our team. " +
  "We'll get back to you within 24 hours. 🏃‍♂️\n\n" +
  "In the meantime, try these commands:\n" +
  "/faq — Common questions\n" +
  "/book — Booking info\n" +
  "/contact — Contact options";

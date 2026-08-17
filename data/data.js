/* =================================================================
   DATA.JS — All Dashboard Data (Mock / Static)
   Separated from rendering logic. Replace with API calls later.
   ================================================================= */

const DASHBOARD_DATA = {
  /* ── User Profile ── */
  user: {
    username: "Keju Senpai",
    display_name: "Keju Senpai",
    avatar_url: "source/user.webp",
    level: 1,
    title: "Language Master"
  },

  /* ── Overall Stats ── */
  overview: {
    overall_progress: 0,
    current_streak: 1,
    best_streak: 1,
    completed_lessons: 1,
    total_lessons_across_languages: 201,
    xp_earned: 8,
    time_spent: "2h 15m"
  },

  /* ── Language Progress ── */
  languages: [
    {
      id: "jp",
      name: "Japanese",
      native_name: "日本語",
      flag: "🇯🇵",
      level: "N4",
      level_label: "Intermediate",
      progress_percent: 0,
      lessons_completed: 24,
      lessons_total: 53,
      streak_days: 7,
      accent_color: "#f43f5e",
      accent_gradient: "linear-gradient(135deg, #f43f5e, #fb7185)",
      url: "source/menu/hiragana/jp.html"
    },
    {
      id: "de",
      name: "German",
      native_name: "Deutsch",
      flag: "🇩🇪",
      level: "A2",
      level_label: "Elementary",
      progress_percent: 0,
      lessons_completed: 16,
      lessons_total: 50,
      streak_days: 5,
      accent_color: "#f59e0b",
      accent_gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      url: "source/menu/deutsch/de.html"
    },
    {
      id: "en",
      name: "English",
      native_name: "English",
      flag: "🇬🇧",
      level: "B1",
      level_label: "Intermediate",
      progress_percent: 0,
      lessons_completed: 36,
      lessons_total: 53,
      streak_days: 12,
      accent_color: "#3b82f6",
      accent_gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      url: "source/menu/engslish/eng.html"
    },
    {
      id: "kr",
      name: "Korean",
      native_name: "한국어",
      flag: "🇰🇷",
      level: "TOPIK 2",
      level_label: "Beginner",
      progress_percent: 0,
      lessons_completed: 8,
      lessons_total: 45,
      streak_days: 3,
      accent_color: "#8b5cf6",
      accent_gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      url: "source/menu/korea/kr.html"
    }
  ],

  /* ── Recent Activity ── */
  recent_activity: [
    {
      id: 1,
      language_id: "jp",
      flag: "🇯🇵",
      title: "Japanese Lesson 12",
      subtitle: "Grammar: ～ようにする",
      time_ago: "2h ago",
      xp_gained: 120,
      icon: "book"
    },
    {
      id: 2,
      language_id: "en",
      flag: "🇬🇧",
      title: "English Vocabulary",
      subtitle: "20 new words learned",
      time_ago: "5h ago",
      xp_gained: 80,
      icon: "book"
    },
    {
      id: 3,
      language_id: "de",
      flag: "🇩🇪",
      title: "German Quiz",
      subtitle: "Daily practice completed",
      time_ago: "Yesterday",
      xp_gained: 150,
      icon: "check"
    },
    {
      id: 4,
      language_id: "kr",
      flag: "🇰🇷",
      title: "Korean Listening",
      subtitle: "Listening practice session",
      time_ago: "2 days ago",
      xp_gained: 90,
      icon: "headphones"
    }
  ],

  /* ── Quick Actions ── */
  quick_actions: [
    { id: "continue", label: "Continue Learning", description: "Pick up where you left off", icon: "play", color: "#f43f5e" },
    { id: "review", label: "Review", description: "Review your weak areas", icon: "refresh", color: "#3b82f6" },
    { id: "practice", label: "Practice", description: "Practice new skills", icon: "target", color: "#10b981" },
    { id: "vocabulary", label: "Vocabulary", description: "Learn new words", icon: "book", color: "#f59e0b" },
    { id: "progress", label: "View Full Progress", description: "See detailed statistics", icon: "chart", color: "#8b5cf6" }
  ],

  /* ── Learning Insights ── */
  insights: {
    streak_message: "You're on a great streak!",
    streak_submessage: "Keep it up! Consistency is the key to language mastery.",
    most_active_language: "English",
    most_active_language_id: "en",
    weekly_goal_progress: 75,
    next_milestone: "Level up Japanese to N3"
  },

  /* ── Weekly Activity Chart Data ── */
  weekly_activity: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      { label: "Japanese", data: [45, 30, 60, 25, 50, 40, 35], color: "#f43f5e" },
      { label: "German", data: [20, 35, 15, 40, 25, 30, 20], color: "#f59e0b" },
      { label: "English", data: [60, 50, 55, 45, 60, 55, 50], color: "#3b82f6" },
      { label: "Korean", data: [10, 15, 20, 10, 15, 20, 15], color: "#8b5cf6" }
    ]
  },

  /* ── XP History (for sparkline) ── */
  xp_history: [120, 200, 150, 280, 320, 250, 180, 350, 400, 300, 420, 380, 450, 500],

  /* ── Upgrade Banner ── */
  upgrade: {
    title: "Upgrade to Pro",
    description: "Unlock unlimited practice and more features.",
    cta: "Upgrade Now"
  },

  /* ── Sidebar Navigation ── */
  sidebar_nav: [
    { id: "dashboard", label: "Dashboard", icon: "home", active: true },
    { id: "japanese", label: "Japanese", icon: "torii", active: false, url: "source/menu/hiragana/jp.html" },
    { id: "german", label: "German", icon: "flag", active: false,   url: "source/menu/deutsch/de.html" },
    { id: "english", label: "English", icon: "flag", active: false, url: "source/menu/english/eng.html"},
    { id: "korean", label: "Korean", icon: "flag", active: false,    url: "source/menu/korea/kr.html" },
    { id: "settings", label: "Settings", icon: "settings", active: false }
  ],

  /* ── Notifications ── */
  notifications: {
    count: 3,
    items: [
      { id: 1, message: "Daily streak reminder!", time: "10m ago", read: false },
      { id: 2, message: "New Japanese lesson available", time: "2h ago", read: false },
      { id: 3, message: "You earned a new badge!", time: "1d ago", read: true }
    ]
  }
};

/* ── Helper to get language by ID ── */
function getLanguageById(id) {
  return DASHBOARD_DATA.languages.find(l => l.id === id);
}

/* ── Helper to format numbers ── */
function fmtNum(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

/* ── Helper to format compact numbers ── */
function fmtCompact(n) {
  return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

/* Export for module systems */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DASHBOARD_DATA, getLanguageById, fmtNum, fmtCompact };
}

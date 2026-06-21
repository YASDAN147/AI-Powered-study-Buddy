import { useState, useEffect } from "react";
import { StudyNote, UserStats, FlashcardDeck, StudySession, Badge, ShopItem } from "./types";
import { 
  BookOpen, Layers, Mic, HelpCircle, Award, Hourglass, 
  Settings, Flame, Sparkles, Wifi, WifiOff, RefreshCw, 
  CheckCircle, MessageSquare, BookOpenText, Home, ArrowRight, Smartphone,
  Gift, Trophy, Coins, Compass, Headphones,
  Menu, X, AlertTriangle, Download, Sun, Moon, Zap, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SubjectNotes from "./components/SubjectNotes";
import RAGBot from "./components/RAGBot";
import VoiceTutor from "./components/VoiceTutor";
import QuizFlashcards from "./components/QuizFlashcards";
import Analytics from "./components/Analytics";
import RewardsStore from "./components/RewardsStore";
import AdaptivePath from "./components/AdaptivePath";
import FocusRoom from "./components/FocusRoom";
import { playChimeSound } from "./utils/sound";
import { defaultDecks } from "./data/defaultDecks";
// @ts-ignore
import studyBuddyMascot from "./assets/images/study_buddy_mascot_1781935733079.jpg";
// @ts-ignore
import acolyteElrondImg from "./assets/images/acolyte_elrond_1782016095757.jpg";
// @ts-ignore
import acolyteVortexImg from "./assets/images/acolyte_vortex_1782017181041.jpg";
// @ts-ignore
import acolyteOrionImg from "./assets/images/acolyte_orion_1782017198803.jpg";
// @ts-ignore
import acolyteAuroraImg from "./assets/images/acolyte_aurora_1782017215771.jpg";
// @ts-ignore
import acolyteGlitchImg from "./assets/images/acolyte_glitch_1782017230773.jpg";
// @ts-ignore
import acolyteSpecterImg from "./assets/images/acolyte_specter_1782017244446.jpg";
// @ts-ignore
import acolyteSparkImg from "./assets/images/acolyte_spark_1782017259872.jpg";

// Default seed data for first-time booting
const defaultBadges: Badge[] = [
  { id: "b1", name: "RAG Explorer", description: "Query the RAG bot using segmented study cards.", icon: "Layers", unlocked: false },
  { id: "b2", name: "Perfect Assessment", description: "Construct and grade 100% on any custom AI quiz.", icon: "Award", unlocked: false },
  { id: "b3", name: "Lecture Tidier", description: "Reorganize lecture slides using the AI note formatter.", icon: "BookOpenText", unlocked: false },
  { id: "b4", name: "Consistent Streaker", description: "Reach a continuous study streak of 3 days or more.", icon: "Flame", unlocked: false },
  { id: "b5", name: "Public Orator", description: "Challenge your concepts by talking directly to the Voice Tutor.", icon: "Mic", unlocked: false },
  { id: "b6", name: "Big Spender", description: "Purchase any custom theme or mascot companion shape from the reward shop.", icon: "Coins", unlocked: false },
];

const defaultShopItems: ShopItem[] = [
  { id: "theme-immersive", name: "Immersive Neural UI", cost: 0, type: "theme", value: "theme-immersive", icon: "Paintbrush", description: "The ultimate dark neural dashboard. Beautiful glass cards, background indigo glows, cosmic aesthetics.", unlocked: true, isEquipped: true },
  { id: "theme-forest", name: "Sage Forest Theme", cost: 150, type: "theme", value: "theme-forest", icon: "Paintbrush", description: "Calm sage backdrop, leafy borders, moss green highlights. Perfect for peaceful studies.", unlocked: false, isEquipped: false },
  { id: "theme-cosmic", name: "Cosmic Study Space", cost: 250, type: "theme", value: "theme-cosmic", icon: "Paintbrush", description: "Stunning dark theme resembling deep starry atmospheres. Glowing neon borders.", unlocked: false, isEquipped: false },
  { id: "theme-synth", name: "Cyberpunk Synthwave", cost: 300, type: "theme", value: "theme-synth", icon: "Paintbrush", description: "Futuristic violet, neon magenta buttons, glowing grid lines. High-energy coding aesthetic.", unlocked: false, isEquipped: false },
  { id: "acolyte-elrond", name: "Acolyte Elrond (The Cyber-Visor Owl)", cost: 0, type: "companion", value: "acolyte-elrond", icon: "Sparkles", description: "An ultra-gorgeous mechanical wizard owl wearing high-tech luminous purple visor goggles, studying an ancient holographic tome of AI Wisdom with teal neon-lit runes.", unlocked: true, isEquipped: true, image: acolyteElrondImg },
  { id: "acolyte-vortex", name: "Acolyte Vortex (The Cyber-Holo Falcon)", cost: 0, type: "companion", value: "acolyte-vortex", icon: "Zap", description: "A spectacularly handsome chrome peregrine falcon equipped with high-speed cyan HUD laser lens arrays and neon-edged flight wings. Absolute swift focus.", unlocked: true, isEquipped: false, image: acolyteVortexImg },
  { id: "acolyte-orion", name: "Acolyte Orion (The Hypergrade Wolf)", cost: 0, type: "companion", value: "acolyte-orion", icon: "Shield", description: "A gorgeously styled robotic hunter wolf with deep electric-blue visor optics and gold plated armor plates, projecting interactive 3D tactical wireframe lecture lists.", unlocked: true, isEquipped: false, image: acolyteOrionImg },
  { id: "acolyte-aurora", name: "Acolyte Aurora (The Neon-Glass Fox)", cost: 0, type: "companion", value: "acolyte-aurora", icon: "Sparkles", description: "An incredibly beautiful stardust cyber fox dressed in sleek white-chrome, sporting shiny cyan-magenta glass shades that calculate cognitive pathways and soothe anxiety.", unlocked: true, isEquipped: false, image: acolyteAuroraImg },
  { id: "acolyte-glitch", name: "Acolyte Glitch (The Goggle-HUD Drake)", cost: 0, type: "companion", value: "acolyte-glitch", icon: "Flame", description: "A gorgeous baby sapphire robotic dragon wearing glowing amber aviation goggles, shooting out tiny joyful laser sparks whenever you progress.", unlocked: true, isEquipped: false, image: acolyteGlitchImg },
  { id: "acolyte-specter", name: "Acolyte Specter (The Core-HUD Panther)", cost: 0, type: "companion", value: "acolyte-specter", icon: "Sword", description: "A strikingly handsome matte black panther in gold cyber-chassis, wearing a crimson laser tactical eye-visor to detect program exceptions and block out all external chatter.", unlocked: true, isEquipped: false, image: acolyteSpecterImg },
  { id: "acolyte-spark", name: "Acolyte Spark (The Sub-Aqua Axolotl)", cost: 0, type: "companion", value: "acolyte-spark", icon: "Heart", description: "An adorable bioluminescent pink biotechnology axolotl in a digital liquid-filled bubble helmet, calculating vector indexing steps with floating glowing sub-aquatic digits.", unlocked: true, isEquipped: false, image: acolyteSparkImg },
];

const defaultNotes: StudyNote[] = [
  {
    id: "seed-note-1",
    title: "Introduction to Artificial Intelligence & RAG",
    subject: "Computer Science",
    content: "Artificial Intelligence represents systems simulating human thought. Traditional Large Language Models suffer from hallucinations when they lack recent, specific context. \n\nRetrieval-Augmented Generation (RAG) is an architectural framework that solves this by integrating external databases. A RAG pipeline operates in three steps: Chunking raw text into segments, Indexing those segments into vector stores, and Retrieval finding relevant segment chunks based on a prompt. This grounds the LLM response in precise documentation, avoiding hallucinations and ensuring context safety.",
    createdAt: new Date().toLocaleDateString(),
    isIndexed: true,
    chunks: [
      {
        id: "seed-note-1-chunk-1",
        noteId: "seed-note-1",
        noteTitle: "Introduction to Artificial Intelligence & RAG",
        noteSubject: "Computer Science",
        text: "Artificial Intelligence represents systems simulating human thought. Traditional Large Language Models suffer from hallucinations when they lack recent, specific context."
      },
      {
        id: "seed-note-1-chunk-2",
        noteId: "seed-note-1",
        noteTitle: "Introduction to Artificial Intelligence & RAG",
        noteSubject: "Computer Science",
        text: "Retrieval-Augmented Generation (RAG) is an architectural framework that solves this by integrating external databases. A RAG pipeline operates in three steps: Chunking raw text into segments, Indexing those segments into vector stores, and Retrieval finding relevant segment chunks based on a prompt."
      }
    ]
  },
  {
    id: "seed-note-python",
    title: "Mastering Python & Advanced Core Concepts",
    subject: "Python",
    content: "Python is a high-level, interpreted programming language known for its readability and elegant syntax. Unlike static-typed compiled environments, Python uses Dynamic Typing where names are bound to objects at runtime rather than declarations having fixed static structures.\n\nPython collections are versatile and support highly performant iteration operations. A List Comprehension provides a concise way to create lists using [expression for item in iterable if condition]. Memory performance can be highly optimized via Yield generators, which produce sequence items dynamically, avoiding full-list memory allocations.\n\nPython OOP relies heavily on classes, encapsulation, polymorphism, and inheritance structures. One advanced pattern is Multiple Inheritance, which determines hierarchy priority via Method Resolution Order (MRO) using the C3 Linearization algorithm. Decorators are wrappers that wrap around functional routines to execute pre-and-post metadata computation without changing functional scope.",
    createdAt: new Date().toLocaleDateString(),
    isIndexed: true,
    chunks: [
      {
        id: "seed-note-python-chunk-1",
        noteId: "seed-note-python",
        noteTitle: "Mastering Python & Advanced Core Concepts",
        noteSubject: "Python",
        text: "Python is a high-level, interpreted programming language known for its readability and elegant syntax. Unlike static-typed compiled environments, Python uses Dynamic Typing where names are bound to objects at runtime."
      },
      {
        id: "seed-note-python-chunk-2",
        noteId: "seed-note-python",
        noteTitle: "Mastering Python & Advanced Core Concepts",
        noteSubject: "Python",
        text: "Python collections are versatile. A List Comprehension provides a concise way to create lists using [expression for item in iterable if condition]. Memory performance is highly optimized via Yield generators, which produce sequence items dynamically without full-list allocations."
      },
      {
        id: "seed-note-python-chunk-3",
        noteId: "seed-note-python",
        noteTitle: "Mastering Python & Advanced Core Concepts",
        noteSubject: "Python",
        text: "Python OOP relies on classes, inheritance, and encapsulation. Multiple Inheritance determines hierarchy priority via Method Resolution Order (MRO). Decorators act as functional wrappers that execute pre-and-post instructions without altering the inner function."
      }
    ]
  }
];

export default function App() {
  interface RewardToast {
    id: string;
    type: 'xp' | 'coins' | 'level' | 'badge' | 'quest';
    title: string;
    message: string;
    xpGained?: number;
    coinsGained?: number;
    badgeIcon?: string;
  }

  const [activeTab, setActiveTab] = useState<"dashboard" | "notes" | "rag" | "voice" | "quizzes" | "rewards" | "analytics" | "learning" | "focus">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<RewardToast | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState("Synchronized to cloud profile: Active");
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Robust sound safety wrapper
  const playChimeChimeSafely = (type: 'badge' | 'level' | 'quest' | 'success') => {
    try {
      playChimeSound(type);
    } catch (e) {
      console.warn("Sound blocked or muted:", e);
    }
  };

  // Core persistence state
  const [notes, setNotes] = useState<StudyNote[]>(defaultNotes);
  const [decks, setDecks] = useState<FlashcardDeck[]>(defaultDecks);
  const [stats, setStats] = useState<UserStats>({
    xp: 220,
    coins: 100,
    level: 1,
    streak: 3,
    lastActiveDate: new Date().toLocaleDateString(),
    totalStudyTimeMinutes: 180,
    badges: defaultBadges,
    shopItems: defaultShopItems,
    sessionsHistory: [
      { id: "sess-1", durationMinutes: 45, type: "note_summary", date: new Date().toLocaleDateString() },
      { id: "sess-2", durationMinutes: 30, type: "rag_chat", date: new Date().toLocaleDateString() }
    ]
  });

  const xpNeededForNextLevel = stats.level * 1000;

  // Active equipped companion characteristics
  const [equippedCompanion, setEquippedCompanion] = useState<string>("acolyte-elrond");
  const [equippedTheme, setEquippedTheme] = useState<string>("theme-immersive");
  
  // Global theme base mode state: "dark" (immersive deep space) or "acolyte" (glowing cyber matrix)
  const [themeMode, setThemeMode] = useState<"dark" | "acolyte">(() => {
    const saved = localStorage.getItem("studybuddy-theme-mode");
    return (saved === "dark" || saved === "acolyte") ? saved : "acolyte";
  });

  // Apply appropriate dark classes & setup dynamic backgrounds to avoid standard plain white
  useEffect(() => {
    let bgColor = "#020617";
    let textColor = "#e2e8f0";
    
    // Always add dark class to keep layouts within high-attraction dark modes
    document.documentElement.classList.add("dark");
    
    if (themeMode === "dark") {
      switch (equippedTheme) {
        case "theme-forest": bgColor = "#050b07"; break;
        case "theme-cosmic": bgColor = "#030411"; break;
        case "theme-synth": bgColor = "#07020d"; break;
        case "theme-slate": bgColor = "#0b0d12"; break;
        case "theme-immersive":
        default: bgColor = "#010411"; break;
      }
    } else {
      // "acolyte" theme - exquisite high-attraction cyber-glow colors
      switch (equippedTheme) {
        case "theme-forest": bgColor = "#021c0b"; break;
        case "theme-cosmic": bgColor = "#0c021c"; break;
        case "theme-synth": bgColor = "#120014"; break;
        case "theme-slate": bgColor = "#090d14"; break;
        case "theme-immersive":
        default: bgColor = "#020216"; break;
      }
    }
    
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    localStorage.setItem("studybuddy-theme-mode", themeMode);
  }, [themeMode, equippedTheme]);

  const selectTabAndClose = (tab: "dashboard" | "notes" | "rag" | "voice" | "quizzes" | "rewards" | "analytics" | "learning" | "focus") => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Auto-dismiss toast notification
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // 1. Monitor Connectivity standard
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial load from storage
    const savedNotes = localStorage.getItem("study_notes");
    const savedStats = localStorage.getItem("study_stats");
    const savedDecks = localStorage.getItem("study_decks");

    if (savedNotes) {
      try { setNotes(JSON.parse(savedNotes)); } catch (e) { console.error("Error restoring notes", e); }
    }
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        
        // Safely check and merge newly added shop acolytes, cleaning up old paid companions
        if (parsed.shopItems && Array.isArray(parsed.shopItems)) {
          const filtered = parsed.shopItems.filter((m) => {
            if (m.type === "theme") return true;
            return defaultShopItems.some((d) => d.id === m.id);
          });
          
          const merged = [...filtered];
          defaultShopItems.forEach((defaultIt) => {
            const hasIt = merged.some((m) => m.id === defaultIt.id);
            if (!hasIt) {
              merged.push(defaultIt);
            } else {
              // Always align name, cost, unlocked status and description with current definitions
              const foundIdx = merged.findIndex((m) => m.id === defaultIt.id);
                if (foundIdx !== -1) {
                  merged[foundIdx].cost = defaultIt.cost;
                  merged[foundIdx].unlocked = defaultIt.unlocked;
                  merged[foundIdx].name = defaultIt.name;
                  merged[foundIdx].description = defaultIt.description;
                  merged[foundIdx].value = defaultIt.value;
                  merged[foundIdx].image = defaultIt.image;
                }
            }
          });
          parsed.shopItems = merged;
        } else {
          parsed.shopItems = defaultShopItems;
        }

        setStats(parsed);
        
        // Find equipped theme
        const equippedTh = parsed.shopItems.find((t: any) => t.type === "theme" && t.isEquipped);
        if (equippedTh) setEquippedTheme(equippedTh.value);
        
        // Find equipped companion
        const equippedCp = parsed.shopItems.find((c: any) => c.type === "companion" && c.isEquipped);
        if (equippedCp) setEquippedCompanion(equippedCp.value as any);
      } catch (e) {
        console.error("Error restoring stats", e);
      }
    }
    if (savedDecks) {
      try { setDecks(JSON.parse(savedDecks)); } catch (e) { console.error("Error restoring decks", e); }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Persist states trigger helper
  const saveState = (updatedNotes?: StudyNote[], updatedStats?: UserStats, updatedDecks?: FlashcardDeck[]) => {
    if (updatedNotes) {
      setNotes(updatedNotes);
      try {
        localStorage.setItem("study_notes", JSON.stringify(updatedNotes));
      } catch (e: any) {
        console.error("Quota exceeded saving notes:", e);
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22) {
          setStorageWarning("⚠️ Storage space full! Chrome & Safari restrict local web memory to 5MB. Some files or study content could not be saved to disk. Click Optimize below to clean up internal cluster indexes without losing notes, or save a manual backup.");
        }
      }
    }
    if (updatedStats) {
      setStats(updatedStats);
      try {
        localStorage.setItem("study_stats", JSON.stringify(updatedStats));
      } catch (e: any) {
        console.error("Quota exceeded saving stats:", e);
      }
    }
    if (updatedDecks) {
      setDecks(updatedDecks);
      try {
        localStorage.setItem("study_decks", JSON.stringify(updatedDecks));
      } catch (e: any) {
        console.error("Quota exceeded saving decks:", e);
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22) {
          setStorageWarning("⚠️ Storage space full! Chrome & Safari restrict local web memory to 5MB. Some card decks could not be saved to disk. Click Optimize below to free up space.");
        }
      }
    }
  };

  // High-yield optimization function to free up space when quota is exceeded
  const handleOptimizeStorage = () => {
    try {
      // Keep only up to the first 2 chunks of older notes to sharply reduce duplicate text weights
      const optimizedNotes = notes.map((note, idx) => {
        if (idx < 2) return note; // Keep most recent 2 notes completely intact
        return {
          ...note,
          chunks: note.chunks.slice(0, 2) // keep only first 2 chunks to minimize duplicate sizes
        };
      });
      setNotes(optimizedNotes);
      localStorage.setItem("study_notes", JSON.stringify(optimizedNotes));
      setStorageWarning(null);
      // Give them feedback
      setToastNotification({
        id: `storage-opt-${Date.now()}`,
        type: "quest" as any,
        title: "Database Compacted",
        message: "Successfully pruned old search-mapping segments. Notes kept intact!",
        xpGained: 15,
        coinsGained: 10
      });
    } catch (e) {
      console.error("Failed to compact notes database", e);
      setStorageWarning("⚠️ Even optimization couldn't save memory. Please manually delete entire textbook studies or notes to free up space.");
    }
  };

  // Download a manual backup so they don't lose any data
  const handleDownloadBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ notes, decks, stats }));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `studybuddy_vault_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    } catch (e) {
      console.error("Failed to generate manual data backup download", e);
    }
  };

  // Add a note or a batch of notes
  const handleAddNote = (newNote: StudyNote | StudyNote[]) => {
    const updated = Array.isArray(newNote)
      ? [...newNote, ...notes]
      : [newNote, ...notes];
    saveState(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveState(updated);
  };

  const handleAddDeck = (deck: FlashcardDeck) => {
    const exists = decks.some((d) => d.id === deck.id);
    const updated = exists 
      ? decks.map((d) => d.id === deck.id ? deck : d)
      : [deck, ...decks];
    saveState(undefined, undefined, updated);
  };

  // Add XP / Coins and level up if needed
  const handleEarnReward = (xpGained: number, coinsGained: number, isPerfectQuiz?: boolean) => {
    const copy = { ...stats };
    copy.xp += xpGained;
    copy.coins += coinsGained;
    copy.totalStudyTimeMinutes += Math.round(xpGained / 2); // study time correlate

    let leveledUp = false;
    // Dynamic level up checking
    const limit = copy.level * 1000;
    if (copy.xp >= limit) {
      copy.level += 1;
      copy.coins += 200; // level up coin prize!
      leveledUp = true;
    }

    // Dynamic Badge locking checking
    let badgeUnlockedName = "";

    // 1. Perfect Assessment Badge (b2)
    if (isPerfectQuiz) {
      const bIndex = copy.badges.findIndex(b => b.id === "b2");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
        badgeUnlockedName = copy.badges[bIndex].name;
      }
    }

    // 2. Note formatting checks (b3)
    if (notes.length >= 2 || (xpGained === 50 && coinsGained === 20)) {
      const bIndex = copy.badges.findIndex(b => b.id === "b3");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
        badgeUnlockedName = copy.badges[bIndex].name;
      }
    }

    // 3. Streak checking (b4)
    if (copy.streak >= 3) {
      const bIndex = copy.badges.findIndex(b => b.id === "b4");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
        badgeUnlockedName = copy.badges[bIndex].name;
      }
    }

    // 4. RAG Chat interaction (b1)
    if (xpGained === 20 && coinsGained === 8) {
      const bIndex = copy.badges.findIndex(b => b.id === "b1");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
        badgeUnlockedName = copy.badges[bIndex].name;
      }
    }

    // 5. Speech Classroom voice dialogue (b5)
    if (xpGained === 15 && coinsGained === 6) {
      const bIndex = copy.badges.findIndex(b => b.id === "b5");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
        badgeUnlockedName = copy.badges[bIndex].name;
      }
    }

    // Set interactive visual toast notifications
    if (leveledUp) {
      playChimeChimeSafely("level");
      setToastNotification({
        id: `level-${Date.now()}`,
        type: 'level',
        title: "🌟 LEVEL UP! 🌟",
        message: `Phenomenal progress! You reached Level ${copy.level}! +200 Coin level bonus awarded.`,
        xpGained: xpGained,
        coinsGained: coinsGained + 200
      });
    } else if (badgeUnlockedName) {
      playChimeChimeSafely("badge");
      setToastNotification({
        id: `badge-${Date.now()}`,
        type: 'badge',
        title: "🏅 BADGE UNLOCKED! 🏅",
        message: `Astonishing scholarship! You earned the "${badgeUnlockedName}" badge!`,
        xpGained: xpGained,
        coinsGained: coinsGained
      });
    } else if (xpGained > 0 || coinsGained > 0) {
      playChimeChimeSafely("success");
      setToastNotification({
        id: `reward-${Date.now()}`,
        type: 'xp',
        title: "Rewards Dispatched!",
        message: `Gained +${xpGained} XP and +${coinsGained} Study Coins.`,
        xpGained: xpGained,
        coinsGained: coinsGained
      });
    }

    // Create session history
    const sessionType: StudySession['type'] = 
      (xpGained === 50 && coinsGained === 20) ? "note_summary" :
      (xpGained === 20 && coinsGained === 8) ? "rag_chat" :
      (xpGained === 15 && coinsGained === 6) ? "voice_tutor" : "quiz";

    const newSessionUnit: StudySession = {
      id: `sess-${Date.now()}`,
      durationMinutes: Math.round(xpGained / 2) || 5,
      type: sessionType,
      date: new Date().toLocaleDateString()
    };
    copy.sessionsHistory = [newSessionUnit, ...copy.sessionsHistory].slice(0, 15); // cap at 15 items

    saveState(undefined, copy);
  };

  // Quest Claim management
  const handleClaimQuest = (questId: string, xpReward: number, coinsReward: number) => {
    const copy = { ...stats };
    const currentClaims = copy.claimedQuests || [];
    if (currentClaims.includes(questId)) return;

    copy.claimedQuests = [...currentClaims, questId];
    copy.xp += xpReward;
    copy.coins += coinsReward;

    let leveledUp = false;
    const limit = copy.level * 1000;
    if (copy.xp >= limit) {
      copy.level += 1;
      copy.coins += 200; // Level up coin prize!
      leveledUp = true;
    }

    if (leveledUp) {
      playChimeChimeSafely("level");
      setToastNotification({
        id: `level-${Date.now()}`,
        type: 'level',
        title: "🌟 SCHOLAR LEVEL UP! 🌟",
        message: `Fantastic! Gained Quest Reward. You ascended to Level ${copy.level}! +200 Coin bonus applied.`,
        xpGained: xpReward,
        coinsGained: coinsReward + 200
      });
    } else {
      playChimeChimeSafely("quest");
      setToastNotification({
        id: `quest-${Date.now()}`,
        type: 'quest',
        title: "🏆 QUEST COMPLETED! 🏆",
        message: `You claimed quest rewards! Added +${xpReward} XP and +${coinsReward} Study Coins to your wallet.`,
        xpGained: xpReward,
        coinsGained: coinsReward
      });
    }

    saveState(undefined, copy);
  };

  // Unlock Shop item
  const handleUnlockShopItem = (id: string, cost: number) => {
    const copy = { ...stats };
    copy.coins -= cost;
    const itemIndex = copy.shopItems.findIndex((it) => it.id === id);
    if (itemIndex !== -1) {
      copy.shopItems[itemIndex].unlocked = true;
      
      // Unlock badge b6 (Big spender)
      const bIndex = copy.badges.findIndex((b) => b.id === "b6");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
      }
    }
    saveState(undefined, copy);
  };

  // Equiping customizable aesthetic parameters
  const handleEquipShopItem = (id: string) => {
    const copy = { ...stats };
    const targetItem = copy.shopItems.find(it => it.id === id);
    if (!targetItem) return;

    // reset same types
    copy.shopItems.forEach((it) => {
      if (it.type === targetItem.type) {
        it.isEquipped = false;
      }
    });

    // set equip
    const itemIdx = copy.shopItems.findIndex((it) => it.id === id);
    if (itemIdx !== -1) {
      copy.shopItems[itemIdx].isEquipped = true;
      if (targetItem.type === "theme") {
        setEquippedTheme(targetItem.value);
      } else if (targetItem.type === "companion") {
        setEquippedCompanion(targetItem.value as any);
      }
    }

    saveState(undefined, copy);
  };

  // Simulated backup server sync action
  const handleSynchronizeCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedText(`Device synced securely at: ${new Date().toLocaleTimeString()}`);
      
      // Earn a small consistency synchronization reward!
      handleEarnReward(10, 5);
      
      // Unlock Badge b1 for synced actions and explorations!
      const copy = { ...stats };
      const bIndex = copy.badges.findIndex((b) => b.id === "b1");
      if (bIndex !== -1 && !copy.badges[bIndex].unlocked) {
        copy.badges[bIndex].unlocked = true;
        copy.badges[bIndex].unlockedAt = new Date().toLocaleDateString();
        saveState(undefined, copy);
      }
    }, 2000);
  };

  // UI Theme Styling parser
  const getThemeCSS = () => {
    const isDark = themeMode === "dark";
    
    switch (equippedTheme) {
      case "theme-forest":
        return isDark ? {
          bg: "bg-gradient-to-br from-[#0c1510] via-[#09100c] to-[#040806] text-[#e3f0e8] tech-grid",
          card: "bg-[#121f18]/60 border border-[#1d3327] hover:border-[#2f523f] shadow-lg backdrop-blur-md text-left transition-all",
          text: "text-[#cbdcd0] dark:text-[#cbdcd0]",
          headerText: "text-white font-extrabold tracking-normal text-glow",
          sidebar: "bg-[#0e1712]/90 border-r border-[#17281e] tech-grid",
          accentBtn: "bg-[#10b981] text-white hover:bg-[#15bd85] shadow-lg shadow-emerald-950/40",
          navSelect: "bg-[#163324]/80 border-[#2f523f] text-[#a7f3d0]"
        } : {
          bg: "bg-gradient-to-tr from-[#021c0b] via-[#052912] to-[#043d1a] text-[#86efac] tech-grid",
          card: "bg-[#042611]/85 border-2 border-[#10b981]/50 hover:border-[#4ade80] shadow-[0_0_20px_rgba(16,185,129,0.25)] text-left transition-all duration-300 backdrop-blur-md",
          text: "text-emerald-200 dark:text-emerald-200",
          headerText: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 via-green-300 to-teal-400 font-extrabold tracking-widest text-glow uppercase",
          sidebar: "bg-[#021608]/90 border-r-2 border-[#10b981]/40 tech-grid",
          accentBtn: "bg-[#059669] hover:bg-[#10b981] text-white shadow-lg shadow-emerald-500/30 font-bold",
          navSelect: "bg-emerald-950/80 border-2 border-[#10b981] text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        };

      case "theme-cosmic":
        return isDark ? {
          bg: "bg-gradient-to-b from-[#030712] via-[#090d1f] to-[#02050c] text-neutral-100 tech-grid",
          card: "bg-slate-950/40 border border-indigo-950/80 hover:border-indigo-900/50 backdrop-blur-md text-left transition-all",
          text: "text-neutral-200 dark:text-neutral-200",
          headerText: "text-white font-extrabold tracking-normal text-glow",
          sidebar: "bg-slate-950/60 border-r border-[#0d0f2b] tech-grid",
          accentBtn: "bg-blue-600 hover:bg-blue-700 text-white",
          navSelect: "bg-blue-900/40 border-blue-800 text-blue-300"
        } : {
          bg: "bg-gradient-to-tr from-[#0c021c] via-[#140533] to-[#1f0a52] text-[#d8b4fe] tech-grid",
          card: "bg-[#14072b]/85 border-2 border-[#a855f7]/50 hover:border-[#c084fc] shadow-[0_0_20px_rgba(168,85,247,0.25)] text-left transition-all duration-300 backdrop-blur-md",
          text: "text-purple-200 dark:text-purple-200",
          headerText: "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-400 font-extrabold tracking-widest text-glow uppercase",
          sidebar: "bg-[#080214]/90 border-r-2 border-[#a855f7]/40 tech-grid",
          accentBtn: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30 font-bold",
          navSelect: "bg-purple-950/80 border-2 border-[#a855f7] text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
        };

      case "theme-synth":
        return isDark ? {
          bg: "bg-[#0c0512] text-neutral-100 font-mono tech-grid",
          card: "bg-[#180b2a]/90 border border-fuchsia-900/60 shadow-[0_0_15px_rgba(240,46,170,0.05)] text-left transition-all",
          text: "text-fuchsia-200 dark:text-fuchsia-200",
          headerText: "text-fuchsia-100 font-mono tracking-widest uppercase text-glow",
          sidebar: "bg-[#120520] border-r border-fuchsia-950/60 tech-grid",
          accentBtn: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg shadow-fuchsia-950/40",
          navSelect: "bg-fuchsia-950/60 border-fuchsia-900 text-fuchsia-300"
        } : {
          bg: "bg-gradient-to-tr from-[#120014] via-[#24002b] to-[#3b0042] text-[#f472b6] font-mono tech-grid",
          card: "bg-[#2b0132]/85 border-2 border-[#ec4899]/50 hover:border-[#f472b6] shadow-[0_0_20px_rgba(236,72,153,0.25)] text-left transition-all duration-300 backdrop-blur-md",
          text: "text-[#ec4899] font-semibold",
          headerText: "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-[#ec4899] font-extrabold tracking-widest text-glow uppercase",
          sidebar: "bg-[#0e0010]/90 border-r-2 border-pink-500/40 tech-grid",
          accentBtn: "bg-pink-650 hover:bg-pink-550 text-white shadow-lg shadow-pink-500/30 font-bold",
          navSelect: "bg-[#2b0132] border-[#ec4899] text-pink-300 font-bold"
        };

      case "theme-slate":
        return isDark ? {
          bg: "bg-[#0f1115] text-neutral-200 tech-grid",
          card: "bg-[#161920]/95 border border-[#242936] hover:border-[#353c4f] shadow-lg text-left transition-all",
          text: "text-neutral-300 dark:text-neutral-300",
          headerText: "text-white font-bold",
          sidebar: "bg-[#0f1115]/90 border-r border-[#212632] tech-grid",
          accentBtn: "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-950/40",
          navSelect: "bg-indigo-950/70 border-indigo-900 text-indigo-300"
        } : {
          bg: "bg-gradient-to-tr from-[#090d14] via-[#0f1929] to-[#1a2d48] text-[#93c5fd] tech-grid",
          card: "bg-[#0f1a2e]/85 border-2 border-[#3b82f6]/50 hover:border-[#60a5fa] shadow-[0_0_20px_rgba(59,130,246,0.25)] text-left transition-all duration-300 backdrop-blur-md",
          text: "text-blue-200 dark:text-blue-200",
          headerText: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-[#38bdf8] font-extrabold tracking-widest text-glow uppercase",
          sidebar: "bg-[#060a0f]/90 border-r-2 border-[#3b82f6]/40 tech-grid",
          accentBtn: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 font-bold",
          navSelect: "bg-blue-950/80 border-2 border-[#3b82f6] text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        };

      case "theme-immersive":
      default:
        return isDark ? {
          bg: "bg-[#020617] text-slate-200 font-sans relative overflow-hidden tech-grid",
          card: "glass rounded-2xl p-6 shadow-2xl border border-white/8 text-left transition-all duration-300 hover:shadow-indigo-500/15 hover:border-indigo-500/20",
          text: "text-slate-300 dark:text-slate-300",
          headerText: "text-white text-glow font-bold",
          sidebar: "glass border-r border-white/5 backdrop-blur-xl tech-grid",
          accentBtn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all font-semibold",
          navSelect: "glass bg-indigo-500/15 border-l-4 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
        } : {
          bg: "bg-gradient-to-tr from-[#020216] via-[#08082b] to-[#12083c] text-white tech-grid",
          card: "bg-[#0a0724]/85 border-2 border-indigo-550/65 hover:border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.35)] text-left transition-all duration-300 backdrop-blur-md",
          text: "text-indigo-200 dark:text-indigo-200",
          headerText: "text-transparent bg-clip-text bg-gradient-to-r from-rose-450 via-indigo-400 to-teal-400 font-extrabold tracking-widest text-glow uppercase",
          sidebar: "bg-[#01010f]/95 border-r-2 border-indigo-500/40 backdrop-blur-md tech-grid",
          accentBtn: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 font-semibold",
          navSelect: "bg-[#030310] border-2 border-indigo-400 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.35)]"
        };
    }
  };

  const theme = getThemeCSS();

  // Companion dialog engine depending on level, notes count or streak
  const getCompanionDialogue = () => {
    switch (equippedCompanion) {
      case "acolyte-elrond":
        return `Acolyte Elrond is watching with wise silver eyes. 🦉 I have calibrated my starlight visor to match your current research vectors. Let us study the depths of AI Wisdom together on Day ${stats.streak}!`;
      case "acolyte-vortex":
        return `Engaging supersonic study drive! 🦅 My cyan HUD lenses are locked onto our targets. Let's strike down these topics with unmatched speed!`;
      case "acolyte-orion":
        return `Under my neon blue scanners, your study pathway is completely blue-mapped! 🐺 Maintain absolute pack focus, and let's clear these recall milestones.`;
      case "acolyte-aurora":
        return `Cool nebula magic active! 🦊 Connecting to your brain's retrieval-augmented node channels. Breathe softly, and let's enjoy a beautiful flow state.`;
      case "acolyte-glitch":
        return `Acolyte Glitch is fully charged! 🐉 *Excited wing flaps and tiny fire sparks* Let's smash our tasks! I have shiny rewards waiting for us at target completion!`;
      case "acolyte-specter":
        return `Target locked, distraction eliminated. 🐈‍⬛ My red tactical laser visor isolates your current study unit. Zero noise, absolute silent discipline.`;
      case "acolyte-spark":
        return `Bubble metrics fully saturated! 🦎 Generating optimal retrieval streams. Let's index this core documentation smoothly without stress!`;
      case "wise-owl":
        return `Greeting, scholar. At Day ${stats.streak} of your learning streak, the mind scales new peaks of wisdom. Let's practice active recall!`;
      case "zen-cat":
        return `Meow... 🐱 *Purrs peacefully* My desk is ready with ${notes.length} lessons segment. Your Level ${stats.level} mind is incredibly focused. Let's do a RAG question!`;
      case "chibi-dragon":
        return `Fire-ready! 🔥 I am tiny but my support is huge! Let's conquer the Level ${stats.level} challenge deck, we earned ${stats.coins} study gems!`;
      case "robo-buddy":
      default:
        return `Hello student! Core VM online. All ${notes.length} notes fully segmented and ready for real-time Retrieval-Augmented tutoring. Select a hub below!`;
    }
  };

  const getCompanionEmoji = () => {
    switch (equippedCompanion) {
      case "acolyte-elrond": return "🦉";
      case "acolyte-vortex": return "🦅";
      case "acolyte-orion": return "🐺";
      case "acolyte-aurora": return "🦊";
      case "acolyte-glitch": return "🐉";
      case "acolyte-specter": return "🐈‍⬛";
      case "acolyte-spark": return "🦎";
      case "wise-owl": return "🦉";
      case "zen-cat": return "🐱";
      case "chibi-dragon": return "🐲";
      case "robo-buddy":
      default:
        return "🤖";
    }
  };

  const companionDialogue = getCompanionDialogue();
  const companionEmoji = getCompanionEmoji();

  const activeCompanionObj = stats.shopItems.find(it => it.type === "companion" && it.isEquipped) || {
    id: "robo-buddy",
    name: "Classic Robo-Buddy",
    value: "robo-buddy",
    description: "Default standard multi-modal AI Study Partner.",
    cost: 0,
    type: "companion",
    icon: "User",
    unlocked: true,
    isEquipped: true
  };

  const getQuests = () => {
    const b2Unlocked = stats.badges.find(b => b.id === "b2")?.unlocked || false;
    const b1Unlocked = stats.badges.find(b => b.id === "b1")?.unlocked || false;
    const b5Unlocked = stats.badges.find(b => b.id === "b5")?.unlocked || false;
    const claimed = stats.claimedQuests || [];

    return [
      {
        id: "q-notes",
        name: "Lecture Architect",
        description: "Assemble at least 2 distinct Lesson study decks.",
        requiredValue: 2,
        currentValue: notes.length,
        xpReward: 100,
        coinsReward: 50,
        icon: "BookOpen"
      },
      {
        id: "q-quiz",
        name: "Flawless Scoreboard",
        description: "Earn 100% on any custom AI assessment quiz.",
        requiredValue: 1,
        currentValue: b2Unlocked ? 1 : 0,
        xpReward: 150,
        coinsReward: 100,
        icon: "Award"
      },
      {
        id: "q-streak",
        name: "Consistent Learner",
        description: "Maintain an active streak of 3 consecutive study days.",
        requiredValue: 3,
        currentValue: stats.streak,
        xpReward: 120,
        coinsReward: 60,
        icon: "Flame"
      },
      {
        id: "q-rag",
        name: "RAG Navigator",
        description: "Formulate a custom RAG search and index query.",
        requiredValue: 1,
        currentValue: b1Unlocked ? 1 : 0,
        xpReward: 80,
        coinsReward: 40,
        icon: "Layers"
      },
      {
        id: "q-vocal",
        name: "Speech Master",
        description: "Engage the Speech Classroom voice companion.",
        requiredValue: 1,
        currentValue: b5Unlocked ? 1 : 0,
        xpReward: 110,
        coinsReward: 50,
        icon: "Mic"
      }
    ];
  };

  const getQuestIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen": return <BookOpen className="w-5 h-5 text-indigo-400" />;
      case "Award": return <Award className="w-5 h-5 text-purple-400" />;
      case "Flame": return <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20 animate-pulse" />;
      case "Layers": return <Layers className="w-5 h-5 text-teal-400" />;
      case "Mic": return <Mic className="w-5 h-5 text-pink-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div id="application-container" className={`min-h-screen ${theme.bg} flex flex-col md:flex-row transition-all duration-500 relative`}>
      {/* Starry background glow effect */}
      <div className="absolute inset-0 bg-glow pointer-events-none z-0"></div>

      {/* 📱 Mobile Sticky Top-Banner Header for easy feature toggles and visible screen navigation */}
      <header className={`flex md:hidden items-center justify-between w-full px-5 py-4 ${
        themeMode === "dark" 
          ? "bg-slate-950/90 border-b border-white/5" 
          : "bg-indigo-950/70 border-b border-indigo-500/20"
      } sticky top-0 z-40 select-none shadow-sm shrink-0 backdrop-blur-md`}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-500 text-white shadow-md shadow-indigo-500/20 group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-teal-500 rounded-lg blur opacity-30 group-hover:opacity-65 transition duration-300" />
          </div>
          <span className="text-xs font-black tracking-[0.12em] uppercase text-white text-glow">AI-powered study buddy</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border flex items-center gap-1 ${
            themeMode === "dark" ? "bg-slate-950 border-white/5 text-zinc-400" : "bg-indigo-950/80 border-indigo-550/20 text-indigo-300"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <button
            onClick={() => setThemeMode(themeMode === "dark" ? "acolyte" : "dark")}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center active:scale-95 ${
              themeMode === "dark" 
                ? "bg-slate-900 border-white/10 text-neutral-400 hover:text-white" 
                : "bg-indigo-950/80 border-indigo-500/30 text-amber-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse"
            }`}
            title={themeMode === "dark" ? "Activate Acolyte Cyber Overdrive" : "Activate Deep Void Mode"}
          >
            {themeMode === "dark" ? <Sparkles className="w-4 h-4 text-indigo-400" /> : <Zap className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 active:scale-95 text-indigo-400 hover:text-indigo-300 rounded-xl transition-all border border-indigo-500/15 flex items-center justify-center"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 1. Global Navigation Sidebar */}
      <div id="side-nav" className={`w-full md:w-64 ${theme.sidebar} p-5 select-none shrink-0 ${isMobileMenuOpen ? 'flex flex-col gap-6' : 'hidden md:flex md:flex-col md:justify-between'}`}>
        <div className="flex flex-col gap-6">
          {/* Main App branding and connection status */}
          <div className="text-left">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-black tracking-widest flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-500 text-white shadow-md shadow-indigo-500/20 group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
                  <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                  {/* Glowing glow ring overlay */}
                  <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-65 transition duration-300" />
                </div>
                <span className={`${theme.headerText} tracking-[0.12em] text-xs uppercase`}>AI-powered study buddy</span>
              </h1>
              
              <button
                onClick={() => setThemeMode(themeMode === "dark" ? "acolyte" : "dark")}
                className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center active:scale-95 ${
                  themeMode === "dark"
                    ? "bg-white/5 hover:bg-white/10 text-indigo-400 border-white/5 hover:border-white/10"
                    : "bg-indigo-950/85 hover:bg-indigo-900/80 text-amber-400 border-indigo-500/30 shadow-[0_0_12px_rgba(236,72,153,0.25)] border-2"
                }`}
                title={themeMode === "dark" ? "Activate Acolyte Cyber Overdrive" : "Activate Deep Void Mode"}
              >
                {themeMode === "dark" ? <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
            
            {/* Status bars indicators */}
            <div className="flex items-center gap-2 mt-3.5">
              <div className="flex items-center gap-1.5 bg-neutral-100/50 dark:bg-neutral-900/60 py-1 px-2.5 rounded-full text-[9px] font-bold">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="text-neutral-500 truncate">Sync: Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-rose-500 shrink-0 animation-pulse" />
                    <span className="text-rose-500">Offline Review Mode</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800" />

          {/* Navigation Items list */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => selectTabAndClose("dashboard")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "dashboard" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Workspace Hub</span>
            </button>

            <button
              onClick={() => selectTabAndClose("learning")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "learning" ? theme.navSelect : "text-[#818cf8] dark:text-[#a5b4fc] bg-indigo-500/10 hover:bg-indigo-550/20 border border-indigo-500/20"
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="font-extrabold">Learning Plans</span>
            </button>

            <button
              onClick={() => selectTabAndClose("notes")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "notes" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lesson Decks</span>
            </button>

            <button
              onClick={() => selectTabAndClose("rag")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "rag" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>RAG Tutoring Hub</span>
            </button>

            <button
              onClick={() => selectTabAndClose("voice")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "voice" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Speech Classroom</span>
            </button>

            <button
              onClick={() => selectTabAndClose("quizzes")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "quizzes" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quiz & Flashcards</span>
            </button>

            <button
              onClick={() => selectTabAndClose("rewards")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "rewards" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Aesthetics & Shop</span>
            </button>

            <button
              onClick={() => selectTabAndClose("analytics")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "analytics" ? theme.navSelect : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
              }`}
            >
              <Hourglass className="w-4 h-4" />
              <span>Cognitive Analytics</span>
            </button>

            <button
              onClick={() => selectTabAndClose("focus")}
              className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold text-left transition ${
                activeTab === "focus" 
                  ? theme.navSelect 
                  : "text-rose-500 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20"
              }`}
            >
              <Headphones className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="font-extrabold text-glow text-rose-500 dark:text-rose-400">Deep Focus Sanctuary</span>
            </button>
          </nav>
        </div>

        {/* Mascot Widget */}
        <div className="p-3.5 bg-gradient-to-br from-rose-500/10 via-indigo-650/15 to-teal-500/10 border border-indigo-400/25 rounded-2xl text-left hidden md:flex items-center gap-3 relative shadow-indigo-950/20 shadow-md overflow-hidden group">
          {/* Vibrant colorful gradient aura underlying */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-rose-500/25 via-indigo-500/25 to-teal-500/25 rounded-full blur opacity-45 group-hover:opacity-75 transition duration-300" />
          
          <div className="relative z-10 shrink-0">
            <div className="w-11 h-11 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-2xl shadow-md overflow-hidden group-hover:scale-105 transition duration-300">
              {activeCompanionObj.image ? (
                <img 
                  src={activeCompanionObj.image} 
                  alt={activeCompanionObj.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                companionEmoji
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 z-10">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#a5b4fc] block">AI Profile Companion</span>
            <span className="text-xs font-black text-white block truncate" title={activeCompanionObj.name}>
              {activeCompanionObj.name.split(" (")?.[0]}
            </span>
            <span className="text-[9px] text-emerald-400 font-extrabold block animate-pulse">Core Synchronized</span>
          </div>
          <div className="absolute top-1.5 right-1.5 z-10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          </div>
        </div>

        {/* Sync panel button footer */}
        <div className="bg-neutral-50/50 dark:bg-neutral-900/40 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-left">
          <span className="text-[9px] uppercase font-bold text-neutral-400 block mb-1">Backup Vault</span>
          <p className="text-[10px] text-neutral-400 leading-snug truncate mb-2">{lastSyncedText}</p>
          <button
            onClick={handleSynchronizeCloud}
            disabled={isSyncing}
            className="w-full bg-white dark:bg-neutral-900 hover:bg-indigo-50 border border-neutral-100 dark:border-neutral-800 py-1.5 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 text-neutral-600 dark:text-neutral-300 transition"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                <span>Encrypting & Backup...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                <span>Cloud Synced Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Content Frame Viewport */}
      <main id="main-frame" className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-x-hidden md:max-h-screen md:overflow-y-auto">
        
        {/* Storage limit alert banner for seamless error recovery if browser memory is full */}
        {storageWarning && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-rose-950/20 z-20">
            <div className="space-y-1 max-w-3xl">
              <h4 className="text-xs font-black uppercase text-rose-400 tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Local Storage Quota Alert
              </h4>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {storageWarning}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:self-center">
              <button
                onClick={handleOptimizeStorage}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl transition duration-200 shadow-lg shadow-emerald-950/30 active:scale-95 flex items-center gap-1"
                title="Prune old search indexes to free up disk space while keeping all notes intact"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Optimize Storage
              </button>
              <button
                onClick={handleDownloadBackup}
                className="bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-100 font-bold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl transition duration-200 active:scale-95 flex items-center gap-1"
                title="Download your full notes database as a JSON backup file to your device"
              >
                <Download className="w-3.5 h-3.5" /> Save Backup
              </button>
              <button
                onClick={() => setStorageWarning(null)}
                className="p-2 text-rose-300 hover:text-white hover:bg-rose-500/10 rounded-xl transition"
                title="Dismiss warning"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
          <div id="welcome-dashboard" className="flex flex-col gap-6">
            
             {/* Top row status card - Equipped Partner with Mascot Illustration */}
             <div className={`p-6 rounded-3xl ${theme.card} flex flex-col md:flex-row items-center gap-6 relative text-left shadow-lg overflow-hidden group`}>
               {/* Dynamic colorful gradient aura underlying */}
               <div className="absolute -inset-10 bg-gradient-to-tr from-rose-500/25 via-indigo-500/25 to-teal-500/25 rounded-full blur opacity-45 group-hover:opacity-65 transition duration-300" />
               
               {/* Beautiful Acolyte Profile Avatar Orbit */}
               <div className="relative shrink-0 select-none z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                 <div className="absolute -inset-2 bg-gradient-to-tr from-purple-500 via-rose-500 to-indigo-500 rounded-full blur opacity-75 animate-pulse" />
                 <div className="relative w-20 h-20 rounded-full border border-white/10 bg-slate-950 overflow-hidden flex items-center justify-center shadow-2xl">
                   {activeCompanionObj.image ? (
                     <img 
                       src={activeCompanionObj.image} 
                       alt={activeCompanionObj.name} 
                       className="w-full h-full object-cover" 
                       referrerPolicy="no-referrer" 
                     />
                   ) : (
                     <span className="text-4xl">{companionEmoji}</span>
                   )}
                 </div>
                 <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center shadow-lg z-20" title="Acolyte Core Synchronized">
                   <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                 </span>
               </div>
               
               {/* Scholar Profile details & Acolyte quote */}
               <div className="flex-1 space-y-2 z-10">
                 <div className="flex flex-wrap items-center gap-2">
                   <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                     <Sparkles className="w-3" /> Scholar Profile Frame
                   </span>
                   <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                     Active Partner: {activeCompanionObj.name}
                   </span>
                 </div>
                 
                 <div className="space-y-0.5">
                   <h3 className="text-base font-black text-white leading-none flex items-center gap-2">
                     Active Scholar
                     <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/10">
                       Level {stats.level} Scholar
                     </span>
                   </h3>
                   <p className="text-xs text-slate-400 font-medium font-sans">
                     Guided by {activeCompanionObj.name?.split(" (")?.[0]}
                   </p>
                 </div>

                 {/* Dialogue text box */}
                 <div className="bg-[#0b0521]/60 border border-white/5 p-3 rounded-2xl">
                   <p className="text-xs font-semibold leading-relaxed text-slate-200">
                     "{companionDialogue}"
                   </p>
                 </div>
               </div>
               
               {/* Day streak card top-right */}
               <div className="absolute right-4 top-4 flex items-center bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full gap-1 z-10">
                 <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {stats.streak} DAY STREAK
               </div>
             </div>

            {/* Quick stats and workspace launcher rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Level progress indicator panel */}
              <div className={`col-span-1 p-5 rounded-3xl ${theme.card} text-left flex flex-col justify-between shadow-sm`}>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                  <Award className="text-indigo-500 w-4 h-4" /> Scholar Rank
                </h3>
                <div className="py-2">
                  <span className="text-xs text-neutral-400">Level {stats.level} Master</span>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-500" 
                      style={{ width: `${Math.min((stats.xp % xpNeededForNextLevel) / xpNeededForNextLevel * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 block mt-1.5">{stats.xp % xpNeededForNextLevel} / {xpNeededForNextLevel} XP to Level {stats.level + 1}</span>
                </div>
                
                <button
                  onClick={() => setActiveTab("rewards")}
                  className="w-full text-center bg-indigo-50/50 hover:bg-indigo-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 p-2 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 rounded-xl transition flex items-center justify-center gap-1 mt-4"
                >
                  Configure Mascot Shop <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* RAG Knowledge base stat panel */}
              <div className={`col-span-1 p-5 rounded-3xl ${theme.card} text-left flex flex-col justify-between shadow-sm`}>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                  <Layers className="text-teal-500 w-4 h-4" /> RAG Knowledge Base
                </h3>
                <div className="py-2">
                  <span className="text-xs text-neutral-400 font-semibold">{notes.reduce((acc,n) => acc + n.chunks.length, 0)} semantic vectors linked</span>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-1.5">Your study notes are pre-processed into discrete RAG chunks for pinpoint accuracy when searching or answering.</p>
                </div>

                <button
                  onClick={() => setActiveTab("rag")}
                  className="w-full text-center bg-teal-50/50 hover:bg-teal-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 p-2 text-[10px] font-extrabold text-teal-600 dark:text-teal-400 rounded-xl transition flex items-center justify-center gap-1 mt-4"
                >
                  Initiate RAG Search <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quiz and assessment panel */}
              <div className={`col-span-1 p-5 rounded-3xl ${theme.card} text-left flex flex-col justify-between shadow-sm`}>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                  <HelpCircle className="text-purple-500 w-4 h-4" /> Assessment Center
                </h3>
                <div className="py-2">
                  <span className="text-xs text-neutral-400 font-semibold">Adaptive flashcards and mock tests</span>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-1.5">Compose challenging custom MCQ quizzes or review active recall flip decks dynamically synthesized from study slides.</p>
                </div>

                <button
                  onClick={() => setActiveTab("quizzes")}
                  className="w-full text-center bg-purple-50/50 hover:bg-purple-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 p-2 text-[10px] font-extrabold text-purple-600 dark:text-purple-400 rounded-xl transition flex items-center justify-center gap-1 mt-4"
                >
                  Generate Practise Test <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Active Scholarship Quests */}
            <div className={`p-6 rounded-3xl ${theme.card} text-left flex flex-col gap-5 shadow-sm`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white text-glow flex items-center gap-1.5">
                    <Trophy className="text-indigo-400 w-5 h-5 animate-pulse" /> Active Academic Quests
                  </h3>
                  <p className="text-xs text-slate-400">
                    Challenge intellectual milestones to claim virtual rewards and level up your scholar title!
                  </p>
                </div>
                <div className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold px-3 py-1.5 rounded-xl self-start md:self-auto uppercase tracking-wide">
                  Claimed: {(stats.claimedQuests || []).length} / 5 Quests
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getQuests().map((q) => {
                  const claimed = (stats.claimedQuests || []).includes(q.id);
                  const met = q.currentValue >= q.requiredValue;
                  const progressPct = Math.min(Math.round((q.currentValue / q.requiredValue) * 100), 100);

                  return (
                    <div 
                      key={q.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 transition-all duration-300 ${
                        claimed 
                          ? "bg-slate-900/10 border-white/5 opacity-60" 
                          : met 
                            ? "bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)] text-white" 
                            : "bg-white/5 border-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 bg-slate-900/40 rounded-xl border border-white/5 shrink-0 flex items-center justify-center">
                          {getQuestIcon(q.icon)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white truncate flex items-center gap-1.5">
                            {q.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-normal mt-1 min-h-[30px]">
                            {q.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* Progress slider bar */}
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Progress: {q.currentValue} / {q.requiredValue}</span>
                          <span className={met ? "text-emerald-400" : "text-indigo-400"}>{progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900/40 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full transition-all duration-500 ${met ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        {/* Interactive custom action buttons */}
                        <div className="pt-2">
                          {claimed ? (
                            <div className="text-[10px] font-bold text-slate-500 text-center bg-slate-950/20 py-1.5 rounded-xl border border-dashed border-white/5 flex items-center justify-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Claimed Reward
                            </div>
                          ) : met ? (
                            <button
                              onClick={() => handleClaimQuest(q.id, q.xpReward, q.coinsReward)}
                              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition duration-300 shadow-md shadow-indigo-600/20 animate-pulse flex items-center justify-center gap-1"
                            >
                              <Gift className="w-3.5 h-3.5" /> Claim +{q.xpReward} XP / +{q.coinsReward} C
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (q.id === "q-notes") setActiveTab("notes");
                                else if (q.id === "q-quiz") setActiveTab("quizzes");
                                else if (q.id === "q-rag") setActiveTab("rag");
                                else if (q.id === "q-vocal") setActiveTab("voice");
                              }}
                              className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-[10px] uppercase rounded-xl transition border border-white/5 flex items-center justify-center gap-1"
                            >
                              Start Action <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action visual guide */}
            <div className={`p-6 rounded-3xl ${theme.card} text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm`}>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                  <Sparkles className="text-amber-500 w-4.5 h-4.5" /> Quick Start Guide
                </h3>
                <p className="text-xs text-neutral-400 max-w-[620px] leading-relaxed">
                  Start by clicking **Lesson Decks** in the navigation menu. Paste study textbooks, syllabus, or Slide text to active indexing. Once segmented, head to **RAG Tutoring Hub** to ask targeted grounded questions or **Quiz & Flashcards** to generate practice tests!
                </p>
              </div>
              <button
                onClick={() => setActiveTab("notes")}
                className={`py-3 px-6 rounded-2xl text-xs font-bold shrink-0 transition transform hover:-translate-y-0.5 active:translate-y-0 ${theme.accentBtn}`}
              >
                Assemble Study Deck
              </button>
            </div>

          </div>
        )}

        {/* Adaptive Python Curriculum Learning Paths */}
        {activeTab === "learning" && (
          <AdaptivePath 
            onEarnReward={handleEarnReward}
            onAddNote={handleAddNote}
            notes={notes}
          />
        )}

        {/* Notes chunking and summarization deck view */}
        {activeTab === "notes" && (
          <SubjectNotes 
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            xp={stats.xp}
            onEarnReward={handleEarnReward}
          />
        )}

        {/* Real-time RAG chatbot tutoring hub view */}
        {activeTab === "rag" && (
          <RAGBot 
            notes={notes}
            onEarnReward={handleEarnReward}
            xp={stats.xp}
            activeCompanion={activeCompanionObj}
          />
        )}

        {/* Speech / Voice active tutoring session */}
        {activeTab === "voice" && (
          <VoiceTutor 
            onEarnReward={handleEarnReward}
            activeCompanion={activeCompanionObj}
          />
        )}

        {/* Quizzes and active recall flashcards workspace */}
        {activeTab === "quizzes" && (
          <QuizFlashcards
            notes={notes}
            decks={decks}
            onAddDeck={handleAddDeck}
            onEarnReward={handleEarnReward}
          />
        )}

        {/* Coin customization mascot/theme shop */}
        {activeTab === "rewards" && (
          <RewardsStore
            stats={stats}
            onEquipItem={handleEquipShopItem}
            onUnlockItem={handleUnlockShopItem}
            xpNeededForNextLevel={xpNeededForNextLevel}
          />
        )}

        {/* Recharts cognitive progress analytics panels */}
        {activeTab === "analytics" && (
          <Analytics 
            stats={stats}
            notes={notes}
          />
        )}

        {/* Real-time Web Audio Synthesized deep focus environment */}
        {activeTab === "focus" && (
          <FocusRoom 
            onEarnReward={handleEarnReward}
            companions={{ equippedCompanion }}
          />
        )}
      </main>

      {/* Gamified Reward Toast Notification Layer */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            key={toastNotification.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 text-white p-4 rounded-3xl border border-indigo-500/30 shadow-[0_10px_35px_rgba(99,102,241,0.25)] backdrop-blur-xl flex flex-col gap-3"
          >
            <div className="flex items-start gap-3 text-left">
              <div className={`p-2.5 rounded-2xl ${
                toastNotification.type === 'level' ? 'bg-indigo-600 animate-bounce' :
                toastNotification.type === 'badge' ? 'bg-amber-500 animate-pulse' :
                toastNotification.type === 'quest' ? 'bg-emerald-500' : 'bg-indigo-500'
              } text-white flex items-center justify-center shrink-0`}>
                {toastNotification.type === 'level' && <Trophy className="w-5 h-5" />}
                {toastNotification.type === 'badge' && <Award className="w-5 h-5" />}
                {toastNotification.type === 'quest' && <Gift className="w-5 h-5" />}
                {toastNotification.type === 'xp' && <Coins className="w-5 h-5 text-amber-300" />}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xs font-black tracking-wider uppercase text-indigo-400">
                  {toastNotification.title}
                </h4>
                <p className="text-xs font-bold text-slate-100 mt-1 leading-snug">
                  {toastNotification.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Rewards loaded into wallet successfully!
                </p>
              </div>
            </div>

            {/* Micro progress status indicators inside toast */}
            <div className="bg-white/5 rounded-2xl p-2.5 flex items-center justify-around border border-white/5 text-[10px] font-bold">
              {toastNotification.xpGained !== undefined && toastNotification.xpGained > 0 && (
                <span className="flex items-center gap-1 text-emerald-400">
                  ⚡ +{toastNotification.xpGained} XP
                </span>
              )}
              {toastNotification.coinsGained !== undefined && toastNotification.coinsGained > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  🪙 +{toastNotification.coinsGained} Coins
                </span>
              )}
              <span className="text-slate-400">
                Wallet: {stats.coins} 🪙
              </span>
            </div>

            <button
              onClick={() => setToastNotification(null)}
              className="w-full py-1.5 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/20 text-[10px] font-black uppercase rounded-xl transition text-indigo-300 hover:text-white"
            >
              Collect & Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

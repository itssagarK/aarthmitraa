import { Language } from "./types";

export const UI_TEXT = {
  header_title: {
    en: "Arth Mitra",
    hi: "अर्थ मित्र",
    hinglish: "Arth Mitra"
  },
  header_subtitle: {
    en: "Your Money Buddy",
    hi: "आपका फाइनेंशियल दोस्त",
    hinglish: "Your Money Buddy"
  },
  welcome_title: {
    en: "Namaste!",
    hi: "नमस्ते!",
    hinglish: "Namaste!"
  },
  welcome_subtitle: {
    en: "I'll help you handle money smartly — step by step.",
    hi: "मैं आपको पैसे का सही इस्तेमाल करना सिखाऊंगा।",
    hinglish: "Main aapko money handle karna sikhaunga — step by step."
  },
  enter_name: {
    en: "What is your name?",
    hi: "आपका नाम क्या है?",
    hinglish: "Aapka naam kya hai?"
  },
  select_role: {
    en: "Select your role",
    hi: "अपनी भूमिका चुनें",
    hinglish: "Apna role select karein"
  },
  start_button: {
    en: "Start Journey",
    hi: "यात्रा शुरू करें",
    hinglish: "Journey Shuru Karein"
  },
  loading: {
    en: "Thinking...",
    hi: "सोच रहा हूँ...",
    hinglish: "Soch raha hoon..."
  },
  turn: {
    en: "Turn",
    hi: "बारी",
    hinglish: "Turn"
  },
  next_turn: {
    en: "Next Turn →",
    hi: "अगला कदम →",
    hinglish: "Next Turn →"
  },
  restart: {
    en: "Start New Life",
    hi: "नई शुरुआत करें",
    hinglish: "New Life Start Karein"
  },
  savings: { en: "Savings", hi: "बचत", hinglish: "Savings" },
  debt: { en: "Debt", hi: "कर्ज", hinglish: "Udhaar" },
  happiness: { en: "Joy", hi: "खुशी", hinglish: "Khushi" },
  health: { en: "Health", hi: "सेहत", hinglish: "Health" },
  
  game_over_win: {
    en: "Journey Completed!",
    hi: "यात्रा पूरी हुई!",
    hinglish: "Journey Complete!"
  },
  game_over_loss: {
    en: "Difficult Times...",
    hi: "मुश्किल समय...",
    hinglish: "Mushkil Time..."
  }
};

export const getTranslation = (lang: Language, key: keyof typeof UI_TEXT) => {
  return UI_TEXT[key][lang] || UI_TEXT[key]['en'];
};

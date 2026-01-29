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
  welcome_user_title: {
    en: "Welcome, {name}!",
    hi: "स्वागत है, {name}!",
    hinglish: "Welcome, {name}!"
  },
  welcome_user_subtitle: {
    en: "Let's begin your financial journey. Select your role:",
    hi: "आइए अपनी आर्थिक यात्रा शुरू करें। अपनी भूमिका चुनें:",
    hinglish: "Chaliye financial journey shuru karte hain. Role select karein:"
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
  game_over_win_body: {
    en: "You balanced money, health, and family perfectly. A true Arth Mitra!",
    hi: "आपने पैसा, सेहत और परिवार का सही संतुलन बनाया। सच्चे अर्थ मित्र!",
    hinglish: "Paisa, health aur family ka perfect balance banaya. True Arth Mitra!"
  },
  
  game_over_debt_title: {
    en: "Bankrupt!",
    hi: "दिवालिया!",
    hinglish: "Diwaliya!"
  },
  game_over_debt_body: {
    en: "The debt trap was too deep. Interest ate up everything.",
    hi: "कर्ज का जाल बहुत गहरा था। ब्याज ने सब कुछ खत्म कर दिया।",
    hinglish: "Debt ka jaal bahut gehra tha. Interest ne sab kuch khatam kar diya."
  },
  
  game_over_health_title: {
    en: "Health Collapse",
    hi: "सेहत खराब",
    hinglish: "Health Kharab"
  },
  game_over_health_body: {
    en: "You worked too hard and ignored your body. Health is wealth, and you lost it.",
    hi: "आपने बहुत मेहनत की लेकिन शरीर को नजरअंदाज किया। जान है तो जहान है।",
    hinglish: "Bahut mehnat ki par body ignore kiya. Health hi wealth hai, aur wo chali gayi."
  },
  
  game_over_happiness_title: {
    en: "Lost Hope",
    hi: "उम्मीद खो दी",
    hinglish: "Hope Kho Di"
  },
  game_over_happiness_body: {
    en: "The stress was too much. Money matters, but so does peace of mind.",
    hi: "तनाव बहुत ज्यादा था। पैसा जरूरी है, लेकिन मन की शांति भी।",
    hinglish: "Stress bahut jyada tha. Paisa zaruri hai, par peace of mind bhi."
  },

  game_over_survival_title: {
    en: "Survived...",
    hi: "बच गए...",
    hinglish: "Bach gaye..."
  },
  game_over_survival_body: {
    en: "You made it to the end, but the debt burden is heavy.",
    hi: "आप अंत तक तो पहुँच गए, लेकिन कर्ज का बोझ भारी है।",
    hinglish: "End tak pahunch gaye, par udhaar ka bojh bhaari hai."
  },

  game_over_loss: { // Fallback
    en: "Difficult Times...",
    hi: "मुश्किल समय...",
    hinglish: "Mushkil Time..."
  },

  // --- RECOVERY TIPS FOR BANKRUPTCY ---
  tip_title: {
    en: "💡 Bounce Back Strategy",
    hi: "💡 वापसी का तरीका",
    hinglish: "💡 Paisa Wapas Kamane Ka Trick"
  },
  tip_debt_Student: {
    en: "Skill Up: Offer tuition to juniors or sell old books. Avoid 'Buy Now Pay Later' apps!",
    hi: "ट्यूशन पढ़ाना शुरू करें या पुरानी किताबें बेचें। लोन ऐप्स से दूर रहें!",
    hinglish: "Juniors ko tuition padhao ya old books becho. Loan apps se door raho!"
  },
  tip_debt_Farmer: {
    en: "Diversify: Start small dairy or poultry side-business. Use Kisan Credit Card (KCC) for low interest.",
    hi: "दूध या मुर्गी पालन शुरू करें। कम ब्याज के लिए किसान क्रेडिट कार्ड (KCC) का उपयोग करें।",
    hinglish: "Side business start karo (Dairy/Poultry). Low interest ke liye KCC card use karo."
  },
  tip_debt_Shopkeeper: {
    en: "Clear Stock: Run a clearance sale for dead stock. Switch to cash-only for a while to rebuild capital.",
    hi: "पुराना सामान सेल में निकालें। कुछ समय के लिए उधारी बंद करें और नकद पर काम करें।",
    hinglish: "Purana stock sale mein nikaalo. Udhaar band karo aur cash par focus karo."
  },
  tip_debt_Worker: {
    en: "Emergency Fund: Save 10% of daily wage first. Look for skill training schemes (PMKVY) for better pay.",
    hi: "दिहाड़ी का 10% पहले बचाएं। बेहतर वेतन के लिए सरकारी कौशल योजनाओं (PMKVY) का लाभ उठाएं।",
    hinglish: "Roz ki kamayi ka 10% save karo. Government skill schemes join karo better salary ke liye."
  },
  tip_debt_default: {
    en: "Track Expenses: Write down every ₹10 spent. Cut tea/snacks cost by 50% immediately.",
    hi: "खर्चे लिखें: हर ₹10 का हिसाब रखें। चाय/नाश्ते का खर्च तुरंत आधा कर दें।",
    hinglish: "Ek diary mein har kharcha likho. Faltu kharche (chai/snacks) aadha kar do."
  }
};

export const getTranslation = (lang: Language, key: keyof typeof UI_TEXT) => {
  return UI_TEXT[key] ? (UI_TEXT[key][lang] || UI_TEXT[key]['en']) : key;
};
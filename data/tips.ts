import { Language, GameState } from '../types';

export const TIP_DATABASE: Record<string, Record<Language, string>> = {
  // --- General Context Tips ---
  high_debt: {
    en: "Debt eats your future. Pay off high-interest loans before spending on luxury.",
    hi: "कर्ज आपके भविष्य को खा जाता है। शौक पूरा करने से पहले कर्ज चुकाएं।",
    hinglish: "Udhaar future kha jaata hai. Luxury se pehle high-interest loan chukao."
  },
  low_health: {
    en: "Health is your true wealth. You cannot earn if you are sick.",
    hi: "सेहत ही असली दौलत है। अगर आप बीमार हैं तो कमा नहीं सकते।",
    hinglish: "Health hi asli wealth hai. Bimaar rahoge toh kamaoge kaise?"
  },
  low_savings: {
    en: "Start small. Even ₹10 saved daily builds a shield against bad days.",
    hi: "छोटी शुरुआत करें। रोज ₹10 बचाने से भी बुरे वक्त में मदद मिलती है।",
    hinglish: "Choti shuruwat karo. Roz ₹10 bachana bhi bure waqt mein kaam aata hai."
  },
  
  // --- Role Specific Wisdom ---
  Farmer: {
    en: "Don't rely on just one crop. Diversification is nature's insurance.",
    hi: "सिर्फ एक फसल पर निर्भर न रहें। विविधता ही प्रकृति का बीमा है।",
    hinglish: "Sirf ek crop par depend mat raho. Alag-alag fasal lagana hi safety hai."
  },
  Shopkeeper: {
    en: "Never mix shop cash with household expense money. Keep two wallets.",
    hi: "दुकान के गल्ले को घर के खर्च से न मिलाएं। दो अलग पर्स रखें।",
    hinglish: "Shop ke galle ko ghar ke kharche se mix mat karo. Do alag wallet rakho."
  },
  Student: {
    en: "Degrees get interviews, but skills get jobs. Keep learning new things.",
    hi: "डिग्री से इंटरव्यू मिलता है, लेकिन हुनर से नौकरी। नई चीजें सीखते रहें।",
    hinglish: "Degree se interview milta hai, par skills se job. Nayi cheezein seekhte raho."
  },
  Worker: {
    en: "Your body is your biggest asset. Don't skip meals to save money.",
    hi: "आपका शरीर ही आपकी सबसे बड़ी पूंजी है। पैसे बचाने के लिए खाना न छोड़ें।",
    hinglish: "Body hi aapka asset hai. Paise bachane ke chakkar mein khana mat skip karo."
  },
  default: {
    en: "Money is a tool, not a master. Control it before it controls you.",
    hi: "पैसा एक औजार है, मालिक नहीं। इसे काबू में रखें वरना यह आपको काबू कर लेगा।",
    hinglish: "Paisa ek tool hai, master nahi. Isse control karo warna ye tumhe control karega."
  },

  // --- Bankruptcy Recovery Tips (Specific) ---
  Student_bankruptcy: {
    en: "Skill Up: Offer tuition to juniors or sell old books. Avoid 'Buy Now Pay Later' apps!",
    hi: "ट्यूशन पढ़ाना शुरू करें या पुरानी किताबें बेचें। लोन ऐप्स से दूर रहें!",
    hinglish: "Juniors ko tuition padhao ya old books becho. Loan apps se door raho!"
  },
  Farmer_bankruptcy: {
    en: "Diversify: Start small dairy or poultry side-business. Use Kisan Credit Card (KCC) for low interest.",
    hi: "दूध या मुर्गी पालन शुरू करें। कम ब्याज के लिए किसान क्रेडिट कार्ड (KCC) का उपयोग करें।",
    hinglish: "Side business start karo (Dairy/Poultry). Low interest ke liye KCC card use karo."
  },
  Shopkeeper_bankruptcy: {
    en: "Clear Stock: Run a clearance sale for dead stock. Switch to cash-only for a while to rebuild capital.",
    hi: "पुराना सामान सेल में निकालें। कुछ समय के लिए उधारी बंद करें और नकद पर काम करें।",
    hinglish: "Purana stock sale mein nikaalo. Udhaar band karo aur cash par focus karo."
  },
  Worker_bankruptcy: {
    en: "Emergency Fund: Save 10% of daily wage first. Look for skill training schemes (PMKVY) for better pay.",
    hi: "दिहाड़ी का 10% पहले बचाएं। बेहतर वेतन के लिए सरकारी कौशल योजनाओं (PMKVY) का लाभ उठाएं।",
    hinglish: "Roz ki kamayi ka 10% save karo. Government skill schemes join karo better salary ke liye."
  },
  default_bankruptcy: {
    en: "Track Expenses: Write down every ₹10 spent. Cut tea/snacks cost by 50% immediately.",
    hi: "खर्चे लिखें: हर ₹10 का हिसाब रखें। चाय/नाश्ते का खर्च तुरंत आधा कर दें।",
    hinglish: "Ek diary mein har kharcha likho. Faltu kharche (chai/snacks) aadha kar do."
  }
};

export const getTip = (key: string, lang: Language): string => {
  const tipObj = TIP_DATABASE[key] || TIP_DATABASE['default'];
  return tipObj[lang] || tipObj['en'];
};

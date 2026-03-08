import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameState, PlayerProfile, Language, GameEvent } from "../types";
import { PREDEFINED_SCENARIOS } from "../data/scenarios";

const apiKey = process.env.API_KEY;
const MODEL_NAME = "gemini-3-flash-preview";

const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to get language context for the AI
const getLangContext = (lang: Language) => {
  switch (lang) {
    case 'hi': return "Response Language: HINDI (Devanagari script). Use very simple, spoken Hindi (Bol-chal ki bhasha). No complex textbook words.";
    case 'hinglish': return "Response Language: HINGLISH (Latin script). casual, like WhatsApp chat between Indian friends.";
    default: return "Response Language: ENGLISH. Simple, direct, Indian English. Grade 6 reading level.";
  }
};

const SYSTEM_INSTRUCTION = `
You are "Arth Mitra", a game engine simulating life in rural/semi-urban India.

YOUR GOAL:
Create relatable, easy-to-understand life scenarios that test financial wisdom.

STRICT SCENARIO GUIDELINES:
1. **Role-Specific:** 
   - If 'Farmer': Scenarios MUST be about rain, crops, seeds, tractors, village money-lenders.
   - If 'Student': Scenarios MUST be about fees, exams, gadgets, friends, part-time jobs.
   - If 'Shopkeeper': Scenarios MUST be about customers, stock, competitors, festival sales.
   - If 'Worker': Scenarios MUST be about daily wages, health, factory shifts, family needs.

2. **Simplicity (Crucial):**
   - Use SHORT sentences.
   - NO complex financial jargon. (Don't say "Liquidity Crisis", say "No cash in pocket").
   - NO long paragraphs.

3. **Topics:**
   - Focus on: Family pressure (Weddings/Gifts), Health scares, Education costs, Showing off to neighbors, and unexpected bad luck.

4. **Financial Rules:**
   - If a choice costs money, the savings impact MUST be negative.
   - Debt grows if ignored.
   - "Expensive" choice = High dopamine/Status but bad for wallet.
   - "Balanced" choice = Prudent but boring.
   - "Cheap" choice = Saves money but might hurt Happiness/Health/Status/Relationships.

5. **Output Format:** Strict JSON.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    // Feedback for the PREVIOUS action
    previous_outcome_title: {
      type: Type.STRING,
      description: "Short reaction (e.g., 'Saved it!', 'Oh no!', 'Good choice').",
    },
    previous_outcome_desc: {
      type: Type.STRING,
      description: "1 simple sentence explaining the result. (e.g., 'You bought the bike, but now you can't pay rent.')",
    },
    financial_explanation: {
      type: Type.STRING,
      description: "Strict format: '[Amount] [Action]'. Example: '-₹5000 for Medicine' or '+₹2000 Bonus'.",
    },
    impact_on_stats: {
      type: Type.OBJECT,
      properties: {
        savings: { type: Type.INTEGER },
        debt: { type: Type.INTEGER },
        happiness: { type: Type.INTEGER },
        health: { type: Type.INTEGER },
        relationships: { type: Type.INTEGER },
      },
      required: ["savings", "debt", "happiness", "health", "relationships"],
    },
    
    // The NEXT Situation
    narrative_hook: {
      type: Type.STRING,
      description: "The new situation in ONE simple sentence. (e.g., 'Your cousin is getting married and asks for a gift.')",
    },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, description: "Action text (Max 6 words)" },
          emoji: { type: Type.STRING, description: "Single emoji" },
          cost_label: { type: Type.STRING, description: "e.g. '₹2000' or 'Free'" },
          tag: { type: Type.STRING, description: "Short vibe check (e.g. 'Risky', 'Safe', 'Fun')" },
          type: { type: Type.STRING, enum: ['expensive', 'balanced', 'cheap'] },
        },
        required: ["id", "text", "emoji", "cost_label", "tag", "type"],
      },
    },
    isGameOver: { type: Type.BOOLEAN },
  },
  required: ["narrative_hook", "choices", "impact_on_stats", "isGameOver", "financial_explanation"],
};

// --- HELPER: Get Predefined Scenario ---
const getPredefinedScenario = (occupation: string, history: string[]): any | null => {
  // Filter by occupation
  const relevant = PREDEFINED_SCENARIOS.filter(s => s.occupation === occupation);
  // Filter out already seen scenarios (by narrative hook matching)
  const available = relevant.filter(s => !history.includes(s.narrative_hook));
  
  if (available.length === 0) return null;
  
  // Pick random
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

export const startSimulation = async (profile: PlayerProfile, lang: Language) => {
  // 50% chance to use a predefined scenario for the start
  if (Math.random() < 0.5) {
    const predefined = getPredefinedScenario(profile.occupation, []);
    if (predefined) {
      console.log("Using predefined start scenario:", predefined.id);
      return {
        narrative_hook: predefined.narrative_hook,
        choices: predefined.choices,
        impact_on_stats: { savings: 0, debt: 0, happiness: 0, health: 0, relationships: 0 },
        previous_outcome_title: "",
        previous_outcome_desc: "",
        financial_explanation: "",
        isGameOver: false
      };
    }
  }

  const langInstruction = getLangContext(lang);
  
  const prompt = `
    START NEW GAME.
    Context: Rural/Semi-Urban India.
    Player: ${profile.name}
    Role: ${profile.occupation}
    Income: ₹${profile.monthlyIncome}
    
    ${langInstruction}
    
    Task:
    1. Create the very first scenario typical for a ${profile.occupation}.
    2. It should be a common day-to-day decision (e.g., buying tools, paying fees, or a festival bonus).
    3. Keep it simple and relatable.
    
    Note: Since it's the start, 'previous_outcome' fields should be empty/neutral, and impacts 0.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error starting simulation:", error);
    throw error;
  }
};

export const nextTurn = async (
  currentState: GameState,
  choiceId: string,
  choiceText: string,
  choiceCostLabel?: string
) => {
  const langInstruction = getLangContext(currentState.language);

  // Dynamic context flags to guide the AI
  const income = currentState.profile?.monthlyIncome || 15000;
  let statusFlags = "";
  if (currentState.debt > income * 4) statusFlags += "CRITICAL: DEBT IS VERY HIGH. COLLECTORS ARE CHASING. ";
  if (currentState.health < 30) statusFlags += "CRITICAL: HEALTH IS FAILING. EXPENSIVE MEDICAL BILLS LIKELY. ";
  if (currentState.happiness < 30) statusFlags += "WARNING: VERY SAD/DEPRESSED. NEEDS FUN. ";
  if (currentState.relationships < 30) statusFlags += "WARNING: LONELY/ISOLATED. FAMILY ANGRY. ";
  if (currentState.savings < 1000) statusFlags += "WARNING: BROKE (NO CASH). ";

  const prompt = `
    ${langInstruction}
    
    Current Player Status:
    - Role: ${currentState.profile?.occupation}
    - Savings: ₹${currentState.savings}
    - Debt: ₹${currentState.debt}
    - Happiness: ${currentState.happiness}
    - Health: ${currentState.health}
    - Relationships: ${currentState.relationships}
    - Turn: ${currentState.turn}
    
    Flags: ${statusFlags}

    Player just chose: "${choiceText}" (Cost: ${choiceCostLabel || 'N/A'}).
    Previous Scenario was: "${currentState.currentEvent?.narrative_hook}".

    Task:
    1. **Feedback:** Briefly describe the result of their choice. Did it work? Was it a scam? Are they happy?
    2. **Next Scenario:** Create the next logical event.
       - If ${statusFlags} is present, the next event MUST be related to that crisis.
       - If everything is fine, introduce a new life event (Festival, Family Visit, Appliance breakdown, Job opportunity).
       - Ensure the scenario fits a '${currentState.profile?.occupation}' in India.
    
    3. **Choices:** Provide 3 clear options (Expensive/Flashy, Balanced/Smart, Cheap/Risky).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const aiData = JSON.parse(text);

    // --- HYBRID INJECTION ---
    // 40% chance to inject a predefined scenario IF no critical status flags are present
    // We don't want to interrupt a crisis (like debt collectors) with a random event
    if (Math.random() < 0.4 && statusFlags === "" && currentState.profile) {
      const predefined = getPredefinedScenario(currentState.profile.occupation, currentState.history);
      if (predefined) {
        console.log("Injecting predefined scenario:", predefined.id);
        // Overwrite the NEXT scenario part, but keep the PREVIOUS feedback from AI
        aiData.narrative_hook = predefined.narrative_hook;
        aiData.choices = predefined.choices;
      }
    }

    return aiData;

  } catch (error) {
    console.error("Error generating next turn:", error);
    throw error;
  }
};
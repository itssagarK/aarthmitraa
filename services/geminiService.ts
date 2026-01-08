import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameState, PlayerProfile, Language } from "../types";

const apiKey = process.env.API_KEY;
const MODEL_NAME = "gemini-3-flash-preview";

const ai = new GoogleGenAI({ apiKey: apiKey });

// Helper to get language context for the AI
const getLangContext = (lang: Language) => {
  switch (lang) {
    case 'hi': return "Response Language: HINDI (Devanagari script). Use simple, everyday Hindi.";
    case 'hinglish': return "Response Language: HINGLISH (Latin script). Use the way Indian millennials chat. Casual, friendly.";
    default: return "Response Language: ENGLISH. Simple, accessible, Indian context.";
  }
};

const SYSTEM_INSTRUCTION = `
You are "Arth Mitra", a friendly Indian financial buddy.
Your goal: Simulate financial consequences with DOPAMINE hits and EMOTIONAL decisions.

STYLE RULES:
1. **NO Paragraphs.** Use punchy, 1-line hooks.
2. **Context:** Rural/Semi-urban India.
3. **Tone:** Warm, non-judgmental, casual (like a friend).
4. **Format:** Strict JSON.

When generating choices:
- Option A: Expensive/Tempting (Instant gratification or social pressure).
- Option B: Balanced/Middle path.
- Option C: Frugal/Hard (Saves money but might hurt happiness/relationships).
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    // Feedback for the PREVIOUS action
    previous_outcome_title: {
      type: Type.STRING,
      description: "Short celebratory or sympathetic title about the LAST choice (e.g., 'Smart Move!' or 'Ouch!'). Max 4 words.",
    },
    previous_outcome_desc: {
      type: Type.STRING,
      description: "1-sentence explanation of the result. (e.g., 'Mom is happy, but your pockets are empty.')",
    },
    impact_on_stats: {
      type: Type.OBJECT,
      properties: {
        savings: { type: Type.INTEGER },
        debt: { type: Type.INTEGER },
        happiness: { type: Type.INTEGER },
        health: { type: Type.INTEGER },
      },
      required: ["savings", "debt", "happiness", "health"],
    },
    
    // The NEXT Situation
    narrative_hook: {
      type: Type.STRING,
      description: "The new situation in ONE punchy line. (e.g., 'Family wedding next week. Wallet is tight.')",
    },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING, description: "Action text (e.g. 'Buy Gold Gift')" },
          cost_label: { type: Type.STRING, description: "Cost display (e.g. '₹8000' or 'Free')" },
          tag: { type: Type.STRING, description: "Short emotional/financial summary (e.g. 'Loved | Wallet Empty')" },
          type: { type: Type.STRING, enum: ['expensive', 'balanced', 'cheap'] },
        },
        required: ["id", "text", "cost_label", "tag", "type"],
      },
    },
    isGameOver: { type: Type.BOOLEAN },
  },
  required: ["narrative_hook", "choices", "impact_on_stats", "isGameOver"],
};

export const startSimulation = async (profile: PlayerProfile, lang: Language) => {
  const langInstruction = getLangContext(lang);
  
  const prompt = `
    START NEW GAME.
    Player: ${profile.name}, Role: ${profile.occupation}, Income: ₹${profile.monthlyIncome}.
    ${langInstruction}
    
    1. Introduce the first situation (narrative_hook).
    2. Provide 3 choices.
    3. Since it's the start, 'previous_outcome_title' and 'impact_on_stats' should be empty/zero.
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
  choiceText: string
) => {
  const langInstruction = getLangContext(currentState.language);

  const prompt = `
    ${langInstruction}
    Current Status:
    - Role: ${currentState.profile?.occupation}
    - Savings: ₹${currentState.savings}
    - Debt: ₹${currentState.debt}
    - Happiness: ${currentState.happiness}
    - Health: ${currentState.health}
    - Turn: ${currentState.turn}

    Player Action: "${choiceText}".
    Previous Scenario: "${currentState.currentEvent?.narrative_hook}".

    1. Calculate IMPACT of this action (Feedback).
    2. Generate 'previous_outcome_title' (e.g. "Great job!", "Risky!", "Family is sad").
    3. Generate 'previous_outcome_desc'.
    4. Create the NEXT Situation ('narrative_hook') - Make it different from the last one.
    5. Provide 3 new choices.
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
    console.error("Error generating next turn:", error);
    throw error;
  }
};

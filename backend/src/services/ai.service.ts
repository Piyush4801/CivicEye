import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from environment variables
// Note: If GEMINI_API_KEY is not set, we'll fall back to a mock response so the app doesn't crash during development.
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const analyzeIssueWithAI = async (title: string, description: string, category: string) => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is missing. Using mock AI response.');
    return {
      confidence: 85,
      suggestedAction: 'Route to Municipal Corporation based on basic keyword matching.',
      riskLevel: 'Medium',
      possibleDuplicate: false,
      summary: 'Mocked summary: ' + description.substring(0, 50) + '...',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an AI assistant for CivicEye, a civic intelligence platform.
      Analyze the following civic issue report:
      Title: ${title}
      Category: ${category}
      Description: ${description}

      Provide a JSON response with the following structure:
      {
        "confidence": <number between 1-100 indicating confidence in your analysis>,
        "suggestedAction": "<A brief string suggesting which government department should handle this and what action to take>",
        "riskLevel": "<Low, Medium, High, or Critical>",
        "possibleDuplicate": <boolean indicating if this sounds like a generic duplicate issue>,
        "summary": "<A 1-2 sentence professional summary of the issue>"
      }

      Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting if the model still includes it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini AI Analysis Error:', error);
    // Fallback in case of API failure
    return {
      confidence: 50,
      suggestedAction: 'Manual review required due to AI service error.',
      riskLevel: 'Unknown',
      possibleDuplicate: false,
      summary: 'Error analyzing issue.',
    };
  }
};

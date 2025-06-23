
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FarmInputData, GeminiResponse, UrgencyLevel } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_API_SYSTEM_INSTRUCTION, TEMPERATURE_UNIT } from '../constants';

if (!process.env.API_KEY) {
  // This check is primarily for development environments or misconfigurations.
  // In a production build, process.env.API_KEY should be set.
  console.warn(
    `API_KEY environment variable is not set. Gemini API calls will fail. 
    Please ensure the API_KEY is configured in your environment.`
  );
  // Throwing an error here would stop the app from loading, 
  // which might be desired if API key is critical for all functionality.
  // However, for this example, we'll let it proceed and fail on API call.
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! }); // Use non-null assertion as it's checked or expected

const constructPrompt = (data: FarmInputData): string => {
  const contextSummary = `Field: '${data.fieldName}', Crop: '${data.cropType}', Soil Moisture: ${data.soilMoisture.toFixed(2)}, Current Weather: '${data.currentWeather}', Temperature: ${data.temperature}${TEMPERATURE_UNIT}, Forecast (next 3 hours): '${data.weatherForecast}'`;
  return `Data: ${contextSummary}`;
};

export const generateRecommendation = async (farmData: FarmInputData): Promise<GeminiResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  
  const prompt = constructPrompt(farmData);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: GEMINI_API_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        // Optional: Add other configs like temperature, topK, topP if needed
        // temperature: 0.7, 
      },
    });

    let jsonStr = response.text.trim();
    // Remove markdown ```json ``` fences if present
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr) as GeminiResponse;
      
      // Validate the structure of the parsed data
      if (
        typeof parsedData.field_name !== 'string' ||
        !Object.values(UrgencyLevel).includes(parsedData.urgency) ||
        typeof parsedData.recommendation_text !== 'string'
      ) {
        console.error("Gemini response has unexpected structure:", parsedData);
        throw new Error("Received an invalid JSON structure from the AI.");
      }
      return parsedData;

    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError);
      console.error("Original Gemini text response:", response.text);
      throw new Error(`AI returned malformed JSON. Raw response: ${response.text.substring(0,100)}...`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Check for specific API error messages if available from the SDK
        if (error.message.includes("API key not valid")) {
             throw new Error("Invalid Gemini API Key. Please check your configuration.");
        }
    }
    throw error; // Re-throw the original or a more specific error
  }
};
    
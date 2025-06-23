
export interface FarmInputData {
  id: string; // Unique ID for each input set
  fieldName: string;
  cropType: string;
  soilMoisture: number; // 0.0 to 1.0
  currentWeather: string;
  temperature: number; // Celsius or Fahrenheit, user context
  weatherForecast: string; // Next 3 hours
}

export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface Recommendation {
  id: string; // Corresponds to FarmInputData id
  fieldName: string;
  urgency: UrgencyLevel;
  recommendation_text: string;
  timestamp: Date;
}

export interface GeminiResponse {
  field_name: string;
  urgency: UrgencyLevel;
  recommendation_text: string;
}
    

import React, { useState } from 'react';
import { FarmInputData } from '../types';
import { TEMPERATURE_UNIT } from '../constants';

interface FarmInputFormProps {
  onSubmit: (data: FarmInputData) => void;
  isLoading: boolean;
}

const initialFormState: Omit<FarmInputData, 'id'> = {
  fieldName: '',
  cropType: '',
  soilMoisture: 0.5,
  currentWeather: '',
  temperature: 70,
  weatherForecast: '',
};

export const FarmInputForm: React.FC<FarmInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Omit<FarmInputData, 'id'>>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soilMoisture' || name === 'temperature' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    // Basic validation
    if (!formData.fieldName.trim() || !formData.cropType.trim() || !formData.currentWeather.trim() || !formData.weatherForecast.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    if (formData.soilMoisture < 0 || formData.soilMoisture > 1) {
      alert("Soil moisture must be between 0.0 and 1.0.");
      return;
    }
    onSubmit({ ...formData, id: new Date().toISOString() + Math.random().toString(36).substring(2,9) }); // Add a unique ID
    // Optionally reset form: setFormData(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-xl space-y-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
          <input
            type="text"
            name="fieldName"
            id="fieldName"
            value={formData.fieldName}
            onChange={handleChange}
            placeholder="e.g., North Paddock"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
          <input
            type="text"
            name="cropType"
            id="cropType"
            value={formData.cropType}
            onChange={handleChange}
            placeholder="e.g., Corn"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="soilMoisture" className="block text-sm font-medium text-gray-700 mb-1">
          Soil Moisture (0.0 - 1.0): <span className="font-semibold text-primary">{formData.soilMoisture.toFixed(2)}</span>
        </label>
        <input
          type="range"
          name="soilMoisture"
          id="soilMoisture"
          min="0"
          max="1"
          step="0.01"
          value={formData.soilMoisture}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="currentWeather" className="block text-sm font-medium text-gray-700 mb-1">Current Weather</label>
          <input
            type="text"
            name="currentWeather"
            id="currentWeather"
            value={formData.currentWeather}
            onChange={handleChange}
            placeholder="e.g., Sunny, Partly Cloudy"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">Temperature ({TEMPERATURE_UNIT})</label>
          <input
            type="number"
            name="temperature"
            id="temperature"
            value={formData.temperature}
            onChange={handleChange}
            placeholder="e.g., 75"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="weatherForecast" className="block text-sm font-medium text-gray-700 mb-1">Weather Forecast (next 3 hours)</label>
        <textarea
          name="weatherForecast"
          id="weatherForecast"
          value={formData.weatherForecast}
          onChange={handleChange}
          rows={2}
          placeholder="e.g., No rain expected, Light showers possible"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Get AgroSage Advice'}
      </button>
    </form>
  );
};
    
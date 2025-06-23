
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FarmInputForm } from './components/FarmInputForm';
import { RecommendationCard } from './components/RecommendationCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateRecommendation } from './services/geminiService';
import { FarmInputData, Recommendation, UrgencyLevel, GeminiResponse } from './types';

const App: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (formData: FarmInputData) => {
    setIsLoading(true);
    setError(null);
    try {
      const geminiResponse: GeminiResponse = await generateRecommendation(formData);
      const newRecommendation: Recommendation = {
        id: formData.id, // Link recommendation to the input
        fieldName: geminiResponse.field_name, // Correctly map field_name to fieldName
        urgency: geminiResponse.urgency as UrgencyLevel, // Retain explicit cast as in original code
        recommendation_text: geminiResponse.recommendation_text,
        timestamp: new Date(),
      };
      setRecommendations(prev => [newRecommendation, ...prev.filter(r => r.id !== newRecommendation.id)]); // Add or update recommendation
    } catch (err) {
      console.error("Error generating recommendation:", err);
      if (err instanceof Error) {
        setError(`Failed to get recommendation: ${err.message}. Ensure your API key is correctly configured.`);
      } else {
        setError("An unknown error occurred while fetching the recommendation.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRecommendations = () => {
    setRecommendations([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-lime-50 to-yellow-50 text-textPrimary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-textSecondary mb-8 text-lg">
            Enter your farm's current conditions to receive AI-powered advice from AgroSage.
          </p>
          
          <FarmInputForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          {isLoading && (
            <div className="my-8">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="my-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-md">
              <h3 className="font-semibold">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-primary">Recommendations</h2>
                <button
                  onClick={clearRecommendations}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-6">
                {recommendations.map(rec => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </div>
          )}

          { !isLoading && !error && recommendations.length === 0 && (
            <div className="mt-12 text-center text-textSecondary">
              <p className="text-xl">No recommendations yet. Fill out the form above to get started!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;


import React from 'react';
import { Recommendation, UrgencyLevel } from '../types';
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // Using Heroicons for better visuals

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const UrgencyIndicator: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let borderColor = 'border-gray-300';
  let IconComponent = InformationCircleIcon;

  switch (urgency) {
    case UrgencyLevel.HIGH:
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      borderColor = 'border-red-400';
      IconComponent = ExclamationTriangleIcon;
      break;
    case UrgencyLevel.MEDIUM:
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      borderColor = 'border-yellow-400';
      IconComponent = ExclamationTriangleIcon; // Or a different icon for medium
      break;
    case UrgencyLevel.LOW:
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      borderColor = 'border-green-400';
      IconComponent = CheckCircleIcon;
      break;
  }

  return (
    <div className={`px-3 py-1 text-sm font-semibold rounded-full inline-flex items-center ${bgColor} ${textColor} border ${borderColor}`}>
      <IconComponent className={`h-5 w-5 mr-1.5 ${textColor}`} />
      {urgency} Urgency
    </div>
  );
};


export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <h3 className="text-xl font-semibold text-secondary mb-2 sm:mb-0">
          Field: {recommendation.fieldName}
        </h3>
        <UrgencyIndicator urgency={recommendation.urgency} />
      </div>
      <p className="text-gray-700 text-base leading-relaxed mb-3">
        {recommendation.recommendation_text}
      </p>
      <p className="text-xs text-gray-500 text-right">
        Generated: {recommendation.timestamp.toLocaleString()}
      </p>
    </div>
  );
};
    
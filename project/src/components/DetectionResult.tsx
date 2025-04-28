import React from 'react';
import { Check, X, AlertTriangle, Clock } from 'lucide-react';
import { DetectionResult } from '../types';
import { formatAccuracy } from '../utils/detectionUtils';

interface DetectionResultProps {
  result: DetectionResult | null;
  imageUrl: string | null;
}

const DetectionResultComponent: React.FC<DetectionResultProps> = ({ result, imageUrl }) => {
  if (!result || !imageUrl) {
    return null;
  }

  const { isAmbulance, accuracy } = result;
  
  // Determine badge color based on accuracy
  const getBadgeColor = () => {
    if (accuracy >= 0.85) return 'bg-green-100 text-green-800';
    if (accuracy >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Animation for the result card - slides in from bottom
  const animationClass = 'animate-fade-in transition-all duration-500';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${animationClass}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="Uploaded vehicle" 
          className="w-full h-48 object-cover"
        />
        
        {/* Overlay badge for detection result */}
        <div className={`
          absolute top-3 right-3 rounded-full px-3 py-1 
          ${isAmbulance 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
          }
          font-bold text-sm flex items-center gap-1
        `}>
          {isAmbulance 
            ? <><Check size={16} /> Ambulance</> 
            : <><X size={16} /> Not Ambulance</>
          }
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Detection Result
        </h3>
        
        <div className="mt-3 space-y-3">
          {/* Accuracy indicator */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Accuracy:</span>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}>
              {formatAccuracy(accuracy)}
            </span>
          </div>
          
          {/* Warning for low accuracy */}
          {accuracy < 0.75 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 flex items-start">
              <AlertTriangle className="text-yellow-500 mr-2 flex-shrink-0" size={18} />
              <p className="text-sm text-yellow-700">
                Low confidence detection. Consider taking another photo with better lighting or angle.
              </p>
            </div>
          )}
          
          {/* Timestamp */}
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            {isAmbulance && (
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium">
                Find Nearest Hospital
              </button>
            )}
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors font-medium">
              New Detection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionResultComponent;
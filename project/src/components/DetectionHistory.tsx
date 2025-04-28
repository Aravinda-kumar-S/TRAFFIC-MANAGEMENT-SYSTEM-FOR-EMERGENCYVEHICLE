import React from 'react';
import { History, Check, X } from 'lucide-react';
import { SavedDetection } from '../types';
import { formatAccuracy } from '../utils/detectionUtils';

interface DetectionHistoryProps {
  detections: SavedDetection[];
}

const DetectionHistory: React.FC<DetectionHistoryProps> = ({ detections }) => {
  if (detections.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <History size={20} className="mr-2 text-gray-600" />
          Detection History
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
        {detections.map((detection) => (
          <div 
            key={detection.id} 
            className="p-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
              <img 
                src={detection.imageUrl} 
                alt="Detected vehicle" 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  ${detection.result.isAmbulance 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                `}>
                  {detection.result.isAmbulance 
                    ? <><Check size={12} className="mr-1" /> Ambulance</> 
                    : <><X size={12} className="mr-1" /> Not Ambulance</>
                  }
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {formatAccuracy(detection.result.accuracy)}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                {new Date(detection.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetectionHistory;
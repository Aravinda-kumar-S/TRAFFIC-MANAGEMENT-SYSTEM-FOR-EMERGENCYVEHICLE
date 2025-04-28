import React, { useState, useEffect, useCallback } from 'react';
import { Hospital, DetectionResult, SavedDetection } from './types';
import Navbar from './components/Navbar';
import ImageUpload from './components/ImageUpload';
import DetectionResultComponent from './components/DetectionResult';
import EmergencyMap from './components/EmergencyMap';
import DetectionHistory from './components/DetectionHistory';
import { detectAmbulance, fileToDataUrl } from './utils/detectionUtils';
import { getCurrentLocation, findNearestHospitals } from './utils/locationUtils';
import { AlertTriangle } from 'lucide-react';

function App() {
  // State for image upload and detection
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  
  // State for location and hospitals
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState<boolean>(false);
  
  // State for detection history
  const [detectionHistory, setDetectionHistory] = useState<SavedDetection[]>([]);
  
  // Location permission state
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  // Handle location updates
  const handleLocationUpdate = useCallback(async (position: [number, number]) => {
    setCurrentLocation(position);
    
    try {
      setIsLoadingHospitals(true);
      const hospitals = await findNearestHospitals(position);
      setNearbyHospitals(hospitals);
    } catch (error) {
      console.error('Error updating hospitals:', error);
    } finally {
      setIsLoadingHospitals(false);
    }
  }, []);

  // Initialize location tracking
  useEffect(() => {
    let watchId: number;

    const startLocationTracking = async () => {
      try {
        if (navigator.geolocation) {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              const newPosition: [number, number] = [
                position.coords.latitude,
                position.coords.longitude
              ];
              handleLocationUpdate(newPosition);
              setLocationPermission(true);
            },
            (error) => {
              console.error('Geolocation error:', error);
              setLocationPermission(false);
              // Fall back to default location
              handleLocationUpdate([40.7128, -74.0060]);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        } else {
          setLocationPermission(false);
          // Fall back to default location
          handleLocationUpdate([40.7128, -74.0060]);
        }
      } catch (error) {
        console.error('Error starting location tracking:', error);
        setLocationPermission(false);
      }
    };

    startLocationTracking();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [handleLocationUpdate]);

  // Handle image selection
  const handleImageSelected = async (file: File) => {
    setSelectedImage(file);
    setIsProcessing(true);
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
      
      const result = await detectAmbulance(file);
      setDetectionResult(result);
      
      if (dataUrl) {
        const newDetection: SavedDetection = {
          id: `detection-${Date.now()}`,
          imageUrl: dataUrl,
          result: result,
          timestamp: Date.now()
        };
        
        setDetectionHistory(prev => [newDetection, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setDetectionResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {locationPermission === false && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Location access is denied. Some features like finding nearby hospitals
                  will use default locations instead of your actual position.
                  Please enable location access for better accuracy.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Upload Vehicle Image
              </h2>
              <ImageUpload 
                onImageSelected={handleImageSelected} 
                isProcessing={isProcessing} 
              />
            </div>
            
            {imageUrl && detectionResult && (
              <DetectionResultComponent 
                result={detectionResult} 
                imageUrl={imageUrl} 
              />
            )}
            
            {detectionHistory.length > 0 && (
              <DetectionHistory detections={detectionHistory} />
            )}
          </div>
          
          <div className="lg:col-span-2">
            <EmergencyMap 
              currentLocation={currentLocation}
              hospitals={nearbyHospitals}
              selectedHospital={selectedHospital}
              onSelectHospital={handleSelectHospital}
              isLoadingHospitals={isLoadingHospitals}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
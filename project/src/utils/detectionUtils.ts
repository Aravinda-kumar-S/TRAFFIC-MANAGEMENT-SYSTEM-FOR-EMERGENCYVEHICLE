import { DetectionResult } from '../types';

// Simulates ambulance detection with a random result
export const detectAmbulance = (image: File): Promise<DetectionResult> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // For demo purposes, randomly decide if the image contains an ambulance
      // In a real app, this would use a trained image classification model
      const random = Math.random();
      const isAmbulance = random > 0.4; // 60% chance of being an ambulance for demo
      
      // Generate a realistic accuracy value
      // If it is an ambulance, accuracy tends to be higher
      const baseAccuracy = isAmbulance ? 0.75 : 0.3;
      const accuracyNoise = Math.random() * 0.2; // Add some randomness
      const accuracy = Math.min(0.99, Math.max(0.5, baseAccuracy + accuracyNoise));
      
      resolve({
        isAmbulance,
        accuracy,
        timestamp: Date.now()
      });
    }, 1500); // Simulate 1.5 second processing time
  });
};

// Converts a File to a data URL for preview
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Formats accuracy as a percentage
export const formatAccuracy = (accuracy: number): string => {
  return `${(accuracy * 100).toFixed(1)}%`;
};

// Simulates saving a detection result
export const saveDetection = async (
  image: File, 
  result: DetectionResult
): Promise<string> => {
  // In a real app, this would upload to a server
  // For the MVP, we'll just return a mock ID
  return `detection-${Date.now()}`;
};
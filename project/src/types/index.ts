export interface DetectionResult {
  isAmbulance: boolean;
  accuracy: number;
  timestamp: number;
}

export interface Hospital {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number; // in kilometers
  address?: string;
  phone?: string;
  emergency?: boolean;
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  startPoint: [number, number];
  endPoint: [number, number];
  trafficLevel?: 'low' | 'medium' | 'high';
}

export interface SavedDetection {
  id: string;
  imageUrl: string;
  result: DetectionResult;
  timestamp: number;
}
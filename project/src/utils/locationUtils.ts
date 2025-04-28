import { Hospital } from '../types';
import { mockHospitals } from '../data/mockHospitals';

// Gets the current location with continuous updates
export const getCurrentLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Fallback to default location (NYC area)
      resolve([40.7128, -74.0060]);
      return;
    }

    // Watch for location updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        resolve([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to default location
        resolve([40.7128, -74.0060]);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  });
};

// Calculates distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

// Helper function to convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Fetches real hospitals from OpenStreetMap using Overpass API
export const fetchNearbyHospitals = async (
  [lat, lon]: [number, number],
  radius: number = 5000 // Search radius in meters
): Promise<Hospital[]> => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      relation["amenity"="hospital"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hospitals');
    }

    const data = await response.json();
    
    return data.elements.map((element: any) => {
      // Get coordinates based on element type
      const coords = element.type === 'node' 
        ? { lat: element.lat, lon: element.lon }
        : { lat: element.center.lat, lon: element.center.lon };
      
      const distance = calculateDistance(lat, lon, coords.lat, coords.lon);
      
      return {
        id: element.id.toString(),
        name: element.tags.name || 'Unnamed Hospital',
        latitude: coords.lat,
        longitude: coords.lon,
        distance,
        address: element.tags.address || '',
        phone: element.tags['phone'] || '',
        emergency: element.tags['emergency'] === 'yes'
      };
    }).sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    // Fallback to mock data with real distances
    return mockHospitals.map(hospital => ({
      ...hospital,
      distance: calculateDistance(
        lat,
        lon,
        hospital.latitude,
        hospital.longitude
      )
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }
};

// Finds nearest hospitals from the current location
export const findNearestHospitals = async (
  currentLocation: [number, number],
  limit = 5
): Promise<Hospital[]> => {
  try {
    const hospitals = await fetchNearbyHospitals(currentLocation);
    return hospitals.slice(0, limit);
  } catch (error) {
    console.error('Error finding nearest hospitals:', error);
    return [];
  }
};
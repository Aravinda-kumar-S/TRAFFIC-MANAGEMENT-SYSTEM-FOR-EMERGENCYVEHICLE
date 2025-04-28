import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hospital, RouteInfo } from '../types';
import { Loader, Building2, Navigation, AlertTriangle, Clock } from 'lucide-react';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EmergencyMapProps {
  currentLocation: [number, number] | null;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital) => void;
  isLoadingHospitals: boolean;
}

const EmergencyMap: React.FC<EmergencyMapProps> = ({
  currentLocation,
  hospitals,
  selectedHospital,
  onSelectHospital,
  isLoadingHospitals
}) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center text-gray-500">
          <Loader className="animate-spin h-8 w-8 mb-2" />
          <span>Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Left Sidebar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Current Location Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Navigation className="w-4 h-4 mr-1" /> Current Location
          </h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter address or coordinates"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
              Use My Location
            </button>
          </div>
        </div>

        {/* Route Info Section */}
        {selectedHospital && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Route Information</h3>
            <div className="bg-gray-50 rounded-md p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-medium">502 m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Time:</span>
                <span className="font-medium">5-10 min</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="text-sm font-medium text-gray-700 mb-1">Traffic Factors:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Early Morning</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Saturday</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Cloudy</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="text-sm font-medium text-gray-700 mb-1">Traffic Incidents:</div>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Minor collision, right lane blocked
                  </div>
                  <div className="flex items-center text-xs text-orange-600">
                    <Clock className="w-3 h-3 mr-1" /> Road construction causing delays
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Hospitals Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Nearby Hospitals</h3>
            {isLoadingHospitals && <Loader className="animate-spin h-4 w-4 text-blue-500" />}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {hospitals.map(hospital => (
              <button
                key={hospital.id}
                className={`
                  w-full text-left p-3 rounded-md transition-colors
                  ${selectedHospital?.id === hospital.id 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
                onClick={() => onSelectHospital(hospital)}
              >
                <div className="font-medium flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                  {hospital.name}
                </div>
                <div className="text-xs text-gray-500 ml-6 mt-1">
                  {hospital.distance?.toFixed(1)} km away
                  {hospital.emergency && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                      Emergency
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-12rem)]">
        <MapContainer
          center={currentLocation}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={currentLocation}>
            <Popup>Your Location</Popup>
          </Marker>

          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.latitude, hospital.longitude]}
              eventHandlers={{
                click: () => onSelectHospital(hospital),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{hospital.name}</h3>
                  <p className="text-sm text-gray-600">
                    Distance: {hospital.distance?.toFixed(1)} km
                  </p>
                  {hospital.emergency && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      24/7 Emergency
                    </span>
                  )}
                  <button
                    onClick={() => onSelectHospital(hospital)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Select Hospital
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedHospital && (
            <Polyline
              positions={[
                currentLocation,
                [selectedHospital.latitude, selectedHospital.longitude]
              ]}
              color="#3B82F6"
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default EmergencyMap;
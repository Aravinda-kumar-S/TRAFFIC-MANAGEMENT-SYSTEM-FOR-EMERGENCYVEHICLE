import { Hospital } from '../types';

// Mock data for nearby hospitals
export const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Central Hospital',
    latitude: 40.7128,
    longitude: -74.0060,
    distance: 2.3
  },
  {
    id: '2',
    name: 'Emergency Medical Center',
    latitude: 40.7200,
    longitude: -74.0100,
    distance: 3.1
  },
  {
    id: '3',
    name: 'North Community Hospital',
    latitude: 40.7300,
    longitude: -74.0000,
    distance: 4.5
  },
  {
    id: '4',
    name: 'South Medical Complex',
    latitude: 40.7000,
    longitude: -74.0200,
    distance: 1.8
  },
  {
    id: '5',
    name: 'West Emergency Care',
    latitude: 40.7150,
    longitude: -74.0300,
    distance: 3.7
  }
];
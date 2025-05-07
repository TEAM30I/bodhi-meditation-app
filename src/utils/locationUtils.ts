
// Utility functions for location-based features
import { DEFAULT_LOCATION } from '@/constants';

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Get current location of the user
export async function getCurrentLocation(): Promise<{latitude: number, longitude: number}> {
  try {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting current location:', error);
            // Fallback to default location
            resolve(DEFAULT_LOCATION);
          },
          { timeout: 10000, maximumAge: 60000 }
        );
      });
    } else {
      console.warn('Geolocation is not supported by this browser.');
      return DEFAULT_LOCATION;
    }
  } catch (error) {
    console.error('Error in getCurrentLocation:', error);
    return DEFAULT_LOCATION;
  }
}

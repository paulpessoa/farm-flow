import axios from 'axios';

interface GeocodingResult {
  name: string;
  lat: string;
  lon: string;
}

export const geocodeAddress = async (address: string) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      }
    });

    if (response.data.length > 0) {
      const result: GeocodingResult = response.data[0];
      return {
        fullAddress: result.name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error', error);
    return null;
  }
};
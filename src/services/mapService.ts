import axios from "axios";
import { Address } from "../types";

const nominatimApi = axios.create({
  baseURL: "https://nominatim.openstreetmap.org",
  params: {
    format: "json",
  },
});

export const searchAddress = async (
  searchTerm: string
): Promise<Address | null> => {
  if (!searchTerm.trim()) {
    return null;
  }

  try {
    const { data } = await nominatimApi.get("/search", {
      params: { q: searchTerm },
    });

    if (!data || data.length === 0) return null;

    const result = data[0];
    return {
      fullAddress: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
  } catch (error) {
    console.error("Error Search Address:", error);
    return null;
  }
};

import axios from "axios";
import { Farm, CropType } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const getFarms = async (): Promise<Farm[]> => {
  const response = await api.get<Farm[]>("/farms");
  return response.data;
};

export const getFarmById = async (id: string): Promise<Farm> => {
  const response = await api.get<Farm>(`/farms/${id}`);
  return response.data;
};

export const getCropTypes = async (): Promise<CropType[]> => {
  const response = await api.get<CropType[]>("/crop-types");
  return response.data;
};


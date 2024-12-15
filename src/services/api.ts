import axios from "axios";
import { Farm, CropType } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getFarms = async (): Promise<Farm[]> => {
  const response = await api.get<Farm[]>("/farms");
  return response.data;
};

export const getFarmById = async (id: string): Promise<Farm> => {
  const response = await api.get<Farm>(`/farms/${id}`);
  return response.data;
};

export const postFarm = async (farm: Omit<Farm, "id">): Promise<Farm> => {
  const response = await api.post<Farm>("/farms", farm);
  return response.data;
};

export const putFarm = async (farm: Farm): Promise<Farm> => {
  const response = await api.put<Farm>(`/farms/${farm.id}`, farm);
  return response.data;
};

export const deleteFarm = async (id: string): Promise<unknown> => {
  const response = await api.delete(`/farms/${id}`);
  return response.data;
};

export const getCropTypes = async (): Promise<CropType[]> => {
  const response = await api.get<CropType[]>("/crop-types");
  return response.data;
};

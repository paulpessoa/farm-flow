import { CropType } from "../types";

export function getCropTypeName(
  cropTypes: CropType[] | undefined,
  id: string
): string {
  if (!cropTypes) return "Unknown";
  const cropType = cropTypes.find((crop) => crop.id === id);
  return cropType ? cropType.name : "Unknown";
}

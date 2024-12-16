import { CropType } from "../types";

export function getCropTypeName(
  cropTypes: CropType[] | undefined,
  id: string
): string {
  if (!cropTypes) return "Unknown";
  const cropType = cropTypes.find((crop) => crop.id === id);
  return cropType ? cropType.name : "Unknown";
}

export const useAreaConversion = () => {
  const convertArea = (
    value: number,
    fromUnit: "hectares" | "acres",
    toUnit: "hectares" | "acres"
  ): number => {
    if (fromUnit === toUnit) return parseFloat(value.toFixed(2));
    const convertedValue =
      fromUnit === "hectares" ? value * 2.47105 : value / 2.47105;
    return parseFloat(convertedValue.toFixed(2));
  };

  return { convertArea };
};

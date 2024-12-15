export interface Farm {
  landArea?: number;
  landUnit?: string;
  id?: string;
  farmName: string;
  totalLandArea?: number;
  totalLandUnit?: "hectares" | "acres";
  address: Address;
  cropProductions?: CropProduction[];
  createdAt?: string;
}

export interface CropProduction {
  id: number;
  cropTypeId: number;
  area: number;
  unit: "hectares" | "acres";
  isIrrigated: boolean;
  isInsured: boolean;
}

export interface CropType {
  id: string;
  name: string;
}

export interface Address {
  fullAddress?: string;
  latitude: number;
  longitude: number;
  coordinates?: [number, number][];
}

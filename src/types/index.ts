export interface Farm {
  id?: string;
  farmName: string;
  landArea?: number;
  landUnit?: string;
  address: Address;
  cropProductions?: CropProduction[];
  createdAt?: string;
}

export interface CropProduction {
  id: number;
  cropTypeId: number;
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
  coordinates?: [number, number][]
}

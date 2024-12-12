export interface Farm {
  id: string;
  farmName: string;
  landArea: number;
  landUnit: string;
  cropProductions: CropProduction[];
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

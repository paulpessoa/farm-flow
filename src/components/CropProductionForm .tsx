import React from "react";
import { Control, Controller } from "react-hook-form";
import { CropType, Farm } from "../types";

interface CropProductionProps {
  control: Control<Farm>;
  index: number;
  cropTypes: CropType[];
  onRemove: (index: number) => void;
}

const CropProductionForm: React.FC<CropProductionProps> = ({
  control,
  index,
  cropTypes, onRemove
}) => (
  <div
    className="border rounded-md p-4 space-y-3 bg-gray-50"
    data-testid={`crop-production-${index}`}
  >
     <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-500 font-bold hover:text-red-700 float-right"
        data-testid={`button-remove-crop-${index}`}
      >
        ✕
      </button>
    <div className="flex-1">
      <label
        htmlFor={`cropProductions.${index}.cropTypeId`}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Crop Type
      </label>
      <Controller
        name={`cropProductions.${index}.cropTypeId`}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            data-testid={`select-crop-type-${index}`}
          >
            {cropTypes.map((cropType: CropType) => (
              <option key={cropType.id} value={cropType.id}>
                {cropType.name}
              </option>
            ))}
          </select>
        )}
      />
    </div>

    <div className="flex space-x-4">
      <Controller
        name={`cropProductions.${index}.isIrrigated`}
        control={control}
        render={({ field: { value, onChange } }) => (
          <label className="inline-flex items-center flex-1">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              data-testid={`checkbox-irrigated-${index}`}
            />
            <span className="ml-2">Is Irrigated</span>
          </label>
        )}
      />

      <Controller
        name={`cropProductions.${index}.isInsured`}
        control={control}
        render={({ field: { value, onChange } }) => (
          <label className="inline-flex items-center flex-1">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              data-testid={`checkbox-insured-${index}`}
            />
            <span className="ml-2">Is Insured</span>
          </label>
        )}
      />
    </div>

    <div className="flex space-x-4">
      <div className="flex-1">
        <label htmlFor={`cropProductions.${index}.area`} className="block text-sm font-medium text-gray-700 mb-1">
          Crop Area
        </label>
        <Controller
          name={`cropProductions.${index}.area`}
          control={control}
          render={({ field }) => (
            <input
              id={`cropProductions.${index}.area`}
              type="number"
              {...field}
              className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
              placeholder="123"
              data-testid={`input-crop-area-${index}`}
            />
          )}
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor={`cropProductions.${index}.unit`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Unit of measure
        </label>
        <Controller
          name={`cropProductions.${index}.unit`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
              data-testid={`select-crop-unit-${index}`}
            >
              <option value="hectares">Hectares</option>
              <option value="acres">Acres</option>
            </select>
          )}
        />
      </div>
    </div>
  </div>
);

export default CropProductionForm;
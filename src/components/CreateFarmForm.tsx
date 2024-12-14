
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { createFarm, getCropTypes } from '../services/api';
import { CropProduction, CropType, Farm } from '../types';

const CreateFarmForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [farmName, setFarmName] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnit, setLandUnit] = useState('hectares');
  const [address, setAddress] = useState('');
  const [cropProductions, setCropProductions] = useState<CropProduction[]>([]);


  const { data: cropTypes } = useQuery<CropType[]>({
    queryKey: ['cropTypes'],
    queryFn: getCropTypes
  });

  const createFarmMutation = useMutation({
    mutationFn: createFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      // Reset form
      setFarmName('');
      setLandArea('');
      setLandUnit('hectares');
      setAddress('');
      setCropProductions([]);
    },
  });




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm: Omit<Farm, 'id'> = {
      farmName,
      landArea: Number(landArea),
      landUnit,
      address,
      cropProductions: cropProductions.map((cp, index) => ({ ...cp, id: index + 1 })),
      createdAt: new Date().toISOString(),
    };
    createFarmMutation.mutate(newFarm);
  };

  const addCropProduction = () => {
    setCropProductions([...cropProductions, { id: cropProductions.length + 1, cropTypeId: 1, isIrrigated: false, isInsured: false }]);
  };



  const updateCropProduction = (
    index: number,
    field: keyof CropProduction,
    value: string | number | boolean
  ) => {
    const updatedProductions = [...cropProductions];
    updatedProductions[index] = {
      ...updatedProductions[index],
      [field]: value
    };
    setCropProductions(updatedProductions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6">
      <div>
        <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
          Farm Name
        </label>
        <input
          type="text"
          id="farmName"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">
          Land Area
        </label>
        <input
          type="number"
          id="landArea"
          value={landArea}
          onChange={(e) => setLandArea(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="landUnit" className="block text-sm font-medium text-gray-700">
          Unit of Measure
        </label>
        <select
          id="landUnit"
          value={landUnit}
          onChange={(e) => setLandUnit(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="hectares">Hectares</option>
          <option value="acres">Acres</option>
        </select>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Crop Productions</h3>
        {cropTypes && cropProductions.map((production, index) => (
          <div key={index} className="mt-2 p-4 border rounded">
            <label htmlFor={`cropType-${index}`} className="block text-sm font-medium text-gray-700">
              Crop Type
            </label>
            <select
              id={`cropType-${index}`}
              value={production.cropTypeId}
              onChange={(e) => updateCropProduction(index, 'cropTypeId', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              {cropTypes.map((cropType: CropType) => (
                <option key={cropType.id} value={cropType.id}>
                  {cropType.name}
                </option>
              ))}
            </select>

            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={production.isIrrigated}
                  onChange={(e) => updateCropProduction(index, 'isIrrigated', e.target.checked)}
                  className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <span className="ml-2">Is Irrigated</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={production.isInsured}
                  onChange={(e) => updateCropProduction(index, 'isInsured', e.target.checked)}
                  className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <span className="ml-2">Is Insured</span>
              </label>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCropProduction}
          className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Crop Production
        </button>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Farm
        </button>
      </div>
    </form>
  );
};

export default CreateFarmForm;

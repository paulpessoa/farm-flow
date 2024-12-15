import React, { useState } from 'react';
import { Leaf, LandPlotIcon, MapPinHouseIcon } from 'lucide-react';
import { usePostFarm } from '../hooks/usePostFarm';
import { geocodeAddress } from '../services/geocoding';
import { getCropTypes } from '../services/api';
import { Address, CropProduction, CropType, Farm } from '../types';
import { useQuery } from '@tanstack/react-query';
import { MapComponent } from './MapComponent';
import GenericModal from './GenericModal';
import { toast } from 'react-toastify';


interface CreateFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFarmModal: React.FC<CreateFarmModalProps> = ({ isOpen, onClose }) => {
  const createFarmMutation = usePostFarm();
  const { data: cropTypes } = useQuery<CropType[]>({
    queryKey: ['cropTypes'],
    queryFn: getCropTypes
  });

  const [farmName, setFarmName] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnit, setLandUnit] = useState('hectares');
  const [addressDetails, setAddressDetails] = useState<Address>({
    latitude: 53.0017819,
    longitude: -0.1142127,
    fullAddress: "Hill Farm"
  });
  const [address, setAddress] = useState('');
  const [cropProductions, setCropProductions] = useState<CropProduction[]>([]);

  const handleAddressSearch = async () => {
    const geoResult = await geocodeAddress(address);
    if (geoResult) {
      setAddressDetails(geoResult);
    } else {
      alert('Address not found. Please try a different address.');
    }
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm: Omit<Farm, 'id'> = {
      farmName,
      landArea: Number(landArea),
      landUnit,
      address: addressDetails,
      cropProductions: cropProductions.map((cp, index) => ({ ...cp, id: index + 1 })),
      createdAt: new Date().toISOString(),
    };
    createFarmMutation.mutate(newFarm, {
      onSuccess: () => {
        toast.success('Farm created successfully!');
        onClose(); // Close modal on successful creation
      },
      onError: (error) => {
        toast.error('Failed to create farm. Please try again.');
        console.error('Farm creation error:', error);
      }
    });
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





















    <GenericModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white pt-6 max-w-4xl mx-auto">
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
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
          />
        </div>

        <div className='flex space-x-4'>
          <div className='flex-1'>
            <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">
              Land Area
            </label>
            <input
              type="number"
              id="landArea"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            />
          </div>

          <div className='flex-1'>
            <label htmlFor="landUnit" className="block text-sm font-medium text-gray-700">
              Unit of Measure
            </label>
            <select
              id="landUnit"
              value={landUnit}
              onChange={(e) => setLandUnit(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            >
              <option value="hectares">Hectares</option>
              <option value="acres">Acres</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Crop Productions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropTypes && cropProductions.map((production, index) => (
              <div key={index} className="border rounded-md p-4 space-y-3 bg-gray-50">
                <div>
                  <label htmlFor={`cropType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Type
                  </label>
                  <select
                    id={`cropType-${index}`}
                    value={production.cropTypeId}
                    onChange={(e) => updateCropProduction(index, 'cropTypeId', Number(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                  >
                    {cropTypes.map((cropType: CropType) => (
                      <option key={cropType.id} value={cropType.id}>
                        {cropType.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4">
                  <label className="inline-flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={production.isIrrigated}
                      onChange={(e) => updateCropProduction(index, 'isIrrigated', e.target.checked)}
                      className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                    <span className="ml-2">Is Irrigated</span>
                  </label>

                  <label className="inline-flex items-center flex-1">
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
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={addCropProduction}
              className="flex items-center justify-center mx-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <LandPlotIcon className="mr-2 h-4 w-4" />
              Add Crop Production
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="flex items-center justify-center mx-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <MapPinHouseIcon className="mr-2 h-4 w-4" />
              Search
            </button>
          </div>

        </div>

        <MapComponent farm={{
          farmName: farmName || 'New Farm',
          address: addressDetails,
        }} />

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Leaf className="mr-2 h-4 w-4" />
            Create Farm
          </button>
        </div>
      </form>
    </GenericModal>
  );
};

export default CreateFarmModal;
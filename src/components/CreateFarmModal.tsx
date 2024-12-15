import React, { useState, useMemo, useCallback } from 'react';
import { Leaf, LandPlotIcon, MapPinHouseIcon } from 'lucide-react';
import { usePostFarm } from '../hooks/usePostFarm';
import { geocodeAddress } from '../services/geocoding';
import { getCropTypes } from '../services/api';
import { Address, CropProduction, CropType, Farm } from '../types';
import { useQuery } from '@tanstack/react-query';
import { MapComponent } from './MapComponent';
import GenericModal from './GenericModal';
import { toast } from 'react-toastify';
import { usePutFarm } from '../hooks/usePutFarm';

interface CreateFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFarm?: Farm;
}

const CreateFarmModal: React.FC<CreateFarmModalProps> = ({ isOpen,
  onClose,
  initialFarm }) => {
  const createFarmMutation = usePostFarm();
  const updateFarmMutation = usePutFarm();
  const { data: cropTypes } = useQuery<CropType[]>({
    queryKey: ['cropTypes'],
    queryFn: getCropTypes
  });

  const [farmName, setFarmName] = useState(initialFarm?.farmName || '');
  const [totalLandUnit, setTotalLandUnit] = useState<'hectares' | 'acres'>(
    initialFarm?.totalLandUnit || 'hectares'
  );
  const [addressDetails, setAddressDetails] = useState<Address>({
    latitude: initialFarm?.address.latitude || 53.0017819,
    longitude: initialFarm?.address.longitude || -0.1142127,
    fullAddress: initialFarm?.address.fullAddress || ""
  });
  const [address, setAddress] = useState(addressDetails.fullAddress || '');
  const [cropProductions, setCropProductions] = useState<CropProduction[]>(
    initialFarm?.cropProductions || []
  );

  // Utility function to convert between hectares and acres
  const convertArea = (value: number, fromUnit: 'hectares' | 'acres', toUnit: 'hectares' | 'acres'): number => {
    if (fromUnit === toUnit) return value;
    return fromUnit === 'hectares'
      ? value * 2.47105 // hectares to acres
      : value / 2.47105; // acres to hectares
  };

  // Calculate total land area across all crop productions
  const totalCropArea = useMemo(() => {
    return cropProductions.reduce((total, production) => {
      const convertedArea = convertArea(production.area, production.unit, totalLandUnit);
      return total + convertedArea;
    }, 0);
  }, [cropProductions, totalLandUnit]);

  const handleAddressSearch = useCallback(async () => {
    try {
      const geoResult = await geocodeAddress(address);
      if (geoResult) {
        // Update both address details and the full address string
        setAddressDetails({
          latitude: geoResult.latitude,
          longitude: geoResult.longitude,
          fullAddress: geoResult.fullAddress || address
        });
        setAddress(geoResult.fullAddress || address);
      } else {
        toast.error('Address not found. Please try a different address.');
      }
    } catch (error) {
      toast.error('Error searching address');
      console.error('Address search error:', error);
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const farmData: Omit<Farm, 'id'> = {
      farmName,
      totalLandArea: totalCropArea,
      totalLandUnit,
      address: addressDetails,
      cropProductions: cropProductions.map((cp, index) => ({ ...cp, id: index + 1 })),
      createdAt: new Date().toISOString(),
    };

    if (initialFarm) {
      updateFarmMutation.mutate({ ...initialFarm, ...farmData }, {
        onSuccess: () => {
          toast.success('Farm updated successfully!');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to update farm. Please try again.');
          console.error('Farm update error:', error);
        }
      });
    } else {
      createFarmMutation.mutate(farmData, {
        onSuccess: () => {
          toast.success('Farm created successfully!');
          onClose();
        },
        onError: (error) => {
          toast.error('Failed to create farm. Please try again.');
          console.error('Farm creation error:', error);
        }
      });
    }
  };

  const addCropProduction = () => {
    setCropProductions([
      ...cropProductions,
      {
        id: cropProductions.length + 1,
        cropTypeId: 1,
        area: 0,
        unit: totalLandUnit,
        isIrrigated: false,
        isInsured: false
      }
    ]);
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
    <GenericModal title={initialFarm ? "Edit Farm" : "Create a new farm"} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white pt-6 max-w-4xl mx-auto">
        <div>
          <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
            Farm Name
          </label>
          <input
            placeholder="Exemple: Green Gables"
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
            <label htmlFor="totalLandUnit" className="block text-sm font-medium text-gray-700 mb-1">
              Total Land Unit
            </label>
            <select
              id="totalLandUnit"
              value={totalLandUnit}
              onChange={(e) => setTotalLandUnit(e.target.value as 'hectares' | 'acres')}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            >
              <option value="hectares">Hectares</option>
              <option value="acres">Acres</option>
            </select>
          </div>
          <div className='flex-1'>
            <label htmlFor='totalCropArea' className="block text-sm font-medium text-gray-700">
              Total Crop Area
            </label>
            <input
              type="text"
              id='totalCropArea'
              value={`${totalCropArea.toLocaleString()} ${totalLandUnit}`}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Crop Productions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropTypes && cropProductions.map((production, index) => (
              <div key={index} className="border rounded-md p-4 space-y-3 bg-gray-50">
                <div className="flex-1">
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
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Area
                    </label>
                    <input
                      type="number"
                      value={production.area}
                      onChange={(e) => updateCropProduction(index, 'area', Number(e.target.value))}
                      className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                      placeholder="123"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`unit-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Unit of measure
                    </label>
                    <select
                      id={`unit-${index}`}
                      value={production.unit}
                      onChange={(e) => updateCropProduction(index, 'unit', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                    >
                      <option value="hectares">Hectares</option>
                      <option value="acres">Acres</option>
                    </select>
                  </div>
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
              Add Crop
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

        <MapComponent
          key={`${addressDetails.latitude}-${addressDetails.longitude}`}
          farm={{
            farmName: farmName || 'New Farm',
            address: addressDetails,
          }}
        />

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
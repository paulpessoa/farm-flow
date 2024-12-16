import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Leaf, LandPlotIcon, MapPinHouseIcon } from 'lucide-react';
import { usePostFarm } from '../hooks/usePostFarm';
import { geocodeAddress } from '../services/geocoding';
import { getCropTypes } from '../services/api';
import { CropType, Farm } from '../types';
import { useQuery } from '@tanstack/react-query';
import { MapComponent } from './MapComponent';
import GenericModal from './GenericModal';
import { toast } from 'react-toastify';
import { usePutFarm } from '../hooks/usePutFarm';
import { useAreaConversion } from '../utils';
import CropProductionForm from './CropProductionForm ';

interface CreateFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFarm?: Farm;
}

const CreateFarmModal: React.FC<CreateFarmModalProps> = ({
  isOpen,
  onClose,
  initialFarm
}) => {
  const { convertArea } = useAreaConversion();
  const createFarmMutation = usePostFarm();
  const updateFarmMutation = usePutFarm();

  const { data: cropTypes } = useQuery<CropType[]>({
    queryKey: ['cropTypes'],
    queryFn: getCropTypes
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty }
  } = useForm<Farm>({
    defaultValues: initialFarm ? {
      ...initialFarm,
      // Prepare initial form values
    } : {
      farmName: '',
      totalLandUnit: 'hectares',
      address: {
        latitude: 53.0017819,
        longitude: -0.1142127,
        fullAddress: ''
      },
      cropProductions: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cropProductions'
  });

  const watchCropProductions = watch('cropProductions') || [];
  const watchTotalLandUnit = watch('totalLandUnit');

  // Calculate total crop area
  const totalCropArea = watchCropProductions.reduce((total, production) => {
    const area = Number(production.area) || 0;
    const unit = production.unit || watchTotalLandUnit || 'hectares';
    const convertedArea = convertArea(area, unit, watchTotalLandUnit || 'hectares');
    return total + convertedArea;
  }, 0);

  const onSubmit = (data: Farm) => {
    const farmData: Omit<Farm, 'id'> = {
      ...data,
      totalLandArea: totalCropArea,
      ...(initialFarm ? {} : { createdAt: new Date().toISOString() }),
    };

    if (initialFarm) {
      updateFarmMutation.mutate({ ...initialFarm, ...farmData }, {
        onSuccess: () => {
          toast.success('Farm updated successfully!');
          onClose();
        },
        onError: () => {
          toast.error('Failed to update farm. Please try again.');
        }
      });
    } else {
      createFarmMutation.mutate(farmData, {
        onSuccess: () => {
          toast.success('Farm created successfully!');
          onClose();
        },
        onError: () => {
          toast.error('Failed to create farm. Please try again.');
        }
      });
    }
  };

  const handleAddressSearch = async () => {
    const fullAddress = watch('address.fullAddress');
    try {
      const geoResult = await geocodeAddress(fullAddress ?? "");
      if (geoResult) {
        setValue('address', {
          latitude: geoResult.latitude,
          longitude: geoResult.longitude,
          fullAddress: geoResult.fullAddress || fullAddress
        });
      } else {
        toast.error('Address not found. Please try a different address.');
      }
    } catch (error) {
      toast.error('Error searching address');
      console.log(error);
    }
  };

  const isFormValid = () => {
    return (
      watch('farmName') &&
      watch('address.fullAddress') &&
      watchCropProductions.length > 0 &&
      watchCropProductions.every(prod => prod.area && prod.cropTypeId)
    );
  };

  return (
    <GenericModal
      title={initialFarm ? "Edit Farm" : "Create a new farm"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white pt-6 max-w-4xl mx-auto"
        data-testid="tt-farm-form"
      >
        {/* Farm Name Input */}
        <div>
          <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
            Farm Name
          </label>
          <input
            {...register('farmName', { required: true })}
            placeholder="Example: Green Gables"
            type="text"
            id="farmName"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
            data-testid="tt-input-farm-name"
          />
        </div>

        {/* Land Unit and Total Crop Area */}
        <div className='flex space-x-4'>
          <div className='flex-1'>
            <label htmlFor="totalLandUnit" className="block text-sm font-medium text-gray-700 mb-1">
              Total Land Unit
            </label>
            <Controller
              name="totalLandUnit"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
                  data-testid="tt-select-land-unit"
                >
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                </select>
              )}
            />
          </div>
          <div className='flex-1'>
            <label htmlFor='totalCropArea' className="block text-sm font-medium text-gray-700">
              Total Crop Area
            </label>
            <input
              id='totalCropArea'
              type="text"
              value={`${totalCropArea.toLocaleString()} ${watchTotalLandUnit}`}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 px-3 py-2"
              data-testid="tt-total-crop-area"
            />
          </div>
        </div>

        {/* Crop Productions */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Crop Productions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropTypes && fields.map((field, index) => (
              <CropProductionForm
                key={field.id}
                control={control}
                index={index}
                cropTypes={cropTypes}
                onRemove={remove}
              />
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => append({
                id: fields.length + 1,
                cropTypeId: cropTypes && cropTypes.length > 0 ? Number(cropTypes[0].id) : 1,
                area: 0,
                unit: watchTotalLandUnit || 'hectares',
                isIrrigated: false,
                isInsured: false
              })}
              className="flex items-center justify-center mx-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              data-testid="tt-button-add-crop"
            >
              <LandPlotIcon className="mr-2 h-4 w-4" />
              Add Crop
            </button>
          </div>
        </div>

        {/* Address Section */}
        <div className="md:col-span-2">
          <label htmlFor="address.fullAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="flex space-x-2">
            <input
              {...register('address.fullAddress')}
              type="text"
              className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
              data-testid="tt-input-address"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="flex items-center justify-center mx-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              data-testid="tt-button-search-address"
            >
              <MapPinHouseIcon className="mr-2 h-4 w-4" />
              Search
            </button>
          </div>
        </div>

        {/* Map Component */}
        <MapComponent
          key={`${watch('address.latitude')}-${watch('address.longitude')}`}
          farm={{
            farmName: watch('farmName') || 'New Farm',
            address: watch('address'),
          }}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            disabled={!isDirty || !isFormValid()}
            type="submit"
            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors duration-200 ${!isDirty || !isFormValid()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'text-white bg-indigo-950 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            data-testid="tt-button-submit-farm"
          >
            <Leaf className="mr-2 h-4 w-4" />
            {initialFarm ? 'Update Farm' : 'Create Farm'}
          </button>
        </div>
      </form>
    </GenericModal>
  );
};

export default CreateFarmModal;

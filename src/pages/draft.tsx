import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useGetFarms } from '../hooks/useGetFarms';
import { CropProduction, Farm } from '../types';
import { GenericModal } from '../components/GenericModal';

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2 my-4">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`
            px-4 py-2 border rounded 
            ${currentPage === number
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

const FarmList: React.FC = () => {
  const { data: farms, isLoading, error } = useGetFarms();

  // Control states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Farm>('farmName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const itemsPerPage = 5;

  // Filtering and sorting function
  const processedFarms = useMemo(() => {
    const result = farms?.filter(farm =>
      farm.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.address && farm.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result?.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [farms, searchTerm, sortField, sortDirection]);

  // Pagination
  const paginatedFarms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedFarms?.slice(startIndex, startIndex + itemsPerPage);
  }, [processedFarms, currentPage]);

  // Count irrigated and non-irrigated crops
  const countCropProductions = (cropProductions?: CropProduction[]) => {
    if (!cropProductions) return { irrigated: 0, nonIrrigated: 0 };
    return {
      irrigated: cropProductions.filter(crop => crop.isIrrigated).length,
      nonIrrigated: cropProductions.filter(crop => !crop.isIrrigated).length
    };
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading farms!</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Header */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search farm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex space-x-2">
          <label htmlFor={`cropType`} className="block text-sm font-medium text-gray-700">
            Crop Type
          </label>
          <select
            id={`cropType`}
            value={sortField}
            onChange={(e) => setSortField(e.target.value as keyof Farm)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="farmName">Farm Name</option>
            <option value="landArea">Land Area</option>
          </select>

          {/* Sort Direction Button */}
          <button
            onClick={toggleSortDirection}
            className="border rounded-lg px-3 py-2 bg-white hover:bg-gray-100"
          >
            {sortDirection === 'asc' ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Farms Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Farm Name</th>
              <th className="p-3 border-b">Area</th>
              <th className="p-3 border-b">Address</th>
              <th className="p-3 border-b">Irrigated Crops</th>
              <th className="p-3 border-b">Non-Irrigated Crops</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFarms.map(farm => {
              const cropCounts = countCropProductions(farm.cropProductions);
              return (
                <tr key={farm.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-b">{farm.farmName}</td>
                  <td className="p-3 border-b">{farm.landArea} {farm.landUnit}</td>
                  <td className="p-3 border-b">{farm.address}</td>
                  <td className="p-3 border-b">{cropCounts.irrigated}</td>
                  <td className="p-3 border-b">{cropCounts.nonIrrigated}</td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => setSelectedFarm(farm)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(processedFarms.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />

      {/* Farm Details Modal */}





      
    </div>
  );
};

export default FarmList;
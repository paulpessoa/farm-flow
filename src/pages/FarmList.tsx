import React, { useState } from "react";
import { useGetFarms } from "../hooks/useGetFarms";
import { Farm } from "../types";
import GenericModal from "../components/GenericModal";
import FarmDetail from "../components/FarmDetail";
import DeleteFarmModal from "../components/DeleteFarmModal";
import CreateFarmModal from "../components/CreateFarmModal";
import { ZoomInIcon, TrashIcon, Edit2Icon } from 'lucide-react';

const FarmList: React.FC = () => {
  const { data: farms, isLoading, error } = useGetFarms();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const handleDeleteFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setDeleteModalOpen(true);
  };

  const handleDetailFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setDetailModalOpen(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setEditModalOpen(true);
  };

  const filteredAndSortedFarms = farms
    ?.filter((farm) =>
      farm.farmName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        case "oldest":
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
        case "a-z":
          return a.farmName.localeCompare(b.farmName);
        case "z-a":
          return b.farmName.localeCompare(a.farmName);
        default:
          return 0;
      }
    });

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading farms!</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Farm List</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-64">
          <label htmlFor="searchFarm" className="block text-sm font-medium text-gray-700 mb-1">
            Search Farm
          </label>
          <input
            id="searchFarm"
            type="text"
            placeholder="Type a farm name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <label htmlFor="sortOptions" className="block text-sm font-medium text-gray-700 mb-1">
            Sort options
          </label>
          <select
            id="sortOptions"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-3 py-2"
          >
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
      </div>
      {filteredAndSortedFarms && filteredAndSortedFarms.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedFarms.map((farm, index) => (
            <li
              key={farm.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">
                    {farm.farmName}
                  </h3>
                  <p className="text-gray-600">
                    {farm.totalLandArea?.toLocaleString()} {farm.totalLandUnit}
                  </p>
                </div>
                <div className="flex items-center space-x-2"> {/* Added space between buttons */}
                  <button
                    onClick={() => handleDetailFarm(farm)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Farm Details"
                    data-testid="button-detail-farm"
                  >
                    <ZoomInIcon className="h-5 w-5 text-indigo-950" />
                  </button>
                  <button
                    onClick={() => handleEditFarm(farm)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Farm Edit"
                    data-testid={`button-edit-farm-${index}`} // Adicionando data-testid para o botão de edição
                  >
                    <Edit2Icon className="h-5 w-5 text-indigo-950" />
                  </button>
                  <button
                    onClick={() => handleDeleteFarm(farm)}
                    className="text-red-500 hover:text-red-700"
                    title="Farm Delete"
                    data-testid={`button-delete-farm-${index}`} // Adicionando data-testid para o botão de deleção
                  >
                    <TrashIcon className="h-5 w-5 text-red-550" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        farms?.length ?
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No farms found for "{searchTerm}".</p>
          </div>
          :
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No farms registered.</p>
          </div>
      )}
      <GenericModal
        title='Farm Details'
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      >
        {selectedFarm && <FarmDetail farmId={selectedFarm.id || ""} />}
      </GenericModal>

      <GenericModal
        title='Edit Farm'
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        {selectedFarm && (
          <CreateFarmModal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            initialFarm={selectedFarm}
          />
        )}
      </GenericModal>

      <DeleteFarmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        id={selectedFarm?.id ?? ""}
      />
    </div>
  );
};

export default FarmList;


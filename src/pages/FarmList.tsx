import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetFarms } from "../hooks/useGetFarms";
import { Farm } from "../types";
import GenericModal from "../components/GenericModal";
import FarmDetail from "../components/FarmDetail";
import DeleteFarmModal from "../components/DeleteFarmModal";
import { ZoomInIcon, TrashIcon, Edit2Icon } from "lucide-react";

const FarmList: React.FC = () => {
  const { data: farms, isLoading, error } = useGetFarms();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (id && farms) {
      const farm = farms.find((f) => f.id === id);
      if (farm) setSelectedFarm(farm);
    } else {
      setSelectedFarm(null);
    }
  }, [id, farms]);

  const handleDeleteFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setDeleteModalOpen(true);
  };

  const handleDetailFarm = (farm: Farm) => {
    navigate(`/farms/${farm.id}`);
    setSelectedFarm(farm);
    setDetailModalOpen(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setEditModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading farms!</div>;

  return (
    <div className="container mx-auto items-center justify-between p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Farm List</h2>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {farms?.map((farm) => (
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
                  {farm.landArea} {farm.landUnit}
                </p>
              </div>
              <div className="flex items-center space-x-2"> {/* Added space between buttons */}
                <button
                  onClick={() => handleDetailFarm(farm)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Farm Details"
                >
                  <ZoomInIcon className="h-5 w-5 text-indigo-950" />
                </button>
                <button
                  onClick={() => handleEditFarm(farm)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Farm Edit"
                >
                  <Edit2Icon className="h-5 w-5 text-indigo-950" />
                </button>
                <button
                  onClick={() => handleDeleteFarm(farm)}
                  className="text-red-500 hover:text-red-700"
                  title="Farm Delete"
                >
                  <TrashIcon className="h-5 w-5 text-red-550" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <GenericModal
        title='Farm Details'
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      >
        {selectedFarm && <FarmDetail farmId={selectedFarm.id} />}
      </GenericModal>

      <GenericModal
        title='Edit Farm'
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        {selectedFarm && (
          <div>
            Edit form for {selectedFarm.farmName}
          </div>
        )}
      </GenericModal>

      <DeleteFarmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        id={selectedFarm?.id || ""}
      />
    </div>
  );
};

export default FarmList;
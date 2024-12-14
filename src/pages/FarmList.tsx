import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetFarms } from '../hooks/useGetFarms';
import { Farm } from '../types';
import GenericModal from '../components/GenericModal';
import FarmDetail from '../components/FarmDetail';
import { ScanEye } from "lucide-react";

const FarmList: React.FC = () => {
  const { data: farms, isLoading, error } = useGetFarms();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  useEffect(() => {
    if (id && farms) {
      const farm = farms.find((f) => f.id === id);
      if (farm) setSelectedFarm(farm);
    } else {
      setSelectedFarm(null);
    }
  }, [id, farms]);

  const handleCloseModal = () => {
    navigate('/farms');
  };

  const handleOpenModal = (farm: Farm) => {
    navigate(`/farms/${farm.id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading farms!</div>;

  return (
    <div className="container mx-auto items-center justify-between p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Farm List</h2>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {farms?.map((farm) => (
          <li key={farm.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              {/* <Link to={`/farm/${farm.id}`} className="block"> */}
              <h3 className="text-xl font-semibold mb-2 text-primary">{farm.farmName}</h3>
              <p className="text-gray-600">{farm.landArea} {farm.landUnit}</p>
              {/* </Link> */}
              <button
                onClick={() => handleOpenModal(farm)}
                className="text-blue-500 hover:text-blue-700"
                title="View Farm Details"
              >
                <ScanEye className="h-5 w-5 text-indigo-950" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <GenericModal title='Farm Operations' onClose={handleCloseModal} isOpen={!!selectedFarm}>
        {selectedFarm && <FarmDetail farmId={selectedFarm.id} />}
      </GenericModal>
    </div>
  );
};

export default FarmList;

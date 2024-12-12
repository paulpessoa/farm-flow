import React from 'react';
import { Link } from 'react-router-dom';
import { useGetFarms } from '../hooks/useGetFarms';

const FarmList: React.FC = () => {
  const { data: farms, isLoading, error } = useGetFarms();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading farms!</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Farm List</h1>
      <ul className="space-y-2">
        {farms?.map((farm) => (
          <li key={farm.id} className="border p-2 rounded">
            <Link to={`/farm/${farm.id}`} className="text-blue-500 hover:underline">
              {farm.farmName} - {farm.landArea} {farm.landUnit}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmList;


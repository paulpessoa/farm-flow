import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFarmDetail } from '../hooks/useGetFarmDetail';

const FarmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { farm, cropTypes, isLoading, error } = useGetFarmDetail(id ?? '');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading farm details!</div>;
  if (!farm) return <div>Farm not found!</div>;

  const getCropTypeName = (cropTypeId: number) => {
    const cropType = cropTypes?.find(ct => ct.id === cropTypeId.toString());
    return cropType ? cropType.name : 'Desconhecido';
  };

  return (
    <div className="p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 block">&larr; Voltar para a lista</Link>
      <h1 className="text-2xl font-bold mb-4">{farm.farmName}</h1>
      <div className="mb-4">
        <p><strong>Área:</strong> {farm.landArea} {farm.landUnit}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Produções de Culturas</h2>
      <ul className="list-disc pl-5">
        {farm.cropProductions.map((production) => (
          <li key={production.id} className="mb-2">
            <p><strong>Cultura:</strong> {getCropTypeName(production.cropTypeId)}</p>
            <p><strong>Irrigada:</strong> {production.isIrrigated ? 'Sim' : 'Não'}</p>
            <p><strong>Segurada:</strong> {production.isInsured ? 'Sim' : 'Não'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FarmDetail;


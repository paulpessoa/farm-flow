import { Droplet, Shield, Wheat, Leaf } from 'lucide-react';
import { useGetFarmDetail } from '../hooks/useGetFarmDetail';
import { getCropTypeName } from '../utils';
import { MapComponent } from './MapComponent';

interface FarmDetailProps {
  farmId: string;
}
const FarmDetail: React.FC<FarmDetailProps> = ({
  farmId
}) => {
  const { data: farm, cropTypes, isLoading, error } = useGetFarmDetail(farmId ?? '');

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error farm detail</div>;
  if (!farm) return <div className="flex justify-center p-8">Farm not found</div>;
  if (!farm.cropProductions) return <div className="flex justify-center p-8">Crop Production not found</div>;

  return (

    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">{farm.farmName}</h1>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {`${farm?.totalLandArea?.toLocaleString()} ${farm.totalLandUnit}`}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {farm.cropProductions.map((production, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {production.cropTypeId === 1 ? (
                  <Wheat className="w-8 h-8 text-gray-500" />
                ) : (
                  <Leaf className="w-8 h-8 text-gray-500" />
                )}
                <span className="text-lg font-semibold">
                  {getCropTypeName(cropTypes, String(production.cropTypeId))}
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                {`${production.area.toLocaleString()} ${production.unit}`}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p - 4 rounded - lg ${production.isIrrigated ? 'bg-green-50' : 'bg-orange-50'}`}>
                <div className="flex justify-items-stretch space-x-2">
                  <Droplet className={`w - 5 h - 5 ${production.isIrrigated ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className="font-medium text-right">Irrigated</span>
                </div>
                <span className={`block text-sm text-center ${production.isIrrigated ? 'text-green-800' : 'text-orange-800'}`}>
                  {production.isIrrigated ? 'Yes' : 'No'}
                </span>
              </div>

              <div className={`p - 4 rounded - lg ${production.isInsured ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-2">
                  <Shield className={`w - 5 h - 5 ${production.isInsured ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-medium">Insured</span>
                </div>
                <span className={`block text-sm text-center ${production.isInsured ? 'text-green-800' : 'text-red-800'}`}>
                  {production.isInsured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ))
        }
      </div >

      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapComponent
          farm={farm}
        />
      </div>
    </div >

  );
};

export default FarmDetail;

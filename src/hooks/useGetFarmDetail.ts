import { useQuery } from "@tanstack/react-query";
import { getFarmById, getCropTypes } from "../services/api";
import { Farm, CropType } from "../types";

export const useGetFarmDetail = (id: string) => {
  const farmQuery = useQuery<Farm, Error>({
    queryKey: ["farm", id],
    queryFn: () => getFarmById(id),
  });

  const cropTypesQuery = useQuery<CropType[], Error>({
    queryKey: ["cropTypes"],
    queryFn: getCropTypes,
  });

  return {
    data: farmQuery.data,
    cropTypes: cropTypesQuery.data,
    isLoading: farmQuery.isLoading || cropTypesQuery.isLoading,
    error: farmQuery.error || cropTypesQuery.error,
  };
};

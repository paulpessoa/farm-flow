import { useQuery } from "@tanstack/react-query";
import { getCropTypes } from "../services/api";
import { CropType } from "../types";

export const useGetCrop = () => {
  return useQuery<CropType[], Error>({
    queryKey: ["cropTypes"],
    queryFn: getCropTypes,
  });
};

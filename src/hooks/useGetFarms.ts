import { useQuery } from '@tanstack/react-query';
import { getFarms } from '../services/api';
import { Farm } from '../types';

export const useGetFarms = () => {
  return useQuery<Farm[], Error>({
    queryKey: ['farms'],
    queryFn: getFarms
  });
};


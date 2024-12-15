import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postFarm } from '../services/api';
import { Farm } from '../types';

export const usePostFarm = () => {
  const queryClient = useQueryClient();

  return useMutation<Farm, Error, Omit<Farm, 'id'>>({
    mutationFn: postFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    }
  });
};
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putFarm } from '../services/api';
import { Farm } from '../types';

export const usePutFarm = () => {
    const queryClient = useQueryClient();

    return useMutation<Farm, Error, Farm>({
        mutationFn: putFarm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['farms'] });
        }
    });
};
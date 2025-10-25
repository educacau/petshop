import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {CreatePetDTO, Pet} from '../../../types';

type Response = {data: Pet};

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePetDTO) => {
      const response = await api.post<Response>('/pets', payload);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['pets']});
      if (variables.customerId) {
        queryClient.invalidateQueries({queryKey: ['pets', 'customer', variables.customerId]});
      }
    }
  });
};

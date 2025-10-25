import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Pet, UpdatePetDTO} from '../../../types';

type Response = {data: Pet};

const buildBody = (payload: Omit<UpdatePetDTO, 'id'>) => {
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '');
  return Object.fromEntries(entries);
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, customerId, ...rest}: UpdatePetDTO) => {
      const response = await api.put<Response>(`/pets/${id}`, buildBody(rest));
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

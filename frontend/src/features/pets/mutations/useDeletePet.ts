import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Role} from '../../../types';

type Variables = {
  id: string;
  customerId?: string;
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id}: Variables) => {
      await api.delete(`/pets/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['pets']});
      if (variables.customerId) {
        queryClient.invalidateQueries({queryKey: ['pets', 'customer', variables.customerId]});
      }
    }
  });
};

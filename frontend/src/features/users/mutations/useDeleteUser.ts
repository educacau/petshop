import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Role} from '../../../types';

type Variables = {
  id: string;
  role?: Role;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id}: Variables) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['users']});
      if (variables.role) {
        queryClient.invalidateQueries({queryKey: ['users', variables.role]});
      }
    }
  });
};

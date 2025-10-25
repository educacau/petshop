import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {CreateUserDTO, User} from '../../../types';

type Response = {data: User};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserDTO) => {
      const response = await api.post<Response>('/users', payload);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['users']});
      if (variables.role) {
        queryClient.invalidateQueries({queryKey: ['users', variables.role]});
      }
    }
  });
};

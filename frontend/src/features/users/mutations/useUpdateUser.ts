import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {UpdateUserDTO, User} from '../../../types';

type Response = {data: User};

const buildBody = (data: Omit<UpdateUserDTO, 'id'>) => {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined && value !== '');
  return Object.fromEntries(entries);
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, ...rest}: UpdateUserDTO) => {
      const response = await api.put<Response>(`/users/${id}`, buildBody(rest));
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

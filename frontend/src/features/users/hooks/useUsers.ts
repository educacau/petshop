import {useQuery} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Role, User} from '../../../types';

type UseUsersOptions = {
  role?: Role;
  enabled?: boolean;
};

export const useUsers = ({role, enabled = true}: UseUsersOptions = {}) => {
  return useQuery({
    queryKey: ['users', role ?? 'all'],
    enabled,
    queryFn: async () => {
      const response = await api.get<{data: User[]}>('/users', {
        params: role ? {role} : undefined
      });
      return response.data.data;
    }
  });
};

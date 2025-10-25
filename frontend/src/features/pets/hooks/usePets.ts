import {useQuery} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Pet} from '../../../types';

type UsePetsOptions = {
  mode: 'mine' | 'all';
};

export const usePets = ({mode}: UsePetsOptions) => {
  return useQuery({
    queryKey: ['pets', mode],
    queryFn: async () => {
      const endpoint = mode === 'mine' ? '/pets/me' : '/pets';
      const response = await api.get<{data: Pet[]}>(endpoint);
      return response.data.data;
    }
  });
};

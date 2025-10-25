import {useQuery} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Pet} from '../../../types';

export const usePetsByCustomer = (customerId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['pets', 'customer', customerId ?? 'none'],
    enabled: Boolean(customerId) && enabled,
    queryFn: async () => {
      const response = await api.get<{data: Pet[]}>(`/pets/customer/${customerId}`);
      return response.data.data;
    }
  });
};

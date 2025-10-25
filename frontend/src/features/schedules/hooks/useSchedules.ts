import {useQuery} from '@tanstack/react-query';

import api from '../../../services/api';
import type {Schedule} from '../../../types';

export const useSchedules = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await api.get<{data: Schedule[]}>('/schedules/me');
      return response.data.data;
    }
  });
};

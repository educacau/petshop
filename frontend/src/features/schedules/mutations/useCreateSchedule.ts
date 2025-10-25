import {useMutation, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';
import type {CreateScheduleDTO, Schedule} from '../../../types';

type Response = {data: Schedule};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateScheduleDTO) => {
      const response = await api.post<Response>('/schedules', payload);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['schedules']});
      queryClient.invalidateQueries({queryKey: ['dashboard-summary']});
      if (variables.customerId) {
        queryClient.invalidateQueries({queryKey: ['pets', 'customer', variables.customerId]});
      }
    }
  });
};

import {useMutation, useQueryClient} from '@tanstack/react-query';
import dayjs from 'dayjs';

import api from '../../../services/api';

export const useScheduleActions = () => {
  const queryClient = useQueryClient();

  const refetch = () => {
    queryClient.invalidateQueries({queryKey: ['schedules']});
    queryClient.invalidateQueries({queryKey: ['dashboard-summary']});
  };

  const cancel = useMutation({
    mutationFn: async (scheduleId: string) => {
      await api.patch(`/schedules/${scheduleId}/customer/cancel`);
    },
    onSuccess: () => refetch()
  });

  const reschedule = useMutation({
    mutationFn: async ({scheduleId, date}: {scheduleId: string; date: string}) => {
      await api.patch(`/schedules/${scheduleId}/customer/reschedule`, {
        scheduledAt: dayjs(date).toISOString()
      });
    },
    onSuccess: () => refetch()
  });

  const updateStatus = useMutation({
    mutationFn: async ({scheduleId, status}: {scheduleId: string; status: string}) => {
      await api.patch(`/schedules/${scheduleId}/status`, {status});
    },
    onSuccess: () => refetch()
  });

  return {cancel, reschedule, updateStatus};
};

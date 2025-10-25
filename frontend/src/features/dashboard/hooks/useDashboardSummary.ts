import {useQuery} from '@tanstack/react-query';

import api from '../../../services/api';

export type DashboardSummary = {
  range: {from: string; to: string};
  totalCompleted: number;
  revenue: number;
  petsAttended: number;
  byServiceType: {serviceType: string; total: number}[];
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const response = await api.get<{data: DashboardSummary}>('/schedules/summary');
      return response.data.data;
    }
  });
};

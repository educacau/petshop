import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import api from '../../../services/api';

type BusinessSetting = {
  id: string;
  openingTime: number;
  closingTime: number;
  slotDuration: number;
};

type UpdatePayload = {
  openingTime: number;
  closingTime: number;
  slotDuration: number;
};

export const useBusinessSetting = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['business-setting'],
    queryFn: async () => {
      const response = await api.get<{data: BusinessSetting}>('/settings');
      return response.data.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      const response = await api.put<{data: BusinessSetting}>('/settings', payload);
      return response.data.data;
    },
    onSuccess: data => {
      queryClient.setQueryData(['business-setting'], data);
    }
  });

  return {query, mutation};
};

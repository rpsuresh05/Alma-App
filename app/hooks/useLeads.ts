import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lead } from '@/lib/types';

interface LeadsResponse {
  leads: Lead[];
}

interface FetchLeadsParams {
  search?: string;
  status?: string;
}

export function useLeads() {
  const queryClient = useQueryClient();

  const getLeads = (params?: FetchLeadsParams) => {
    console.log("getLeads", params);
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return useQuery<LeadsResponse>({
      queryKey: ['leads', params],
      queryFn: async () => {
        const response = await fetch(`/api/leads?${queryParams.toString()}`);
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('You must be logged in to view this page');
          }
          throw new Error('Failed to fetch leads');
        }
        return response.json();
      },
    });
  };

  const updateLeadStatus = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: 'PENDING' | 'REACHED_OUT' }) => {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update lead status');
      return response.json();
    },
    onSuccess: () => {
      console.log("updateLeadStatus onSuccess");
      // Invalidate and refetch leads after successful update
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  return { getLeads, updateLeadStatus };
} 
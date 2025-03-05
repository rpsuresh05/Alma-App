import { useQuery, useMutation } from '@tanstack/react-query';

interface Lead {
  id: string;
  name: string;
  email: string;
  // ... other lead properties
}

export function useLeads() {
  const getLeads = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
  });

  const createLead = useMutation({
    mutationFn: async (newLead: Omit<Lead, 'id'>) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (!response.ok) throw new Error('Failed to create lead');
      return response.json();
    },
  });

  return { getLeads, createLead };
} 
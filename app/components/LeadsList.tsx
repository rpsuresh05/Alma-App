"use client";

import { useLeads } from "../hooks/useLeads";

export function LeadsList() {
  const { getLeads } = useLeads();

  if (getLeads.isLoading) return <div>Loading...</div>;
  if (getLeads.error) return <div>Error loading leads</div>;

  return (
    <div>
      {getLeads.data?.map((lead) => (
        <div key={lead.id}>{lead.name}</div>
      ))}
    </div>
  );
}

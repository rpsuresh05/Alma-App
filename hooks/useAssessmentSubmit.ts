import { useMutation } from "@tanstack/react-query";
import type { VisaType } from "@/lib/types";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedInProfile: string;
  visasOfInterest: VisaType[];
  additionalInfo: string;
  resume: File | null;
}

interface SubmitResponse {
  id: string;
  // Add other response fields if needed
}

export function useAssessmentSubmit() {
  return useMutation({
    mutationFn: async ({
      formData,
      formState,
    }: {
      formData: FormData;
      formState: FormState;
    }) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          country: formState.country,
          linkedInProfile: formState.linkedInProfile,
          visasOfInterest: formState.visasOfInterest,
          additionalInfo: formState.additionalInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const lead = await response.json();

      const formDataWithLeadId = new FormData();
      formDataWithLeadId.append("leadId", lead.id);
      for (const [key, value] of formData.entries()) {
        formDataWithLeadId.append(key, value);
      }

      const resumeResponse = await fetch("/api/upload", {
        method: "POST",
        body: formDataWithLeadId,
      });

      if (!resumeResponse.ok) {
        throw new Error("Failed to upload resume");
      }

      const { fileUrl } = await resumeResponse.json();
      return lead as SubmitResponse;
    },
  });
} 
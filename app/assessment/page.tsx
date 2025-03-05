"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import type { VisaType } from "@/lib/types";
import { useAssessmentSubmit } from "@/hooks/useAssessmentSubmit";
import { ButtonLoading } from "@/components/ui/button-loading";

export default function AssessmentPage() {
  const [formState, setFormState] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    linkedInProfile: string;
    visasOfInterest: VisaType[];
    resume: File | null;
    additionalInfo: string;
    error: string | null;
    submitted: boolean;
    leadId: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    linkedInProfile: "",
    visasOfInterest: [],
    resume: null,
    additionalInfo: "",
    error: null,
    submitted: false,
    leadId: "",
  });

  const handleVisaCheckboxChange = (visa: VisaType) => {
    setFormState((prev) => {
      const visas = prev.visasOfInterest.includes(visa)
        ? prev.visasOfInterest.filter((v) => v !== visa)
        : [...prev.visasOfInterest, visa];
      return {
        ...prev,
        visasOfInterest: visas,
        error: null,
      };
    });
  };

  const submitMutation = useAssessmentSubmit();

  const handleSubmitBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormState((prev) => ({ ...prev, error: null }));

    try {
      // Validate first name
      if (
        !formState.firstName ||
        !formState.firstName.trim() ||
        formState.firstName.trim().length < 3
      ) {
        throw new Error("First name must be at least 3 characters");
      }

      // Validate last name
      if (
        !formState.lastName ||
        !formState.lastName.trim() ||
        formState.lastName.trim().length < 2
      ) {
        throw new Error("Last name must be at least 2 characters");
      }

      // Validate email format - not need as html input is type email; but keeping it here for reference
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        !formState.email ||
        !formState.email.trim() ||
        !emailRegex.test(formState.email.trim())
      ) {
        throw new Error("Please enter a valid email address");
      }

      // Validate country selection
      if (!formState.country || formState.country.trim() === "") {
        throw new Error("Please select a country");
      }

      // Validate LinkedIn URL format
      const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
      if (
        !formState.linkedInProfile ||
        !formState.linkedInProfile.trim() ||
        !linkedInRegex.test(formState.linkedInProfile.trim())
      ) {
        throw new Error("Please enter a valid LinkedIn profile URL");
      }

      // Validate visa selection- not need as html input is checkbox; but keeping it here for reference
      if (formState.visasOfInterest.length === 0) {
        throw new Error("Please select at least one visa category");
      }

      // Validate resume file type- not need as html input is accept only pdf, doc, docx; but keeping it here for reference
      if (!formState.resume) {
        throw new Error("Please upload a resume");
      }
      const allowedFileTypes = [".doc", ".docx", ".pdf"];
      const fileExtension =
        "." + formState.resume.name.split(".").pop()?.toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        throw new Error("Resume must be in .doc, .docx, or .pdf format");
      }

      // Validate additional info length
      if (
        !formState.additionalInfo ||
        !formState.additionalInfo.trim() ||
        formState.additionalInfo.trim().length < 10
      ) {
        throw new Error(
          "Additional information must be at least 10 characters"
        );
      }

      const formData = new FormData();
      if (formState.resume) {
        formData.append("file", formState.resume);
      }

      const result = await submitMutation.mutateAsync({
        formData,
        formState,
      });

      setFormState((prev) => ({
        ...prev,
        submitted: true,
        leadId: result.id,
      }));
    } catch (error: any) {
      setFormState((prev) => ({
        ...prev,
        error: error.message || "An error occurred while submitting the form",
      }));
    }
  };

  if (formState.submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        {submitMutation.isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-lg">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Image src="info.png" alt="Banner" width={100} height={100} />
              <h3 className="text-2xl font-bold">Thank You</h3>
              <p className="font-bold">
                Your information was submitted to our team of immigration
                attorneys. Expect an email from hello@tryalma.ai.
              </p>
              <br /> <br />
              <Button
                asChild
                className="bg-[#1B1B1B] hover:bg-[#1B1B1B]/90  sm:min-w-[250px]"
              >
                <Link href="/">Go Back to Homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {submitMutation.isPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <div className="flex flex-row bg-[#D4D99B]">
        <div className="hidden md:block">
          <Image src="banner2.png" alt="Banner" width={230} height={100} />
        </div>
        <div className="m-4 flex flex-col max-h-[230px]">
          <div className="m-8 pt-8">
            <Logo />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 pt-0 p-8">
              Get An Assessment
              <br />
              Of Your Immigration Case
            </h1>
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col">
        <div className="max-w-lg text-center  mx-auto w-full">
          <div className="flex flex-col items-center space-x-4 mb-8">
            <Image src="info.png" alt="Banner" width={100} height={100} />
            <div>
              <h3 className="text-xl font-bold">
                Want to understand your visa options?
              </h3>
              <p className="text-sm mt-2  font-bold">
                Submit the form below and our team of experienced attorneys will
                review your information and send a preliminary assessment of
                your case based on your goals.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmitBasicInfo}
            className="space-y-6 max-w-sm mx-auto"
            noValidate
          >
            <div className="space-y-4">
              <div>
                <Input
                  id="firstName"
                  value={formState.firstName}
                  placeholder="First Name"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      firstName: e.target.value,
                      error: null,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Input
                  id="lastName"
                  value={formState.lastName}
                  placeholder="Last Name"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      lastName: e.target.value,
                      error: null,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      email: e.target.value,
                      error: null,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Select
                  value={formState.country}
                  onValueChange={(value) =>
                    setFormState({
                      ...formState,
                      country: value,
                      error: null,
                    })
                  }
                >
                  <SelectTrigger className="[&[data-placeholder]]:text-muted-foreground">
                    <SelectValue placeholder="Country of Citizenship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="New_Zealand">New Zealand</SelectItem>
                    <SelectItem value="Other_EU">Other EU Country</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  id="linkedInProfile"
                  placeholder="LinkedIn Profile URL"
                  value={formState.linkedInProfile}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      linkedInProfile: e.target.value,
                      error: null,
                    })
                  }
                  required
                />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <Image src="cube.png" alt="Banner" width={90} height={100} />
              </div>
              <div>
                <div className="mb-2">
                  <Label className="text-xl font-bold">
                    Visa categories of interest?
                  </Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visa-o1"
                      checked={formState.visasOfInterest.includes("O-1")}
                      onCheckedChange={() => handleVisaCheckboxChange("O-1")}
                    />
                    <Label htmlFor="visa-o1" className="font-normal">
                      O-1
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visa-eb1a"
                      checked={formState.visasOfInterest.includes("EB-1A")}
                      onCheckedChange={() => handleVisaCheckboxChange("EB-1A")}
                    />
                    <Label htmlFor="visa-eb1a" className="font-normal">
                      EB-1A
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visa-eb2niw"
                      checked={formState.visasOfInterest.includes("EB-2 NIW")}
                      onCheckedChange={() =>
                        handleVisaCheckboxChange("EB-2 NIW")
                      }
                    />
                    <Label htmlFor="visa-eb2niw" className="font-normal">
                      EB-2 NIW
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visa-dontknow"
                      checked={formState.visasOfInterest.includes(
                        "I don't know"
                      )}
                      onCheckedChange={() =>
                        handleVisaCheckboxChange("I don't know")
                      }
                    />
                    <Label htmlFor="visa-dontknow" className="font-normal">
                      I don't know
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2">
                  <Label htmlFor="resume" className="text-xl font-bold">
                    Resume/CV Upload
                  </Label>
                </div>
                <FileUpload
                  value={formState.resume}
                  onChange={(file) =>
                    setFormState({
                      ...formState,
                      resume: file,
                      error: null,
                    })
                  }
                />
              </div>

              <div className="flex flex-col items-center space-y-4">
                <Image src="heart.png" alt="Banner" width={90} height={100} />
              </div>

              <div>
                <div className="mb-2">
                  <Label className="text-xl font-bold" htmlFor="additionalInfo">
                    How can we help you?
                  </Label>
                </div>
                <Textarea
                  id="additionalInfo"
                  placeholder="What is your current status? When does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations? Anything else we should know about your case and potential complications?"
                  value={formState.additionalInfo}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      additionalInfo: e.target.value,
                      error: null,
                    })
                  }
                  className="min-h-[160px] placeholder:text-sm"
                  required
                />
              </div>
            </div>
            {formState.error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {formState.error}
              </div>
            )}
            <ButtonLoading
              type="submit"
              className="w-full bg-[#1B1B1B] hover:bg-[#1B1B1B]/90"
              isLoading={submitMutation.isPending}
              loadingText="Submitting..."
            >
              Submit
            </ButtonLoading>
          </form>
        </div>
      </div>
    </div>
  );
}

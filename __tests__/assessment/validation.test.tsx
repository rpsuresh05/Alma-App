import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AssessmentPage from "@/app/assessment/page";

jest.mock("@/hooks/useAssessmentSubmit", () => ({
  useAssessmentSubmit: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

describe("AssessmentPage Form Validation", () => {
  it("should show error for invalid first name", async () => {
    render(<AssessmentPage />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(
      screen.getByText("First name must be at least 3 characters")
    ).toBeInTheDocument();
  });

  it("should show error for invalid LinkedIn URL", async () => {
    render(<AssessmentPage />);

    const linkedInInput = screen.getByPlaceholderText("LinkedIn Profile URL");
    await userEvent.type(linkedInInput, "invalid-url");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(
      screen.getByText("Please enter a valid LinkedIn profile URL")
    ).toBeInTheDocument();
  });

  it("should show error when no visa type is selected", async () => {
    render(<AssessmentPage />);

    // Fill in other required fields with valid data
    await userEvent.type(screen.getByPlaceholderText("First Name"), "John");
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "john@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("LinkedIn Profile URL"),
      "https://linkedin.com/in/johndoe"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(
      screen.getByText("Please select at least one visa category")
    ).toBeInTheDocument();
  });
});

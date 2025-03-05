import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AssessmentPage from "@/app/assessment/page";

jest.mock("@/hooks/useAssessmentSubmit", () => ({
  useAssessmentSubmit: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

describe("AssessmentPage UI Interactions", () => {
  it("should toggle visa checkboxes correctly", async () => {
    render(<AssessmentPage />);

    const o1Checkbox = screen.getByLabelText("O-1");
    const eb1aCheckbox = screen.getByLabelText("EB-1A");

    await userEvent.click(o1Checkbox);
    expect(o1Checkbox).toBeChecked();

    await userEvent.click(eb1aCheckbox);
    expect(eb1aCheckbox).toBeChecked();

    await userEvent.click(o1Checkbox);
    expect(o1Checkbox).not.toBeChecked();
    expect(eb1aCheckbox).toBeChecked();
  });

  it("should clear error message when input is corrected", async () => {
    render(<AssessmentPage />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(
      screen.getByText("First name must be at least 3 characters")
    ).toBeInTheDocument();

    const firstNameInput = screen.getByPlaceholderText("First Name");
    await userEvent.type(firstNameInput, "John");

    expect(
      screen.queryByText("First name must be at least 3 characters")
    ).not.toBeInTheDocument();
  });

  it("should show loading state during form submission", async () => {
    const mockMutateAsync = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    jest.mock("@/hooks/useAssessmentSubmit", () => ({
      useAssessmentSubmit: () => ({
        mutateAsync: mockMutateAsync,
        isPending: true,
      }),
    }));

    render(<AssessmentPage />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(screen.getByText("Submitting...")).toBeInTheDocument();
  });
});

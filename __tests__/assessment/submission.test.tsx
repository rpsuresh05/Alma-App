import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AssessmentPage from "@/app/assessment/page";

const mockMutateAsync = jest.fn();

jest.mock("@/hooks/useAssessmentSubmit", () => ({
  useAssessmentSubmit: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe("AssessmentPage Form Submission", () => {
  it("should submit form successfully with valid data", async () => {
    mockMutateAsync.mockResolvedValueOnce({ id: "123" });
    render(<AssessmentPage />);

    // Fill in form with valid data
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

    // Select country
    const countrySelect = screen.getByRole("combobox");
    await userEvent.click(countrySelect);
    await userEvent.click(screen.getByText("United States"));

    // Select visa type
    const visaCheckbox = screen.getByLabelText("O-1");
    await userEvent.click(visaCheckbox);

    // Add additional info
    await userEvent.type(
      screen.getByPlaceholderText(/What is your current status/i),
      "Test additional information"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    expect(mockMutateAsync).toHaveBeenCalled();
    expect(screen.getByText("Thank You")).toBeInTheDocument();
  });
});

import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "",
    route: "",
    asPath: "",
    query: "",
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));

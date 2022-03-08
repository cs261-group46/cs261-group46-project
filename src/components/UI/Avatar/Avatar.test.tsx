import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Avatar from "./Avatar";

describe("<Avatar />", () => {
  test("it should mount", () => {
    render(<Avatar />);

    const avatar = screen.getByTestId("Avatar");

    expect(avatar).toBeInTheDocument();
  });

  it("should contain the avatar if specified", () => {
    render(<Avatar srcLink={"./testimage.png"} />);

    const avatar = screen.getByTestId("Avatar");

    expect(avatar).toBeInTheDocument();

    expect(avatar).toContainHTML("testimage.png");
  });

  it("should use default avatar if unspecified", () => {
    render(<Avatar srcLink={"./Vectordefault.png"} />);

    const avatar = screen.getByTestId("Avatar");

    expect(avatar).toBeInTheDocument();

    expect(avatar).toContainHTML("Vectordefault.png");
  });
});

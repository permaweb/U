import { render } from "@testing-library/react";

import ReactBarUi from "./react-bar-ui";

describe("ReactBarUi", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ReactBarUi />);
    expect(baseElement).toBeTruthy();
  });
});

import React from "react";
import App from "../../src/App.tsx";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("handleNavigate function", () => {
  it("App test", () => {
    render(<App />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
// it('true to be true', () => {
//     expect(true).toBe(true);
//   });

});

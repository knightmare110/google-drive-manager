import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../"; // Adjust this import path as necessary

describe("Modal Component", () => {
  it("should not render when isOpen is false", () => {
    render(<Modal isOpen={false} />);
    expect(screen.queryByRole("dialog")).toBeNull(); // Modal should not exist in the DOM
  });

  it("should render when isOpen is true", () => {
    render(<Modal isOpen={true} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument(); // Modal should exist in the DOM
  });

  it("should render default title and message", () => {
    render(<Modal isOpen={true} />);
    expect(screen.getByText("Confirmation")).toBeInTheDocument(); // Default title
    expect(screen.getByText("Are you sure?")).toBeInTheDocument(); // Default message
  });

  it("should render custom title and message", () => {
    render(
      <Modal isOpen={true} title="Custom Title" message="Custom message text" />
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument(); // Custom title
    expect(screen.getByText("Custom message text")).toBeInTheDocument(); // Custom message
  });

  it("should call onClose when cancel button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<Modal isOpen={true} onClose={onCloseMock} />);

    const cancelButton = screen.getByText("Cancel"); // Default cancel button text
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1); // onClose should be called once
  });

  it("should call onConfirm when confirm button is clicked", () => {
    const onConfirmMock = jest.fn();
    render(<Modal isOpen={true} onConfirm={onConfirmMock} />);

    const confirmButton = screen.getByText("Confirm"); // Default confirm button text
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1); // onConfirm should be called once
  });

  it("should render custom confirm and cancel button text", () => {
    render(<Modal isOpen={true} confirmText="Proceed" cancelText="Dismiss" />);
    expect(screen.getByText("Proceed")).toBeInTheDocument(); // Custom confirm text
    expect(screen.getByText("Dismiss")).toBeInTheDocument(); // Custom cancel text
  });
});

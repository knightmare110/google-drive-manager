import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import FileUpload from "../";
import { BrowserRouter as Router } from "react-router-dom";

// Mock Axios
jest.mock("axios");

describe("FileUpload Component", () => {
  beforeEach(() => {
    axios.post.mockClear(); // Clear axios mock before each test
  });

  it("should allow file selection", async () => {
    const file = new File(["file content"], "file1.txt", { type: "text/plain" });

    render(
      <Router>
        <FileUpload />
      </Router>
    );

    // Find the file input
    const fileInput = screen.getByLabelText(/Attach Documents/i);
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Check if the file was added to the UI
    expect(screen.getByText(/file1.txt/i)).toBeInTheDocument();
  });

  // Test case 2: Upload files and show progress
  it("should upload files and show progress", async () => {
    const file = new File(["file content"], "file1.txt", { type: "text/plain" });

    // Mock axios.post to simulate file upload and progress
    axios.post.mockImplementation((url, formData, config) => {
      // Simulate the upload progress reaching 100%
      const onUploadProgress = config.onUploadProgress;
      onUploadProgress({ loaded: 100, total: 100 });

      return Promise.resolve({
        data: {},
        status: 200,
      });
    });

    render(
      <Router>
        <FileUpload />
      </Router>
    );

    // Find the file input and simulate file selection
    const fileInput = screen.getByLabelText(/Attach Documents/i);
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Click the upload button
    const uploadButton = screen.getByRole("button", { name: /Upload Files/i });
    fireEvent.click(uploadButton);

    // Wait for the upload progress to reach 100%
    await waitFor(() => {
      expect(screen.getByText(/100% - completed/i)).toBeInTheDocument();
    });
  });

  // Test case 3: Handle failed uploads
  it("should display error message for failed uploads", async () => {
    // Mock Axios to simulate a failed upload
    axios.post.mockImplementation(() =>
      Promise.reject(new Error("Upload failed"))
    );

    render(
      <Router>
        <FileUpload />
      </Router>
    );

    // Simulate selecting files
    const fileInput = screen.getByLabelText(/Attach Documents/i);
    const file = new File(["file content"], "file1.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click the upload button
    const uploadButton = screen.getByTestId('upload-button');
    fireEvent.click(uploadButton);

    // Wait for the upload error message
    await waitFor(() =>
      expect(screen.getByText(/0% - failed/i)).toBeInTheDocument()
    );

    // Check if the file status is marked as "failed"
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  // Test case 4: Show modal after all files are uploaded
  it("should show modal after all files are uploaded", async () => {
    // Mock Axios to simulate a successful upload
    axios.post.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {},
        headers: {},
        onUploadProgress: (progressEvent) => {
          progressEvent.total = 100;
          progressEvent.loaded = 100;
        },
      })
    );

    render(
      <Router>
        <FileUpload />
      </Router>
    );

    // Simulate selecting files
    const fileInput = screen.getByLabelText(/Attach Documents/i);
    const file = new File(["file content"], "file1.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click the upload button
    const uploadButton = screen.getByTestId('upload-button');
    fireEvent.click(uploadButton);

    // Wait for the modal to appear after upload completion
    await waitFor(() =>
      expect(screen.getByText(/Upload Complete/i)).toBeInTheDocument()
    );

    // Confirm modal action
    const confirmButton = screen.getByText(/Yes, Show File List/i);
    fireEvent.click(confirmButton);

    // Check if modal is closed
    expect(screen.queryByText(/Upload Complete/i)).not.toBeInTheDocument();
  });

  // Test case 5: Cancel the modal
  it("should close the modal when cancelled", async () => {
    // Mock Axios to simulate a successful upload
    axios.post.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {},
        headers: {},
        onUploadProgress: (progressEvent) => {
          progressEvent.total = 100;
          progressEvent.loaded = 100;
        },
      })
    );

    render(
      <Router>
        <FileUpload />
      </Router>
    );

    // Simulate selecting files
    const fileInput = screen.getByLabelText(/Attach Documents/i);
    const file = new File(["file content"], "file1.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Click the upload button
    const uploadButton = screen.getByTestId('upload-button');
    fireEvent.click(uploadButton);

    // Wait for the modal to appear
    await waitFor(() =>
      expect(screen.getByText(/Upload Complete/i)).toBeInTheDocument()
    );

    // Cancel the modal action
    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    // Check if modal is closed
    expect(screen.queryByText(/Upload Complete/i)).not.toBeInTheDocument();
  });
});

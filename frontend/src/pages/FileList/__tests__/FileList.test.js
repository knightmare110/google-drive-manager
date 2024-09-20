import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileList from "../"; // Adjust path as per your structure
import { listFiles, downloadFile, deleteFile } from "../../../apis/file"; // Mock the API services
import { FILE_LIST_TABLE_COLUMNS } from "../../../utils/constant"; // Your constants
import "@testing-library/jest-dom/extend-expect"; // For better assertions

jest.mock("../../../apis/file"); // Mock file API

describe("FileList Component", () => {
  const mockFiles = [
    { id: "1", name: "file1.txt", mimeType: "text/plain" },
    { id: "2", name: "file2.jpg", mimeType: "image/jpeg" },
  ];

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: It should fetch and render files on initial load
  it("should fetch and render files on initial load", async () => {
    listFiles.mockResolvedValue({
      response: { data: { files: mockFiles } },
      success: true,
    });

    render(<FileList />);

    // Check that the spinner is present initially
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Wait for the files to be rendered and the spinner to disappear
    await waitFor(() => {
      mockFiles.forEach((file) => {
        expect(screen.getByText(file.name)).toBeInTheDocument();
      });
      expect(screen.queryByRole("status")).not.toBeInTheDocument(); // Ensure spinner disappears
    });
  });

  // Test 2: It should handle file download
  it("should handle file download", async () => {
    listFiles.mockResolvedValue({
      response: { data: { files: mockFiles } },
      success: true,
    });

    downloadFile.mockResolvedValue({
      response: { data: new Blob(["file content"], { type: "text/plain" }) },
      success: true,
    });

    render(<FileList />);

    await waitFor(() => {
      expect(screen.getByText("file1.txt")).toBeInTheDocument();
    });

    // Simulate clicking the "Download" button
    const downloadButton = screen.getAllByText("Download")[0];
    fireEvent.click(downloadButton);

    // Expect the spinner to be shown during the download
    expect(screen.getByRole("status")).toBeInTheDocument();

    await waitFor(() => {
      expect(downloadFile).toHaveBeenCalledWith("1"); // Ensure the correct file ID is passed
      expect(screen.queryByRole("status")).not.toBeInTheDocument(); // Ensure spinner disappears after download
    });
  });

  // Test 3: It should handle file delete with confirmation modal
  it("should handle file delete with confirmation modal", async () => {
    const mockFilesAfterDelete = [
      { id: "2", name: "file2.jpg", mimeType: "image/jpeg" }, // file1.txt removed
    ];

    // Initial mock API call for listing files (includes file1.txt and file2.jpg)
    listFiles.mockResolvedValueOnce({
      response: { data: { files: mockFiles } },
      success: true,
    });

    // Mock the API call for deleting the file (file1.txt)
    deleteFile.mockResolvedValue({ success: true });

    // After deletion, the listFiles should return the updated file list without file1.txt
    listFiles.mockResolvedValueOnce({
      response: { data: { files: mockFilesAfterDelete } },
      success: true,
    });

    // Render the component
    render(<FileList />);

    // Wait for the files to be loaded (file1.txt and file2.jpg should be present)
    await waitFor(() => {
      expect(screen.getByText("file1.txt")).toBeInTheDocument();
    });

    // Click the delete button for the first file (file1.txt)
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    // Expect the modal to be shown with the confirmation text
    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to delete this file? This action cannot be undone.")
      ).toBeInTheDocument();
    });

    // Click the confirm delete button in the modal
    fireEvent.click(screen.getByTestId("confirm-button"));

    // Check if deleteFile was called with the correct ID
    await waitFor(() => {
      expect(deleteFile).toHaveBeenCalledWith("1"); // Assuming file1.txt has id "1"
    });

    // After deletion, wait for the new file list to load and check if file1.txt is removed
    await waitFor(() => {
      expect(screen.queryByText("file1.txt")).not.toBeInTheDocument();
      expect(screen.getByText("file2.jpg")).toBeInTheDocument(); // file2.jpg remains
    });
  });

  // Test 4: It should handle pagination (Next and Previous)
  it("should handle pagination", async () => {
    listFiles.mockResolvedValue({
      response: { data: { files: mockFiles, nextPageToken: "nextToken" } },
      success: true,
    });

    render(<FileList />);

    await waitFor(() => {
      expect(screen.getByText("file1.txt")).toBeInTheDocument();
    });

    // Simulate clicking the "Next" button
    const nextPageButton = screen.getByText("Next");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(listFiles).toHaveBeenCalledWith("nextToken"); // Ensure the nextPageToken is passed
    });

    // Simulate clicking the "Previous" button
    const prevPageButton = screen.getByText("Previous");
    fireEvent.click(prevPageButton);

    await waitFor(() => {
      expect(listFiles).toHaveBeenCalledWith(null); // Ensure the previousPageToken is passed
    });
  });

  // Test 5: It should display loading spinner during file operations
  it("should display loading spinner during file operations", async () => {
    // Mock the API call for listing files
    listFiles.mockResolvedValue({
      response: { data: { files: mockFiles } },
      success: true,
    });

    // Render the component
    render(<FileList />);

    // Expect loading spinner to be shown initially
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Wait for the files to be loaded and the spinner to disappear
    await waitFor(() => {
      mockFiles.forEach((file) => {
        expect(screen.getByText(file.name)).toBeInTheDocument();
      });

      // Ensure that the loading spinner is no longer in the document
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });
});

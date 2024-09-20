const request = require("supertest");
const app = require("../../server");
const {
  getDriveInstance,
  logFileHistory,
  getFileMetadata,
} = require("../../utils/driveUtils");
const { Readable } = require("stream");

jest.mock("../../utils/driveUtils", () => ({
  getDriveInstance: jest.fn(),
  logFileHistory: jest.fn(),
  getFileMetadata: jest.fn(),
	bufferToStream: jest.fn()
}));

describe("Drive Routes", () => {
  let driveMock;

  beforeEach(() => {
    driveMock = {
      files: {
        list: jest.fn(),
        create: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    };

    // Mock getDriveInstance to return the mock drive object
    getDriveInstance.mockReturnValue(driveMock);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // 1. List Files
  it("should list files from Google Drive", async () => {
    driveMock.files.list.mockResolvedValue({
      data: {
        files: [
          { id: "1", name: "file1.txt", mimeType: "text/plain" },
          { id: "2", name: "file2.jpg", mimeType: "image/jpeg" },
        ],
        nextPageToken: "nextPageToken123",
      },
    });

    const response = await request(app)
      .get("/api/drive/files")
      .set("Cookie", "authToken=validToken");

    expect(response.status).toBe(200);
    expect(response.body.files).toHaveLength(2); // Expecting two files
    expect(response.body.nextPageToken).toBe("nextPageToken123");
    expect(driveMock.files.list).toHaveBeenCalledWith({
      pageSize: 10,
      pageToken: null,
      fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
    });
  });

  // 2. Upload File
  it("should upload a file to Google Drive", async () => {
    const mockFile = Buffer.from("mock file content");
    const mockFileMetadata = { id: "123", webViewLink: "mockLink" };

    driveMock.files.create.mockResolvedValue({
      data: { id: "123", webViewLink: "mockLink" },
    });
    getFileMetadata.mockResolvedValue(mockFileMetadata);

    const response = await request(app)
      .post("/api/drive/upload")
      .set("Cookie", "authToken=validToken; userEmail=test@example.com")
      .attach("file", mockFile, "testFile.txt");

    expect(response.status).toBe(201); // Expecting successful upload
    expect(driveMock.files.create).toHaveBeenCalled();
    expect(logFileHistory).toHaveBeenCalledWith(
      mockFileMetadata,
      "test@example.com",
      true,
      0
    );
  });

  // 3. Download File
  it("should download a file from Google Drive", async () => {
    const mockFileStream = new Readable();
    mockFileStream._read = () => {};
    mockFileStream.push("mock file data");
    mockFileStream.push(null); // End of stream

    driveMock.files.get.mockResolvedValue({ data: mockFileStream });
    const mockFileMetadata = {
      id: "123",
      name: "testFile.txt",
      mimeType: "text/plain",
    };
    getFileMetadata.mockResolvedValue(mockFileMetadata);

    const response = await request(app)
      .get("/api/drive/files/123")
      .set("Cookie", "authToken=validToken; userEmail=test@example.com");

    expect(response.status).toBe(200);
    expect(driveMock.files.get).toHaveBeenCalledWith(
      { fileId: "123", alt: "media" },
      { responseType: "stream" }
    );
    expect(logFileHistory).toHaveBeenCalledWith(
      mockFileMetadata,
      "test@example.com",
      true,
      1
    );
  });

  // 4. Delete File
  it("should delete a file from Google Drive", async () => {
    const mockFileMetadata = { id: "123", name: "testFile.txt" };
    getFileMetadata.mockResolvedValue(mockFileMetadata);

    const response = await request(app)
      .delete("/api/drive/files/123")
      .set("Cookie", "authToken=validToken; userEmail=test@example.com");

    expect(response.status).toBe(204); // Expecting no content on successful deletion
    expect(driveMock.files.delete).toHaveBeenCalledWith({ fileId: "123" });
    expect(logFileHistory).toHaveBeenCalledWith(
      mockFileMetadata,
      "test@example.com",
      true,
      2
    );
  });
});

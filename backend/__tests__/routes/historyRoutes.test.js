jest.mock("aws-sdk", () => {
  const mockScan = jest.fn(); // Mock the scan method

  const DocumentClient = jest.fn(() => ({
    scan: mockScan,
  }));

  const config = {
    update: jest.fn(),
  };

  return { 
    DynamoDB: { DocumentClient }, 
    config,
    mockScan, // Export the mockScan to control in the tests
  };
});

const { mockScan } = require("aws-sdk"); // Import the mock
const request = require("supertest");
const app = require("../../server");

describe("History Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should list file upload history from DynamoDB", async () => {
    // Mocking the scan().promise() to return some data
    mockScan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [
          {
            name: "file1.txt",
            mimeType: "text/plain",
            size: 1024,
            type: 0,
            isSucceed: true,
            createdAt: "2023-01-01T00:00:00Z",
          },
        ],
        LastEvaluatedKey: null,
      }),
    });

    const response = await request(app).get("/api/history");

    // Test that status is 200
    expect(response.status).toBe(200);

    // Test that history property exists in response body
    expect(response.body).toHaveProperty("history");

    // Test that the returned history contains the mocked data
    expect(response.body.history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "file1.txt",
          mimeType: "text/plain",
          size: 1024,
          type: 0,
          isSucceed: true,
          createdAt: "2023-01-01T00:00:00Z",
        }),
      ])
    );

    // Test pagination key is null
    expect(response.body.lastEvaluatedKey).toBeNull();
  });

  it("should handle DynamoDB errors", async () => {
    // Simulate a DynamoDB error
    mockScan.mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
    });

    const response = await request(app).get("/api/history");

    // Expect 500 status code for errors
    expect(response.status).toBe(500);

    // Expect error message to be returned
    expect(response.text).toBe("Error fetching history logs: DynamoDB error");
  });
});

const request = require("supertest");
const app = require("../../server");
const jwt = require("jsonwebtoken");
const { getOAuth2Client, getAuthUrl } = require("../../utils/googleDrive");

// Mock JWT verification to always return a valid payload
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(() => ({ email: "test@example.com" })), // Return a mock payload with email
  decode: jest.fn(), // Mock JWT decode
}));

// Mock the OAuth2 client
jest.mock("../../utils/googleDrive", () => ({
  getOAuth2Client: jest.fn(),
  getAuthUrl: jest.fn()
}));

describe("Auth Routes", () => {
  it("should redirect to Google OAuth URL", async () => {
    getAuthUrl.mockReturnValue("http://mock-oauth-url.com");
    const response = await request(app).get("/api/auth/google");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("authUrl");
  });

  it("should return login status", async () => {
    // Set a valid token and expiry in the Cookie header
    const response = await request(app)
      .get("/api/auth/status")
      .set("Cookie", ["authToken=validToken", "authExpiry=validExpiry"]);

    // Expect the status to be 200
    expect(response.status).toBe(200);

    // Expect loggedIn to be true (based on the mock)
    expect(response.body.loggedIn).toBe(true);
  });

  it("should handle Google OAuth callback and set cookies", async () => {
    // Mock the OAuth2 client and token generation
    const tokens = { access_token: "testAccessToken", id_token: "testIdToken", expiry_date: Date.now() + 3600 * 1000 };
    getOAuth2Client.mockReturnValue({
      getToken: jest.fn().mockResolvedValue({ tokens }),
      setCredentials: jest.fn()
    });

    // Mock JWT decoding for the ID token
    jwt.decode.mockReturnValue({ email: "test@example.com" });

    const response = await request(app).get("/api/auth/google/callback?code=123");

    expect(response.status).toBe(302); // Redirection
    expect(response.headers["set-cookie"]).toBeDefined(); // Cookies should be set
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("authToken=testAccessToken"),
        expect.stringContaining(`userEmail=${encodeURIComponent("test@example.com")}`), // Adjusted for URL encoding
      ])
    );
  });

  it("should handle sign out and clear cookies", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Logged out successfully");
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("authToken=;"), // Cookie is cleared
        expect.stringContaining("authExpiry=;"), // Cookie is cleared
        expect.stringContaining("userEmail=;"), // Cookie is cleared
      ])
    );
  });
});

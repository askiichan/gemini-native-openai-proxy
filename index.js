const functions = require("@google-cloud/functions-framework");
const fetch = require("node-fetch");

functions.http("proxyGemini", async (req, res) => {
  try {
    // Enable CORS
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.status(204).send("");
      return;
    }

    // Log incoming request details
    console.log("Incoming request:", {
      method: req.method,
      path: req.url,
      headers: req.headers,
      body: req.body,
    });

    // Extract the original request URL path and query parameters
    const url = new URL(req.url, "https://" + req.headers.host);

    // Remove any duplicate /v1beta/openai prefix if present
    let pathname = url.pathname;
    if (pathname.startsWith("/v1beta/openai")) {
      pathname = pathname.replace("/v1beta/openai", "");
    }

    // Base URL for the Gemini API's OpenAI compatibility endpoint
    const geminiBaseURL =
      "https://generativelanguage.googleapis.com/v1beta/openai";

    // Construct the new URL by combining the base Gemini API URL with the original path and query string
    const geminiAPIURL = geminiBaseURL + pathname + url.search;

    console.log("Forwarding request to:", geminiAPIURL);

    // Create clean headers object
    const headers = {
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
      Accept: req.headers.accept || "application/json",
    };

    // Check if this is a streaming request
    const isStreaming = req.body?.stream === true;

    // Forward the request to the Gemini API
    const response = await fetch(geminiAPIURL, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    console.log("Gemini API response status:", response.status);

    // Handle streaming response
    if (isStreaming) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream the response directly
      const stream = response.body;
      stream.on("data", chunk => {
        res.write(chunk);
      });
      stream.on("end", () => {
        res.end();
      });
      stream.on("error", error => {
        console.error("Stream error:", error);
        res.end();
      });
      return;
    }

    // For non-streaming responses, handle as JSON
    const responseText = await response.text();
    console.log("Gemini API response body:", responseText);

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      return res.status(500).json({
        error: "Invalid JSON Response",
        message: "Failed to parse Gemini API response",
        responseText: responseText,
      });
    }

    // Send the response with the same status code
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

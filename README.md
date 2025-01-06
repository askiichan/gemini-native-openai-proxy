# Gemini Native OpenAI Proxy

A Google Cloud Function proxy that enables access to Google's Gemini API from regions where it's not directly available, while maintaining OpenAI API compatibility. This solution is particularly valuable for developers in regions like Hong Kong, Macau, and other locations where direct access to Gemini API might be restricted.

## 🌟 Why This Project?

### Problem

- 🌏 Google's Gemini API is not directly accessible in certain regions (e.g., Hong Kong, Macau)
- 🔄 Developers in these regions can't directly integrate Gemini into their applications
- 🛠️ Desire to use existing OpenAI-compatible tooling with Gemini

### Why This Solution

#### Current Solutions

Most of the existing solutions (like [openai-gemini](https://github.com/PublicAffairs/openai-gemini)) transform Gemini API requests into OpenAI format and deploy them on Cloudflare Workers, which do not allow specifying the worker region. As a result, these solutions are not suitable for scenarios requiring region-specific deployment.

#### Our Approach

This proxy leverages Gemini's official OpenAI compatibility (released on 2024-11) which means:

- ✅ Direct use of Gemini's native OpenAI endpoint
- 🔍 No request/response transformation needed
- ⚡ Better performance and reliability
- 🔄 Future-proof as Gemini maintains the compatibility layer

## 🚀 Quick Start

### Prerequisites

1. [Google Cloud Account](https://cloud.google.com/)
2. [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install)
3. [Node.js](https://nodejs.org/) (v18 or later)
4. [Gemini API Key](https://makersuite.google.com/app/apikey)

### Local Development

1. Clone this repository:

   ```bash
   git clone https://github.com/askiichan/gemini-native-openai-proxy.git
   cd gemini-native-openai-proxy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run locally:
   ```bash
   npm start
   ```

The function will be available at `http://localhost:8080`

### Deployment to Google Cloud Functions

1. Make sure you're logged in to Google Cloud:

   ```bash
   gcloud auth login
   ```

2. Set your project ID:

   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Deploy the function:
   ```bash
   gcloud functions deploy proxyGemini \
     --runtime nodejs18 \
     --trigger-http \
     --region asia-east1  # Deploy to Taiwan data center for optimal APAC performance
     --allow-unauthenticated
   ```

> Note: The `asia-east1` region (Taiwan) is chosen for optimal latency in Hong Kong, Macau, and nearby regions while ensuring full access to Gemini API services. This region provides a good balance between performance and service availability for APAC users.

After deployment, you'll receive a URL for your function. Save this URL as it will be your proxy endpoint.

### Testing the Deployment

After deploying to Google Cloud Functions, you can test your endpoint using curl. Here's an example command for Windows:

```bash
curl -X POST "https://REGION-PROJECT_ID.cloudfunctions.net/proxyGemini/v1beta/openai/chat/completions" ^
-H "Content-Type: application/json" ^
-H "Authorization: Bearer YOUR_API_KEY" ^
-d "{\"model\": \"gemini-1.5-flash\", \"messages\": [{\"role\": \"user\", \"content\": \"Explain to me how AI works\"}]}"
```

For Linux/Mac users, replace `^` with `\`:

```bash
curl -X POST "https://REGION-PROJECT_ID.cloudfunctions.net/proxyGemini/v1beta/openai/chat/completions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_API_KEY" \
-d '{"model": "gemini-1.5-flash", "messages": [{"role": "user", "content": "Explain to me how AI works"}]}'
```

> **Important**: Replace `YOUR_API_KEY` with your actual Google Cloud API key and `REGION-PROJECT_ID` with your function's region and project ID. Never commit or share your API key publicly.

## Supported Endpoints

- `/chat/completions` - For chat completions
- Streaming support via `stream: true` parameter

## 🔒 Security Considerations

1. The function is deployed with `--allow-unauthenticated` to allow public access. In production, consider:

   - Adding authentication
   - Implementing rate limiting
   - Restricting CORS origins

2. Your Gemini API key should be kept secure:
   - Don't commit it to version control
   - Consider using environment variables or secret management

## 📚 Additional Resources

- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google Cloud Functions Documentation](https://cloud.google.com/functions/docs)
- [Google Cloud Regions](https://cloud.google.com/compute/docs/regions-zones)
- [Google Cloud Functions Locations](https://cloud.google.com/functions/docs/locations)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

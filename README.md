# Gemini Native OpenAI Proxy

A Google Cloud Function proxy that enables access to Google's Gemini API from regions where it's not directly available, while maintaining OpenAI API compatibility. This solution is particularly valuable for developers in regions like Hong Kong, Macau, and other locations where direct access to Gemini API might be restricted.

## 🌟 Why This Project?

### Problem

- 🌏 Google's Gemini API is not directly accessible in certain regions (e.g., Hong Kong, Macau)
- 🔄 Developers in these regions can't directly integrate Gemini into their applications
- 💰 Need for a cost-effective alternative to OpenAI's GPT models
- 🛠️ Desire to use existing OpenAI-compatible tooling with Gemini

### Why This Solution is Better

#### Current Solutions

Most existing solutions (like [openai-gemini](https://github.com/PublicAffairs/openai-gemini)) transform OpenAI API requests into Gemini format through complex request/response mapping, which can lead to:

- 🔧 Maintenance overhead as APIs evolve
- ⚠️ Potential compatibility issues
- 🐌 Additional processing overhead
- ❌ Limited feature support

#### Our Approach

This proxy leverages Gemini's official OpenAI compatibility (released on 2024-11-26) which means:

- ✅ Direct use of Gemini's native OpenAI endpoint
- 🔍 No request/response transformation needed
- ⚡ Better performance and reliability
- 💯 Full feature compatibility
- 🔄 Future-proof as Gemini maintains the compatibility layer

### Solution

This proxy:

- 🌍 Deploys to Google Cloud Functions, which has better global accessibility
- 🔌 Acts as a bridge between restricted regions and Gemini API
- 💻 Uses Gemini's native OpenAI compatibility for maximum reliability
- 🚀 Enables developers in restricted regions to build AI applications with Gemini

## ✨ Features

- 🔄 Seamless proxy using Gemini's native OpenAI compatibility
- 🌊 Supports both streaming and non-streaming responses
- 🔒 Proper CORS and error handling
- 📝 Detailed logging for easy debugging
- ⚡ Native OpenAI format support (no transformation needed)
- 🌐 Works from regions where Gemini API is restricted
- 💳 Use Gemini's competitive pricing while maintaining OpenAI compatibility
- 🔧 Easy deployment to Google Cloud Functions

## 🚀 Quick Start

### Prerequisites

1. [Google Cloud Account](https://cloud.google.com/)
2. [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install)
3. [Node.js](https://nodejs.org/) (v18 or later)
4. [Gemini API Key](https://makersuite.google.com/app/apikey)

### Local Development

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/gemini-native-openai-proxy.git
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
     --allow-unauthenticated
   ```

After deployment, you'll receive a URL for your function. Save this URL as it will be your proxy endpoint.

## 📝 Usage

### Using with OpenAI Client Libraries

#### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_GEMINI_API_KEY",
    base_url="YOUR_CLOUD_FUNCTION_URL"
)

response = client.chat.completions.create(
    model="gemini-1.5-flash",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
```

#### JavaScript/Node.js

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "YOUR_GEMINI_API_KEY",
  baseURL: "YOUR_CLOUD_FUNCTION_URL",
});

const response = await openai.chat.completions.create({
  model: "gemini-1.5-flash",
  messages: [{ role: "user", content: "Hello!" }],
});
```

### Supported Endpoints

- `/chat/completions` - For chat completions
- Streaming support via `stream: true` parameter

## ⚙️ Configuration

The proxy automatically handles:

- CORS headers for browser access
- Error handling and logging
- Request/response transformation
- Streaming responses

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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **500 Error**: Check your Gemini API key and request format
2. **CORS Issues**: Verify the CORS headers match your client's needs
3. **Streaming Issues**: Ensure your client supports SSE (Server-Sent Events)

For more detailed logs, check the Google Cloud Functions logs in your Google Cloud Console.

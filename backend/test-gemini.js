// backend/tests/test-gemini.js
const path = require('path');

// Load .env from parent directory (backend root)
require('dotenv').config({ path: path.join(__dirname, '.env') }); // ← FIXED: goes up one level

const { GoogleGenAI } = require("@google/genai");

console.log('\n' + '='.repeat(60));
console.log('🧪 GEMINI API TEST');
console.log('='.repeat(60) + '\n');

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: GEMINI_API_KEY is not set in .env file');
  console.log('\n\x1b[33m%s\x1b[0m', '📝 Please add to your backend/.env file:');
  console.log('\x1b[36m%s\x1b[0m', '   GEMINI_API_KEY=your_api_key_here');
  console.log('\x1b[36m%s\x1b[0m', '   Get your API key from: https://ai.google.dev/');
  console.log('\n' + '='.repeat(60));
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✅ Found API Key:', process.env.GEMINI_API_KEY.substring(0, 15) + '...');

async function testGeminiConnection() {
  console.log('\n\x1b[34m%s\x1b[0m', '🔄 Testing Gemini API connection...');
  console.log('-'.repeat(60));
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });
    
    console.log('📡 Sending test request to Gemini 3.6 Flash...');
    
    // Simple test prompt
    const response = await genAI.models.generateContent({
      model: "gemini-3.6-flash", // ← Keeping your model choice
      contents: "Say exactly: 'ATS Analysis System is working perfectly!'",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100,
      }
    });
    
    console.log('\n\x1b[32m%s\x1b[0m', '✅ SUCCESS! Gemini API is working!');
    console.log('\x1b[36m%s\x1b[0m', '📝 Response:', response.text);
    console.log('\n\x1b[32m%s\x1b[0m', '🎉 Test passed successfully!');
    console.log('='.repeat(60) + '\n');
    
    return true;
    
  } catch (error) {
    console.error('\n\x1b[31m%s\x1b[0m', '❌ Gemini API Error:', error.message);
    console.log('-'.repeat(60));
    
    // Detailed error handling
    if (error.message.includes('API key')) {
      console.log('\x1b[33m%s\x1b[0m', '💡 Your API key seems invalid.');
      console.log('\x1b[33m%s\x1b[0m', '💡 Get a valid key from: https://ai.google.dev/');
    } else if (error.message.includes('quota')) {
      console.log('\x1b[33m%s\x1b[0m', '💡 You have exceeded your API quota.');
      console.log('\x1b[33m%s\x1b[0m', '💡 Wait or upgrade your plan.');
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      console.log('\x1b[33m%s\x1b[0m', '💡 Network error. Check your internet connection.');
    } else if (error.message.includes('model')) {
      console.log('\x1b[33m%s\x1b[0m', '💡 Model "gemini-3.6-flash" may not be available.');
      console.log('\x1b[33m%s\x1b[0m', '💡 Try using: gemini-2.0-flash or gemini-1.5-flash');
    } else if (error.message.includes('Application Default Credentials')) {
      console.log('\x1b[33m%s\x1b[0m', '💡 Authentication error. Make sure you\'re using API key mode.');
      console.log('\x1b[33m%s\x1b[0m', '💡 Check that GEMINI_API_KEY is properly set in .env');
    } else {
      console.log('\x1b[31m%s\x1b[0m', '📊 Full error details:');
      console.log(error);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run the test
console.log('\x1b[35m%s\x1b[0m', '🚀 Starting Gemini 3.6 Flash API Test...\n');
testGeminiConnection();
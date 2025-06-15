# Design Agent Setup Guide

The design agent has been completely rewritten to provide dynamic, varied outputs and proper image analysis capabilities.

## Key Improvements

### 1. **Real Image Analysis**
- Uses Google's Gemini Vision API to actually analyze uploaded images
- Extracts components, colors, layout patterns, and design themes
- No more static, repetitive responses

### 2. **Enhanced Figma Integration**
- Improved Figma URL processing with better error handling
- Dynamic fallback responses based on URL patterns
- More accurate component and color extraction

### 3. **Dynamic Code Generation with Top-to-Bottom Structure**
- Generates unique React components based on actual analysis
- **Strict top-to-bottom layout**: Header → Main Content → Footer
- Multiple component types: forms, dashboards, landing pages, profiles
- Varied color schemes and layouts
- Production-ready code with proper TypeScript and accessibility
- Semantic HTML structure with proper vertical flow

### 4. **Better Error Handling**
- Graceful fallbacks when APIs are unavailable
- Multiple fallback variations to avoid repetition
- Clear error messages for debugging

## Setup Instructions

### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 2. Configure Environment Variables
Add to your `.env.local` file:
```bash
GEMINI_API_KEY="your_gemini_api_key_here"
GROQ_API_KEY="your_groq_api_key_here"
FIGMA_ACCESS_TOKEN="your_figma_token_here" # Optional
```

### 3. Install Dependencies
The required dependencies are already installed:
- `@google/generative-ai` - For image analysis
- `openai` - For code generation via Groq

## How It Works

### Image Upload Flow
1. User uploads an image
2. Image is converted to base64
3. Gemini Vision API analyzes the image for:
   - UI components (buttons, forms, cards, etc.)
   - Layout structure (grid, flexbox, etc.)
   - Color palette
   - Typography style
   - Overall theme
4. Analysis is passed to Groq LLM for code generation
5. Unique React component is generated based on analysis

### Figma URL Flow
1. User provides Figma URL
2. File key is extracted from URL
3. Figma API fetches design data
4. Design structure is analyzed for components and colors
5. Code is generated based on actual Figma structure

### Fallback System
- If Gemini API fails: Uses intelligent fallbacks with variations
- If Figma API fails: Generates fallbacks based on URL patterns
- If code generation fails: Uses dynamic templates based on analysis

## Testing the Agent

### Test with Image Upload
1. Go to `/agents/design`
2. Click "Upload Image" tab
3. Upload a UI mockup or screenshot
4. Click "Convert to Code"
5. You should see unique analysis and code based on your image

### Test with Figma URL
1. Click "Figma URL" tab
2. Enter a Figma design URL
3. Click "Convert to Code"
4. You should see code generated based on the Figma structure

## Expected Outputs

The agent now generates:
- **Unique Analysis**: Different components, colors, and layouts for each input
- **Top-to-Bottom Structure**: All components follow strict vertical layout:
  - Header/Navigation at the top
  - Main content sections in the middle (arranged vertically)
  - Footer at the bottom
- **Varied Code**: Different React components (forms, dashboards, landing pages)
- **Multiple Formats**: React + Tailwind, HTML + CSS, and live preview
- **Production Ready**: Proper TypeScript, accessibility, and responsive design
- **Semantic Structure**: Uses proper HTML5 semantic elements (header, main, section, footer)

## Troubleshooting

### "Gemini API key not configured"
- Make sure `GEMINI_API_KEY` is set in your `.env.local` file
- Restart your development server after adding the key

### "Figma API error"
- Check if `FIGMA_ACCESS_TOKEN` is valid
- Ensure the Figma URL is publicly accessible
- The agent will use fallbacks if Figma API fails

### Same output every time
- This should no longer happen with the new implementation
- If it does, check the console for API errors
- The fallback system now provides variations

## API Endpoints

- `POST /api/agents/design` - Main design conversion endpoint
- Accepts form data with `type` (url/upload) and `url` or `file`
- Returns JSON with analysis and generated code

The design agent is now much more capable and should provide unique, relevant outputs for each design input!
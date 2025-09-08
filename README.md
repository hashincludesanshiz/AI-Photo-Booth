## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   - Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Set the `GEMINI_API_KEY` in [.env.local](.env.local):
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```


# Event Photo Compositor

A React application that uses Google's Gemini AI to seamlessly merge guest photos into base couple photos, creating professional event portraits. Perfect for weddings, events, and professional photography where you need to composite multiple people into a single cohesive image.

## Features

- **AI-Powered Photo Composition**: Uses Google Gemini 2.5 Flash Image Preview model for intelligent photo merging
- **Professional Results**: Maintains lighting, shadows, and perspective for realistic composites
- **Custom Instructions**: Add optional notes to guide the AI composition process
- **Image Download**: Download the generated composite image directly
- **Multiple Format Support**: Works with PNG, JPG, JPEG, and WebP images

## How It Works

1. **Upload Base Image**: The main couple/group photo that serves as the foundation
2. **Upload Guest Image**: The person you want to add to the base photo
3. **Optional Notes**: Provide specific instructions like "change background to beach" or "make lighting warmer"
4. **AI Processing**: Gemini AI analyzes both images and creates a seamless composite
5. **Download Result**: Get your professional composite image



## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **AI Service**: Google Gemini 2.5 Flash Image Preview
- **Styling**: Tailwind CSS (utility classes)
- **File Handling**: Base64 encoding for API communication

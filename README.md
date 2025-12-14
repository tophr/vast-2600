# VAST 2600 - Kaplay!

[Kaplay](https://kaplayjs.com) is a JavaScript game programming library that helps you make games fast and fun.

## Local Development

To run this game locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

   Or for development with CORS enabled:
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` (or the port shown in the terminal)

## Project Structure

- `index.html` - Main HTML file
- `src/app.js` - Main game entry point
- `src/styles.css` - Game styles
- `src/scene/` - Individual game scenes
- `assets/` - Game assets (sprites, sounds, shaders)

## Notes

- This project uses ES6 modules, so it requires a local server to run (can't be opened directly as a file)
- All assets are now included locally, so no internet connection is required after initial setup
- The game is configured for 320x192 resolution with 3x scaling
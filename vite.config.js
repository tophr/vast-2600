import { defineConfig } from 'vite'

export default defineConfig({
  // Set the base URL for production deployment
  base: './',
  
  build: {
    // Output directory (default is 'dist')
    outDir: 'dist',
    
    // Keep the default public directory behavior
    copyPublicDir: true,
    
    // This controls where Vite puts processed assets
    assetsDir: 'assets'
  },
  
  // Configure how assets are handled
  publicDir: 'public'
})
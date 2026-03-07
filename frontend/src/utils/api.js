// Backend API URL Configuration
// Priority: Environment Variable > Auto-detection > Fallback

// Method 1: Use environment variable if available
const envApiUrl = import.meta.env.VITE_API_URL;

// Method 2: Auto-detect based on hostname
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

const autoDetectedUrl = isDevelopment
  ? "http://localhost:5000"
  : "https://ecommerce-shopping-1-ud3h.onrender.com";

// Use environment variable if set, otherwise use auto-detection
export const API_URL = envApiUrl || autoDetectedUrl;

// Log for debugging (you can remove this later)
console.log('🔗 API URL:', API_URL);
console.log('📍 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🌐 Hostname:', window.location.hostname);



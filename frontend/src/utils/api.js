// Backend API URL Configuration
// Priority: Environment Variable > Auto-detection > Fallback

// Method 1: Use environment variable if available
const envApiUrl = import.meta.env.VITE_API_URL;

// Method 2: Auto-detect based on hostname
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

const autoDetectedUrl = isDevelopment
  ? "http://localhost:5000"
  : "https://ecommerce-shopping-4-3wdo.onrender.com";

// Use environment variable if set, otherwise use auto-detection
export const API_URL = envApiUrl || autoDetectedUrl;

// Production ready - debug logs removed



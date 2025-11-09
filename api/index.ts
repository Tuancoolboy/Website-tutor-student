/**
 * Vercel Serverless API Entry Point
 * This file is used by Vercel to handle API routes
 * 
 * Vercel can run Express app via serverless functions
 * WebSocket is NOT supported on Vercel (must deploy separately)
 * 
 * Note: Vercel automatically handles Express app when exported directly
 */

import app from '../server.js';

// Export Express app directly
// Vercel will automatically convert it to a serverless function handler
// The app.listen() call in server.ts is skipped when running on Vercel
export default app;


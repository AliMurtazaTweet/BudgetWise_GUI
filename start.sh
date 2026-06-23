#!/bin/sh

# Start the Next.js frontend server in the foreground
# It will bind to the PORT environment variable provided by Fly.io.
# All /api/** requests are served by the JS handlers under pages/api/.
echo "Starting BudgetWise Next.js Frontend..."
cd /app
npm run start

# Use Node.js as the base image
FROM node:20-bullseye

# Install g++ to compile the C++ backend
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the entire project
COPY . .

# 1. Compile the C++ Backend
WORKDIR /app/backend
RUN g++ -std=c++17 -Iinclude -pthread -O3 \
    api/*.cpp core/*.cpp managers/*.cpp utils/*.cpp \
    -o budgetwise_server

# 2. Build the Next.js Frontend
WORKDIR /app
RUN npm install
RUN npm run build

# Make the start script executable
RUN chmod +x /app/start.sh

# Fly.io injects the PORT environment variable (default 3000)
# We will expose 3000 for the frontend
ENV PORT=3000
EXPOSE 3000

# The start.sh script runs both the C++ backend and Node.js frontend
CMD ["/app/start.sh"]

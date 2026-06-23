# Use an official lightweight Ubuntu base image
FROM ubuntu:22.04

# Install g++ and necessary build tools
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the entire backend directory into the container
COPY . .

# Compile the C++ API Server
# We compile everything in api/, core/, managers/, and utils/ 
RUN g++ -std=c++17 -Iinclude -pthread -O3 \
    api/*.cpp core/*.cpp managers/*.cpp utils/*.cpp \
    -o budgetwise_server

# Create a data directory for the JSON files if it doesn't exist
RUN mkdir -p data

# Ensure the container listens on the port provided by the host environment (e.g. Render)
EXPOSE 8080

# Run the compiled server executable
CMD ["./budgetwise_server"]

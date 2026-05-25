# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY catchup-app/package*.json ./
RUN npm install
COPY catchup-app/ ./
RUN npm run build

# Stage 2: Set up the backend and serve the app
FROM node:22-alpine
WORKDIR /app

# Copy backend package files
COPY catchup-backend/package*.json ./catchup-backend/
RUN cd catchup-backend && npm install --production

# Copy backend source code
COPY catchup-backend/ ./catchup-backend/

# Copy built frontend assets from Stage 1 into the location expected by the backend
COPY --from=frontend-builder /app/frontend/dist ./catchup-app/dist

# Expose the port the app runs on
EXPOSE 5000

# Start the application from the backend directory
WORKDIR /app/catchup-backend
CMD ["node", "server.js"]

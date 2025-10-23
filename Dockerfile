# Use official Node image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install early to benefit from layer caching
COPY app/package.json ./
RUN npm ci --only=production

# Copy app
COPY app/ ./

# Expose port and start
EXPOSE 3000
CMD ["node", "server.js"]

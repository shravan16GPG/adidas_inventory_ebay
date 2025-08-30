# Use official Playwright image with all browsers
FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose service port
EXPOSE 3000

# Start scraper API
CMD ["node", "server.js"]   

FROM node:20-alpine

# Create app directory
WORKDIR /app/docusaurus

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm ci --only=production && npm cache clean --force

# Bundle app source
COPY docs ./docs
COPY src ./src
COPY static ./static
COPY subkey ./subkey
COPY babel.config.js .
COPY  docusaurus-2.json .
COPY docusaurus.config.js .
COPY sidebars.js .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "serve"]

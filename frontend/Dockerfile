FROM node:20-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# React dev servers usually run on 3000 (CRA) or 5173 (Vite)
EXPOSE 6000

# Start the actual dev server script from your package.json
CMD ["npm", "start"]
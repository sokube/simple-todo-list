FROM node:14.3.0-alpine
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Define port, user and command
EXPOSE 8080
USER node
CMD [ "node", "app" ]
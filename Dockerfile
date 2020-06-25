FROM node:lts-buster-slim

ARG BUILD_DATE
ARG COMMIT

LABEL maintainer="Fabrice Vergnenegre <fabrice.vergnenegre@sokube.ch>, Quentin HENNEAUX <quentin.henneaux@sokube.ch>" \
      build_date=$BUILD_DATE \
      commit=$COMMIT \
      io.k8s.description="Sokube Simple Todo" \
      io.k8s.display-name="sokube-simple-todo"

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production \
    && npm cache clean --force 

# Bundle app source
COPY . .
RUN chown -R node:node /usr/src/app

# Define port, user and command
EXPOSE 8080
USER node
CMD [ "npm", "start" ]
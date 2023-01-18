# Base image
FROM node:16-alpine


RUN rm -rf /var/lib/apt/lists/* && apk update
RUN apk add busybox-extras vim git
RUN npm install -g nodemon ts-node@10.8.1 typescript pm2 --unsafe-perm=true --allow-root

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Clear old entrypoint
RUN rm -rf /usr/local/bin/docker-entrypoint.sh
COPY docker-entrypoint.sh /usr/local/bin/
RUN sed -i -e 's/\r$//' /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && ln -s /usr/local/bin/docker-entrypoint.sh /
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 8080
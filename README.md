# Glopr-chat-app  (NESTJS)
Link swagger: https://chat-glopr-dev.up.railway.app/api/#/

## Requirements

* **nodejs >= v16.0.0**
* **npm >= v8.5.0**

## Run app by npm
### B1: Install module
```bash
npm install
```
### B2: Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
​
## Run app by docker
### B1: Build docker-compose
```bash
docker-compose build
```
### B2: Run project
```bash
docker-compose up / docker-compose up -d
```
### B3: Stop project
```bash
docker-compose down
```
### View logs docker
```bash
docker-compose logs -f web (web is service name of project)
```
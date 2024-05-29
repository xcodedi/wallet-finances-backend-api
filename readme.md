# wallet APP API (BACK_END)

## INTRODUCTION

THIS API USE:

DOCKER (https://www.docker.com)
NODE.JS (https://nodejs.org)
EXPRESS (https://expressjs.com)
POSTGRESQL (https://www.postgresql.org)

The main goal is create an application that controls user finances

---

# Documentation

To test the API, use Insomnia to import the file below:
https://github.com/xcodedi/wallet-finances/blob/main/Insomnia.json

## Steps to run the project

1.  Git clone

https://github.com/xcodedi/wallet-finances.git

---

2.  Navigate to the project folder and install dependencies
    cd wallet-backend
    (npm install)
    cd myapp
    (npm install)

---

3.  Create a PostgreSQL instance using Docker

Example:
docker run --name postgres-finances -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=docker -p
5432:5432 -d -t postgres

---

4. Create a .env file following the example below

db_user=docker
db_password=docker
db_name=finances
db_host=localhost
db_port=5432

--

5. Run the project

Configure scripts to create the database and tables in PostgreSQL
(npm run config:init)

Run the project in development mode
(npm run start:dev)

Run the project in production mode
(npm run start)

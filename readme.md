# Wallet APP API (BACK_END)

## Introduction

This API aims to be a financial management application, allowing users to perform various operations related to their finances. It provides functionalities such as adding, updating, viewing and deleting financial transactions, categories and user accounts. Additionally, it includes features for user authentication, including the use of API keys for authorization.

## Dependencies

To run the API, you need the following dependencies:

- [Docker](https://www.docker.com) - Containerization platform for developing, shipping, and running applications.
- [Node.js](https://nodejs.org) - JavaScript runtime environment.
- [Express](https://expressjs.com)- Web framework for Node.js.
- [PostgreSQL](https://www.postgresql.org) - Relational database management system.

## Steps to run the project

### Configuration of the Database

To set up the database, follow these steps:

1. Create a PostgreSQL instance using Docker:

   docker run --name postgres-finances -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=docker -p 5432:5432 -d -t postgres

2. Create a `.env` file in the project root directory like the example below:

   db_user=docker
   db_password=docker
   db_name=finances
   db_host=localhost
   db_port=5432

## Running the Project

To run the project, follow these steps:

1. Git clone the repository:

   git clone https://github.com/xcodedi/wallet-finances.git

2. Navigate to the project folder and install dependencies:

   cd wallet-backend
   (npm install)
   cd myapp
   (npm install)

3. Configure scripts to create the database and tables in PostgreSQL:

   npm run config:init

4. Run the project in development mode:

   npm run start:dev

5. Or run the project in production mode:

   npm run start

## Documentation

To test the API, use Insomnia to import the file below:
[Insomnia.json](https://github.com/xcodedi/wallet-finances/blob/main/Insomnia.json)

---

This README provides detailed instructions for setting up the project, configuring the PostgreSQL database, and running the API in development or production mode. Make sure to replace the API_KEY in the with your desired value.

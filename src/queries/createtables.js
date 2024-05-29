const db = require("../db");
const tableQueries = require("../queries/createtables");

const createTablesQueries = {
  createdatabase: () => {
    return {
      name: "create-database",
    };
  },
  createUsers: () => {
    return {
      name: "create-users",
      text: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL
      );`,
    };
  },
  createCategories: () => {
    return {
      name: "create-categories",
      text: `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL
      );`,
    };
  },
  createFinances: () => {
    return {
      name: "create-finances",
      text: `CREATE TABLE IF NOT EXISTS finances (
        id SERIAL PRIMARY KEY NOT NULL, 
        user_id INT, 
        category_id INT, 
        date DATE, 
        title TEXT, 
        value NUMERIC, 
        CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
        CONSTRAINT fk_categories FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
      );`,
    };
  },
};

module.exports = createTablesQueries;

const createTablesQueries = {
  createdatabase: {
    text: "CREATE DATABASE finances" /* Comando para criar o banco de dados 'finances' */,
  },
  createUsers: {
    text: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY NOT NULL, /* Campo 'id' como chave primária, auto-incremento, e não nulo */
        name TEXT NOT NULL, /* Campo 'name' como texto, não nulo */
        email TEXT UNIQUE NOT NULL /* Campo 'email' como texto, único, e não nulo */
      )`,
  },
  createCategories: {
    text: `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY NOT NULL, /* Campo 'id' como chave primária, auto-incremento, e não nulo */
        name TEXT NOT NULL /* Campo 'name' como texto, não nulo */
      )`,
  },
  createFinances: {
    text: `CREATE TABLE IF NOT EXISTS finances (
        id SERIAL PRIMARY KEY NOT NULL, /* Campo 'id' como chave primária, auto-incremento, e não nulo */
        user_id INT, /* Campo 'user_id' como inteiro */
        category_id INT, /* Campo 'category_id' como inteiro */
        date DATE, /* Campo 'date' como data */
        title TEXT, /* Campo 'title' como texto */
        value NUMERIC, /* Campo 'value' como numérico */
        CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, /* Chave estrangeira referenciando 'users(id)', com exclusão em cascata */
        CONSTRAINT fk_categories FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL /* Chave estrangeira referenciando 'categories(id)', com definição para NULL em exclusão */
      )`,
  },
};

module.exports = createTablesQueries; // Exporta o objeto contendo as queries para criação das tabelas

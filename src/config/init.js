const db = require("../db"); // Importa o módulo de banco de dados
const tableQueries = require("../queries/createtables"); // Importa as consultas para criar tabelas

db.connect() // Conecta ao banco de dados
  .then(async () => {
    try {
      await db.query(tableQueries.createUsers.text); // Cria a tabela de usuários, se não existir
      await db.query(tableQueries.createCategories.text); // Cria a tabela de categorias, se não existir
      await db.query(tableQueries.createFinances.text); // Cria a tabela de finanças, se não existir
      console.log("Tables created successfully or already exist!"); // Mensagem de sucesso
    } catch (error) {
      throw new Error("Error creating tables: " + error.message); // Lança um erro se houver um problema na criação das tabelas
    } finally {
      await db.end(); // Encerrar a conexão com o banco de dados após a execução
    }
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error.message); // Loga um erro se houver um problema na conexão
  });

const db = require("../db");
const tableQueries = require("../queries/createtables");

db.connect()
  .then(async () => {
    try {
      await db.query(tableQueries.createdatabase());
      await db.query(tableQueries.createUsers().text);
      await db.query(tableQueries.createCategories().text);
      await db.query(tableQueries.createFinances().text);
      console.log("Tabelas criadas com sucesso ou já existem!"); // Mensagem de sucesso
    } catch (error) {
      throw new Error("Erro ao criar tabelas: " + error.message);
    } finally {
      await db.end(); // Encerrar a conexão com o banco de dados após a execução
    }
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados: " + error.message);
  });

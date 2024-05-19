const express = require("express");
const db = require("./db"); // Certifique-se de que este caminho está correto
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Rota para consultar a tabela 'categories'
app.get("/categories", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao consultar o banco de dados:", err);
    res.status(500).send("Erro ao consultar o banco de dados");
  }
});

app.listen(port, async () => {
  try {
    await db.connect();
    console.log("Conectado ao banco de dados");
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
  console.log(`Example app listening on port ${port}`);
});

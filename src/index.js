const express = require("express");
const db = require("./db"); //Caminho atualizado
const categoriesRouter = require("./routes/categories");
const app = express();
const port = 3000;

app.use(express.json()); //Middleware para analisar o corpo das requisições JSON

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//roteador de categorias
app.use("/categories", categoriesRouter);

app.listen(port, async () => {
  try {
    await db.connect();
    console.log("Conectado ao banco de dados");
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
  console.log(`Example app listening on port ${port}`);
});

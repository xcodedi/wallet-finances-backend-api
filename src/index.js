require("dotenv").config();
const express = require("express"); // Importa o módulo express
const cors = require("cors"); // Importa o módulo cors
const db = require("./db"); // Importa a instância do Pool do PostgreSQL
const app = express(); // Cria uma instância do aplicativo express
const port = process.env.port; // Define a porta do servidor

app.use(express.json()); // Middleware para analisar corpos de solicitação JSON

app.use(
  cors({
    origin: "*", // Define a origem permitida para todas as solicitações,caso for para aplicação http....
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!"); // Rota principal que retorna "Hello World!"
});

// Rotas para as categorias
const categoriesRouter = require("./routes/categories"); // Importa o roteador de categorias
app.use("/categories", categoriesRouter); // Define o caminho base para as rotas de categorias

// Rotas para os usuários
const usersRouter = require("./routes/users"); // Importa o roteador de usuários
app.use("/users", usersRouter); // Define o caminho base para as rotas de usuários

// Rotas para as finanças
const financesRouter = require("./routes/finances"); // Importa o roteador de finanças
app.use("/finances", financesRouter); // Define o caminho base para as rotas de finanças

app.listen(port, async () => {
  try {
    await db.connect(); // Conecta ao banco de dados PostgreSQL
    console.log("Connected to the database"); // Loga a mensagem de conexão bem-sucedida
  } catch (err) {
    console.error("Error connecting to the database:", err); // Loga um erro se houver problemas na conexão
  }
  console.log(`Example app listening on port ${port}`); // Loga a mensagem indicando que o servidor está ouvindo na porta especificada
});

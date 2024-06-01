require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env
const { Pool } = require("pg"); // Importa o módulo Pool do pacote pg (PostgreSQL)

// Desestrutura variáveis de ambiente necessárias para configurar a conexão com o banco de dados
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

// Cria uma nova instância do Pool do PostgreSQL com as configurações do banco de dados
const db = new Pool({
  user: DB_USER, // Nome do usuário do banco de dados
  password: DB_PASSWORD, // Senha do usuário do banco de dados
  database: DB_NAME, // Nome do banco de dados
  host: DB_HOST, // Endereço do host do banco de dados
  port: Number(DB_PORT), // Porta do banco de dados, convertida para número
});

module.exports = db; // Exporta a instância do Pool para ser utilizada em outras partes da aplicação

require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env
const { Pool } = require("pg"); // Importa o módulo Pool do pacote pg (PostgreSQL)

// Desestrutura variáveis de ambiente necessárias para configurar a conexão com o banco de dados
const { db_user, db_password, db_name, db_host, db_port } = process.env;

// Cria uma nova instância do Pool do PostgreSQL com as configurações do banco de dados
const db = new Pool({
  user: db_user, // Nome do usuário do banco de dados
  password: db_password, // Senha do usuário do banco de dados
  database: db_name, // Nome do banco de dados
  host: db_host, // Endereço do host do banco de dados
  port: Number(db_port), // Porta do banco de dados, convertida para número
});

module.exports = db; // Exporta a instância do Pool para ser utilizada em outras partes da aplicação

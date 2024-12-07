const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const router = require('./src/routes/routes');
const app = express();

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.json()); // Parse de JSON no corpo da requisição

// Suas rotas
app.use(router);

// Porta da aplicação
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota padrão para teste
app.get('/', (request, response) => {
  response.send('Servidor está funcionando!');
});

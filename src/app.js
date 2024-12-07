const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const app = express();

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Importar rotas
const routes = require('./routes');

// Definir rotas
app.use('/api', routes);

// Inicializar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

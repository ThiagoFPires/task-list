const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const router = require('./src/routes/routes');
const app = express();

dotenv.config();

const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/', (request, response) => {
  response.send('Servidor está funcionando!');
});

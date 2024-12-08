const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class AuthController {
  // Registrar novo usuário
  async register(req, res) {
    const { email, senha } = req.body;

    try {
      // Verifica se já existe um usuário com o email informado
      const userExists = await prisma.usuario.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criptografando a senha com bcrypt
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Criando novo usuário no banco de dados
      const newUser = await prisma.usuario.create({
        data: {
          email,
          senha: hashedPassword,
        },
      });

      // Gerando o token JWT
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Respondendo com sucesso e o token JWT
      return res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: newUser,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  // Login de usuário
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      // Verificando se o usuário existe
      const user = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Comparando a senha fornecida com a senha criptografada
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerando o token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Respondendo com sucesso e o token JWT
      return res.json({
        message: 'Login bem-sucedido',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Middleware de autenticação
  async authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    // Verificando se o token não foi fornecido
    if (!token) {
      console.log('Token não fornecido');
      return res.status(403).json({
        success: false,
        message: 'Token não fornecido',
        details: 'Você precisa fornecer um token no cabeçalho Authorization usando o formato "Bearer <token>"',
      });
    }

    try {
      // Decodificando o token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Armazenar informações do usuário para a próxima etapa
      req.userId = decoded.id;
      console.log('Token válido:', decoded); // Log para depuração

      // Permitir o próximo middleware ou ação
      next();
    } catch (error) {
      // Se o token for inválido ou expirado
      console.log('Erro ao verificar o token:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        details: 'O token fornecido é inválido ou expirou. Por favor, faça login novamente.',
      });
    }
  }
}

module.exports = new AuthController();

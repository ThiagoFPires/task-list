const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class AuthController {
  // registra novo usuario
  async register(req, res) {
    const { email, senha } = req.body;

    //verifica se já tem esse usuário cadastrado
    try {
      const userExists = await prisma.usuario.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const newUser = await prisma.usuario.create({
        data: { email, senha: hashedPassword },
      });

         // gerando token jwt
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

      return res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser,
        token,
       });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  // Login do usuário
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const user = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar o token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Middleware de autenticação
  async authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
  
    // Verificar se o token não foi fornecido
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

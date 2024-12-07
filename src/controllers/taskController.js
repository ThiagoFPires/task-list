const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../utils/pagination');

class TaskController {
  // Buscar todas as tarefas
  async getAll(req, res) {
    const { page = 1, pageSize = 10 } = req.query;
    const pagination = getPagination(page, pageSize);

    try {
      const tasks = await prisma.tarefa.findMany({
        skip: pagination.skip,
        take: pagination.take,
        include: {
          historicos: true,
        },
      });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  }

  // Buscar tarefa por ID
  async getById(req, res) {
    const { id } = req.params;

    try {
      const task = await prisma.tarefa.findUnique({
        where: { id: parseInt(id) },
        include: {
          historicos: true,
        },
      });

      if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
  }

  // Criar uma nova tarefa
  async create(req, res) {
    const { titulo, descricao, status, usuarioId, prioridade } = req.body;

    try {
      const novaTask = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          status: status || 'pendente',
          prioridade: prioridade || 'baixa',
          usuarioId,
        },
      });

      res.json(novaTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  }

  // Atualizar tarefa
  async update(req, res) {
    const { id } = req.params;
    const { titulo, descricao, status, prioridade } = req.body;

    try {
      const atualizarTask = await prisma.tarefa.update({
        where: { id: parseInt(id) },
        data: {
          titulo,
          descricao,
          status,
          prioridade,
        },
      });

      res.json(atualizarTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
  }

  // Deletar tarefa
  async delete(req, res) {
    const { id } = req.params;

    try {
      await prisma.tarefa.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: 'Tarefa deletada com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
  }

  // Estatísticas de tarefas
  async statistics(req, res) {
    try {
      console.log('Iniciando consulta de estatísticas...');

      const totalTasks = await prisma.tarefa.count();
      console.log('Total de tarefas:', totalTasks);

      const pendingPriorityAvg = await prisma.tarefa.aggregate({
        where: { status: 'pendente' },
        _avg: { prioridade: true },
      });
      console.log('Média de prioridade das tarefas pendentes:', pendingPriorityAvg);

      const recentCompletedTasks = await prisma.tarefa.count({
        where: {
          status: 'concluida',
          criadoEm: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Tarefas concluídas nos últimos 7 dias
          },
        },
      });
      console.log('Tarefas concluídas nos últimos 7 dias:', recentCompletedTasks);

      res.json({
        totalTasks,
        pendingPriorityAvg,
        recentCompletedTasks,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
  
}

module.exports = new TaskController();

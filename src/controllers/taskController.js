const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../utils/pagination');

class TaskController {
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

  async create(req, res) {
    const { titulo, descricao, prioridade, usuarioId } = req.body;

    try {
      const newTask = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          prioridade,
          usuarioId,
        },
      });

      res.json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { titulo, descricao, status, prioridade } = req.body;

    try {
      const updatedTask = await prisma.tarefa.update({
        where: { id: parseInt(id) },
        data: { titulo, descricao, status, prioridade },
      });

      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
  }

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

  async statistics(req, res) {
    try {
      const totalTasks = await prisma.tarefa.count();
      const pendingPriorityAvg = await prisma.tarefa.aggregate({
        where: { status: 'pendente' },
        _avg: { prioridade: true },
      });

      const recentCompletedTasks = await prisma.tarefa.count({
        where: {
          status: 'concluída',
          criadoEm: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      });

      res.json({
        totalTasks,
        pendingPriorityAvg,
        recentCompletedTasks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }
}

module.exports = new TaskController();

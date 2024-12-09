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

    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const task = await prisma.tarefa.findUnique({
        where: {
          id: taskId,
        },
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
    const { titulo, descricao, status, usuarioId, prioridade } = req.body;

    try {
      const novaTask = await prisma.tarefa.create({
        data: {
          titulo,
          descricao,
          status,
          prioridade,
          usuarioId,
        },
      });

      res.status(201).json(novaTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  }

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
      console.log('Iniciando consulta de estatísticas...');

      const totalTasks = await prisma.tarefa.count();
      console.log('Total de tarefas:', totalTasks);

      const tasksPendentes = await prisma.tarefa.findMany({
        where: { status: 'pendente' },
        select: {
          id: true,
          prioridade: true
        },
      });

      console.log('Tarefas pendentes:', tasksPendentes);

      const prioridadeMapeamento = {
        BAIXA: 1,
        MEDIA: 2,
        ALTA: 3,
      };

      const totalPrioridade = tasksPendentes.reduce((sum, task) => {

      const prioridadeValor = prioridadeMapeamento[task.prioridade?.toUpperCase()];

        console.log(`Tarefa ID: ${task.id}, Prioridade: ${task.prioridade}, Mapeada como: ${prioridadeValor}`);
  
        if (prioridadeValor) {
          return sum + prioridadeValor;
        }
        console.log(`Prioridade inválida para a tarefa com id: ${task.id}`);
        return sum;
      }, 0);

      const mediaDePrioridadePendente = tasksPendentes.length > 0 ? totalPrioridade / tasksPendentes.length : 0;
      console.log('Média de prioridade das tarefas pendentes:', mediaDePrioridadePendente);

      const tasksCompletasRecentes = await prisma.tarefa.count({
        where: {
          status: 'concluida',
          criadoEm: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Tarefas concluídas nos últimos 7 dias
          },
        },
      });
      console.log('Tarefas concluídas nos últimos 7 dias:', tasksCompletasRecentes);

      res.json({
        totalTasks,
        mediaDePrioridadePendente,
        tasksCompletasRecentes,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }


}

module.exports = new TaskController();

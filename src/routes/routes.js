const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

// Autenticação
router.post('/auth', authController.login);

// Tarefas
router.get('/tasks', taskController.getAll);
router.get('/tasks/:id', taskController.getById);
router.post('/tasks', taskController.create);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.delete);

// Estatísticas
router.get('/tasks/statistics', taskController.statistics);

module.exports = router;

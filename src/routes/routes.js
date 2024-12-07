const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

// Autenticação
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Tarefas
router.get('/tasks', taskController.getAll, authController.authenticate);
router.get('/tasks/:id', taskController.getById, authController.authenticate);
router.post('/tasks', taskController.create, authController.authenticate);
router.put('/tasks/:id', taskController.update, authController.authenticate);
router.delete('/tasks/:id', taskController.delete, authController.authenticate);

// Estatísticas
router.get('/tasks/statistics', taskController.statistics, authController.authenticate);


module.exports = router;

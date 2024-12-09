const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

router.get('/tasks', taskController.getAll, authController.authenticate);
router.get('/tasks/:id', taskController.getById, authController.authenticate);
router.post('/tasks', taskController.create, authController.authenticate);
router.put('/tasks/:id', taskController.update, authController.authenticate);
router.delete('/tasks/:id', taskController.delete, authController.authenticate);

router.get('/tasks/statistics/:id', taskController.statistics, authController.authenticate);


module.exports = router;

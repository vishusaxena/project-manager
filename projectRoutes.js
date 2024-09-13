const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

const { createTask, getTasks,updateTask } = require('../controllers/taskController');

const router = express.Router();

// Project routes
router.route('/')
    .post(protect, createProject)
    .get(protect, getProjects);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject)
    .delete(protect, deleteProject);

// Task routes for a specific project
router.route('/:projectId/tasks')
    .post(protect, createTask)
    .get(protect, getTasks)
    
router.route('/:projectId/tasks/:taskId').put(protect, updateTask);

module.exports = router;

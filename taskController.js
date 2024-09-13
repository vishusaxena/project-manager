const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a new task in a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
exports.createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;

    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = new Task({
            title,
            description,
            project: req.params.projectId,
            user: req.user._id,
            dueDate,
        });

        await task.save();

        // Add task to the project
        project.tasks.push(task);
        await project.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Private
exports.updateTask = async (req, res) => {
    const { projectId, taskId } = req.params;
    const { status, title, description, dueDate } = req.body;

    try {
        // Find the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the task by ID within the project (using array find method)
        const task = project.tasks.find(task => task._id.toString() === taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task's fields
        if (status) task.status = status;
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;

        // Save the updated project with the modified task
        await project.save();
      
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.remove();
        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

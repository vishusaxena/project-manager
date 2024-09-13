const Project = require('../models/Project');
const mongoose = require('mongoose');
// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    const { name, description } = req.body;

    try {
        const project = new Project({
            name,
            description,
            user: req.user._id,
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('tasks');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
    const { name, description } = req.body;

    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.updatedAt = Date.now();

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
    try {console.log(req.params.id); // Log the project ID being passed
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid Project ID' });
        }
    
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
    
        res.status(200).json({ message: 'Project deleted successfully' });
      } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: error.message });
      }
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'; 
import { AiOutlineHome } from 'react-icons/ai'; // For the home icon
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; // Icons for buttons

Modal.setAppElement('#root'); 

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [editProject, setEditProject] = useState(null); 

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await axios.get('http://localhost:5000/api', {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      });
      setProjects(data);
    };

    fetchProjects();
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setName('');
    setDescription('');
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (project) => {
    setEditProject(project);
    setName(project.name);
    setDescription(project.description);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditProject(null);
    setName('');
    setDescription('');
  };

  const createProjectHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api',
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        }
      );
      setProjects([...projects, data]);
      closeAddModal();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProjectHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      });
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const updateProjectHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/${editProject._id}`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        }
      );
      setProjects(projects.map((project) => (project._id === data._id ? data : project)));
      closeEditModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
        <Link to="/" className="text-blue-500 hover:text-blue-700 transition-colors">
          <AiOutlineHome size={36} />
        </Link>
      </div>

      <button
        onClick={openAddModal}
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-700 transition-all flex items-center space-x-2"
      >
        <AiOutlinePlus size={20} />
        <span>Add Project</span>
      </button>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex justify-between mt-6">
              <Link
                to={`/${project._id}`}
                className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                View Details
              </Link>
              <div className="flex space-x-4">
                <button
                  onClick={() => openEditModal(project)}
                  className="text-yellow-500 font-medium hover:text-yellow-700 transition-colors flex items-center space-x-1"
                >
                  <AiOutlineEdit size={18} />
                  <span>Update</span>
                </button>
                <button
                  onClick={() => deleteProjectHandler(project._id)}
                  className="text-red-500 font-medium hover:text-red-700 transition-colors flex items-center space-x-1"
                >
                  <AiOutlineDelete size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding project */}
      <Modal
  isOpen={isAddModalOpen}
  onRequestClose={closeAddModal}
  contentLabel="Add Project"
  className="modal-content p-8 bg-white rounded-lg shadow-2xl max-w-lg mx-auto"
>
  <div className="border-b pb-4 mb-4">
    <h2 className="text-3xl font-bold text-center text-indigo-700">Add a New Project</h2>
    <p className="text-center text-gray-500">Fill in the details below to add a new project to your dashboard.</p>
  </div>
  <form onSubmit={createProjectHandler}>
    <input
      type="text"
      placeholder="Project Name"
      className="mb-3 p-3 w-full border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <textarea
      placeholder="Project Description"
      className="mb-4 p-3 w-full border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
    <button
      type="submit"
      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all w-full"
    >
      Add Project
    </button>
  </form>
  <button
    onClick={closeAddModal}
    className="text-indigo-500 mt-6 text-sm underline hover:text-indigo-700 transition-colors block text-center"
  >
    Cancel
  </button>
</Modal>


      {/* Modal for updating project */}
      <Modal
  isOpen={isEditModalOpen}
  onRequestClose={closeEditModal}
  contentLabel="Update Project"
  className="modal-content p-8 bg-white rounded-lg shadow-2xl max-w-lg mx-auto"
>
  <div className="border-b pb-4 mb-4">
    <h2 className="text-3xl font-bold text-indigo-700">Update Project</h2>
    <p className="text-center text-gray-500">Modify the project details below and save the changes.</p>
  </div>
  <form onSubmit={updateProjectHandler}>
    <input
      type="text"
      placeholder="Project Name"
      className="mb-3 p-3 w-full border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <textarea
      placeholder="Project Description"
      className="mb-4 p-3 w-full border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
    <button
      type="submit"
      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all w-full"
    >
      Update Project
    </button>
  </form>
  <button
    onClick={closeEditModal}
    className="text-indigo-500 mt-6 text-sm underline hover:text-indigo-700 transition-colors block text-center"
  >
    Cancel
  </button>
</Modal>

    </div>
  );
}

export default Dashboard;

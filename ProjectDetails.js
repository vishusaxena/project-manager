import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isTaskDetailModal, setIsTaskDetailModal] = useState(false); // To toggle between task details and add task form
  const [selectedTask, setSelectedTask] = useState(null); // For showing task details
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: ''
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/${id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        });
        setProject(data);
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const addTaskHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/${id}/tasks`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        }
      );
      setTasks([...tasks, data]);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        dueDate: ''
      });
      setShowModal(false); // Close modal after adding the task
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskHandler = async (taskId, updatedStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/${id}/tasks/${taskId}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        }
      );
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: updatedStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // Split tasks into sections
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Modal for showing task details
  const openTaskDetailsModal = (task) => {
    setSelectedTask(task);
    setIsTaskDetailModal(true); // Set to true for task details modal
    setShowModal(true);
  };

  // Open modal for adding new task
  const openAddTaskModal = () => {
    setIsTaskDetailModal(false); // Set to false for add task modal
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{project.name}</h1>
        <p className="text-lg text-gray-600 mb-6">{project.description}</p>

        {/* Task Sections */}
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Tasks</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <div>
            <h3 className="text-xl font-semibold text-yellow-600 mb-3">Pending</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg cursor-pointer"
                  onClick={() => openTaskDetailsModal(task)}
                >
                  <div className="font-bold text-gray-700">{task.title}</div>
                  <button
                    className="text-xs text-gray-500 mt-2 bg-blue-200 py-1 px-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      updateTaskHandler(task._id, 'in-progress');
                    }}
                  >
                    Mark In Progress
                  </button>
                </div>
              ))}
              {pendingTasks.length === 0 && <p className="text-gray-500">No pending tasks</p>}
            </div>
          </div>

          {/* In-Progress Tasks */}
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-3">In Progress</h3>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3 bg-blue-100 border border-blue-300 rounded-lg cursor-pointer"
                  onClick={() => openTaskDetailsModal(task)}
                >
                  <div className="font-bold text-gray-700">{task.title}</div>
                  <button
                    className="text-xs text-gray-500 mt-2 bg-green-200 py-1 px-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTaskHandler(task._id, 'completed');
                    }}
                  >
                    Mark Completed
                  </button>
                </div>
              ))}
              {inProgressTasks.length === 0 && <p className="text-gray-500">No in-progress tasks</p>}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h3 className="text-xl font-semibold text-green-600 mb-3">Completed</h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3 bg-green-100 border border-green-300 rounded-lg cursor-pointer"
                  onClick={() => openTaskDetailsModal(task)}
                >
                  <div className="font-bold text-gray-700">{task.title}</div>
                </div>
              ))}
              {completedTasks.length === 0 && <p className="text-gray-500">No completed tasks</p>}
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        <button
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
          onClick={openAddTaskModal}
        >
          Add Task
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg">
            {isTaskDetailModal ? (
              // Task Details Modal
              <>
                <h3 className="text-2xl font-bold mb-4 text-gray-700">{selectedTask?.title}</h3>
                <p className="text-sm text-gray-500">{selectedTask?.description}</p>
                <p className="text-xs text-gray-400">Due: {selectedTask?.dueDate}</p>
              </>
            ) : (
              // Add Task Form Modal
              <>
                <h3 className="text-2xl font-bold mb-4 text-gray-700">Add New Task</h3>
                <form onSubmit={addTaskHandler}>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                    className="w-full mb-4 p-2 border rounded-lg"
                  />
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                    className="w-full mb-4 p-2 border rounded-lg"
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
                  >
                    Add Task
                  </button>
                </form>
              </>
            )}
            <button
              className="mt-4 bg-red-500 text-white p-3 rounded-lg w-full hover:bg-red-600"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;

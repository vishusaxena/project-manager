import React, { useState } from 'react';
import axios from 'axios';

function AddProjectForm({ onProjectAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/',
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        }
      );
      onProjectAdded(data); // Notify parent component to update project list
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <input
        type="text"
        placeholder="Project Name"
        className="mb-2 p-2 w-full border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Project Description"
        className="mb-4 p-2 w-full border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Add Project
      </button>
    </form>
  );
}

export default AddProjectForm;

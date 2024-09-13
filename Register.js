import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      history('/login');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-500 p-6">
      <div className="w-full max-w-md">
        <form onSubmit={registerHandler} className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Register</h1>
          <input
            type="text"
            placeholder="Name"
            className="mb-3 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-3 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-6 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded shadow">
            Register
          </button>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <Link to="/login" className="hover:text-green-500">Already have an account? Login</Link>
            <Link to="/" className="hover:text-green-500">Need Help?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      history('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <div className="w-full max-w-md">
        <form onSubmit={loginHandler} className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Login</h1>
          <input
            type="email"
            placeholder="Email"
            className="mb-3 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-6 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded shadow">
            Login
          </button>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <Link to="/register" className="hover:text-blue-500">Don’t have an account? Register</Link>
            <Link to="/" className="hover:text-blue-500">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
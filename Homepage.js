import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Homepage() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token || ''}`,
          },
        });
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const onProjectAdded = (newProject) => {
    setProjects([...projects, newProject]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-6">
          <Link to="/" className="text-3xl font-bold text-blue-600 hover:text-blue-800">
            ProjectManager Pro
          </Link>
          <div className="space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('userInfo');
                    window.location.reload();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to ProjectManager Pro</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Manage your projects efficiently with our easy-to-use project management tool.
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              Login to Get Started
            </Link>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="p-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Card 1: Register or Login */}
            <div className="bg-white p-8 shadow-lg rounded-lg text-center hover:shadow-xl transition duration-300 ease-in-out">
              <div className="bg-blue-600 text-white p-5 rounded-full inline-block mb-6">
                <i className="fas fa-user-plus text-3xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 1: Register or Login
              </h3>
              <p className="text-gray-600">Create an account or log in to access your projects.</p>
            </div>

            {/* Card 2: Create a Project */}
            <div className="bg-white p-8 shadow-lg rounded-lg text-center hover:shadow-xl transition duration-300 ease-in-out">
              <div className="bg-blue-600 text-white p-5 rounded-full inline-block mb-6">
                <i className="fas fa-folder-plus text-3xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 2: Create a Project
              </h3>
              <p className="text-gray-600">Add details for your new project and track your tasks.</p>
            </div>

            {/* Card 3: Collaborate */}
            <div className="bg-white p-8 shadow-lg rounded-lg text-center hover:shadow-xl transition duration-300 ease-in-out">
              <div className="bg-blue-600 text-white p-5 rounded-full inline-block mb-6">
                <i className="fas fa-users text-3xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 3: Collaborate
              </h3>
              <p className="text-gray-600">
                Invite team members and start working on your project together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="p-16 bg-blue-600 text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Get In Touch</h2>
          <p className="text-center mb-12 max-w-xl mx-auto">
            Have any questions or need help? Feel free to contact us by filling out the form below.
          </p>
          <form className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-lg mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full p-4 rounded text-gray-900"
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-4 rounded text-gray-900"
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
              />
            </div>
            <div>
              <label className="block text-lg mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full p-4 rounded text-gray-900"
                id="message"
                name="message"
                placeholder="Your Message"
                rows="5"
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Recently Added Projects */}
      {projects.length > 0 && (
        <section className="p-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6">Recently Added Projects</h2>
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project._id} className="p-6 bg-white shadow rounded">
                  <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-8">
        <div className="container mx-auto text-center space-y-4">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} ProjectManager Pro. All rights reserved.
          </p>
        
        </div>
      </footer>
    </div>
  );
}

export default Homepage;

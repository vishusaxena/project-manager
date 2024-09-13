import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProjectDetails from './components/ProjectDetails';
import Homepage from './components/Homepage'; // Import Homepage


function App() {
  return (
    <Router>
      <Routes>
              <Route path="/" exact element={<Homepage/>} />

      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/:id" element={<ProjectDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;

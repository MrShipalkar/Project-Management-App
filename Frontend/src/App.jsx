import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import Dashboard from './pages/dashboard/dashboard'; // Import the Dashboard component
import PublicTaskPage from './pages/publicTaskPage/PublicTaskPage'; // Import the PublicTaskPage component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Router>
      <ToastContainer  />

        <Routes>
          {/* Use the element prop for rendering components */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} /> {/* Add Dashboard Route */}
          <Route path="/task/:taskId" element={<PublicTaskPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

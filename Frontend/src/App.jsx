import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import Dashboard from './pages/dashboard/Dashboard'; 
import PublicTaskPage from './pages/publicTaskPage/PublicTaskPage'; 
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Router>
      <ToastContainer  />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} /> 
          <Route path="/task/:taskId" element={<PublicTaskPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

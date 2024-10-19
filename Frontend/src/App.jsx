import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import Dashboard from './pages/dashboard/dashboard'; // Import the Dashboard component

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Use the element prop for rendering components */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} /> {/* Add Dashboard Route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

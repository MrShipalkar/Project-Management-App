import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Use the element prop instead of component in React Router v6 */}
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

  import './App.css';
  import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
  import NavBar from './components/NavBar';
  import Login from './pages/Login';
  import Crimes from './pages/Crimes';

  function App() {
    return (
      <Router>
        <NavBar />
        <Routes>
          <Route path="/Crimes" element={<Crimes/>} />
        </Routes>
      </Router>
    );
  }

  export default App;


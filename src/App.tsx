import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroForm from './components/UX/Pages/RegistroForm';
import LoginForm from './components/UX/Pages/LoginForm';
import Landing from './components/UX/Pages/Landing';
import Navbar from './components/UI/NavBar';
import EventForm from './components/UX/Pages/EventoForm';
import EventList from './components/UX/Pages/EventList';
import EventDetail from './components/UX/Pages/EventDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistroForm />} />
        <Route path="/create" element={<EventForm />} />
        <Route path="/events-list" element={<EventList />} />
        {/* Ruta dinámica corregida */}
        <Route path="/evento/:id" element={<EventDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import AltaMonotributoForm from "./Components/AltaMonotributo";
import BajaMonotributoForm from "./Components/BajaMonotributo";
import RecategorizacionMonotributoForm from "./Components/Recategorizacion.jsx";
import Slide from "./Components/Slide";
import Servicio from "./Components/Card.jsx";
import Footer from "./Components/Footer";
import alta from './Components/alta.png';
import baja from './Components/baja.png';
import Consultas from "./Components/Consultas.jsx";
import recategori from './Components/recategori.png';
import Process from './Components/Process.jsx';
import Contact from './Components/Contact.jsx';
import Terms from './Components/TerminosyCondiciones.jsx';
import PagoExitoso from "./Components/PagoExitoso.jsx";
import SolicitudesGrid from "./Components/adminPanel.jsx";
import Politicas from "./Components/PoliticasdePrivacidad.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Login from "./Components/Login.jsx";
import PagoFallido from "./Components/PagoFallido.jsx";
import './App.css'

// 👉 Componente Home
function Home({ servicios = [] }) {
  return (
    <>
      <Slide />
      <br />
      <h2>Nuestros servicios</h2>
      <p>
        Solicitá el servicio que necesites y en un plazo de, aproximadamente 48 hrs, 
        te enviamos la documentación
      </p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {servicios.map((s, i) => (
          <Servicio key={i} title={s.title} image={s.image} route={s.route} />
        ))}
      </div>
      <br />
      <Process />
      <br />
      <Consultas />
      <Contact />
    </>
  );
}

// 👉 App principal
function App() {
  const servicios = [
    { title: "Alta Monotributo", image: alta, route: "/alta-monotributo"},
    { title: "Baja Monotributo", image: baja , route: "/baja-monotributo"},
    { title: "Recategorización", image: recategori , route: "/recategorizacion"},
  ];

  const location = useLocation();

  return (
    <>
    <div className="app-container">
        <div className="main-content">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home servicios={servicios} />} />
        <Route path="/alta-monotributo" element={<AltaMonotributoForm />} />
        <Route path="/baja-monotributo" element={<BajaMonotributoForm />} />
         <Route path="/recategorizacion" element={<RecategorizacionMonotributoForm />} />
         <Route path="/proceso" element={<Process />} />
         <Route path="/contacto" element={<Contact />} />
         <Route path="/asesoramiento" element={<Consultas />} />
         <Route path="/home" element={<Home servicios={servicios} />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Politicas />} />
          <Route path="/pago-exitoso/:id" element={<PagoExitoso />} />
          <Route path="/pago-fallido/:id" element={<PagoFallido />} />

          <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <SolicitudesGrid />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
      </div>
      <Footer />
      </div>
    </>
  );
}

// 👉 Router envuelve todo
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

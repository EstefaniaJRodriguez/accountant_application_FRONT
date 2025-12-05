import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NavBar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from './logo.jpeg';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <>
      <Navbar data-bs-theme="dark">
        <Container>
          
          {/* Logo → Solo clickeable si NO estás en admin */}
          <Link to={isAdminRoute ? "#" : "/home"}>
            <img
              src={logo}
              className="d-inline-block align-top navbar-logo"
              alt="Logo"
              style={{ cursor: isAdminRoute ? "default" : "pointer" }}
            />
          </Link>

          {/* Si NO estoy en /admin → menú normal */}
          {!isAdminRoute && (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to='/home'>Home</Nav.Link>
              <NavDropdown title="Servicios" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/alta-monotributo">Alta Monotributo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/baja-monotributo">Baja Monotributo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/recategorizacion">Recategorización</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to='/proceso'>Proceso</Nav.Link>
              <Nav.Link as={Link} to='/asesoramiento'>Asesoramiento</Nav.Link>
              <Nav.Link as={Link} to='/contacto'>Contacto</Nav.Link>
            </Nav>
          )}

          {/* Si estoy en /admin → SOLO mostrar Logout */}
          {isAdminRoute && (
            <Nav className="ms-auto">
              <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                Cerrar sesión
              </Nav.Link>
            </Nav>
          )}

        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;

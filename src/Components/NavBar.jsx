import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NavBar.css'
import { Link, useLocation } from "react-router-dom";
import logo from './logo.jpeg';

function NavBar() {
  const location = useLocation(); // Hook para saber la ruta actual

  // Si la ruta incluye "/admin" (o la que uses), ocultamos los links
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <div>
        <Navbar data-bs-theme="dark">
          <Container>
            {/* Logo clickeable que lleva a /home */}
            <Link to="/home">
              <img
                src={logo}
                className="d-inline-block align-top navbar-logo"
                alt="Logo"
              />
            </Link>

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
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default NavBar;

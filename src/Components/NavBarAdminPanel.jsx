import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './NavBar.css'
import { Link } from "react-router-dom";
import logo from './logo.jpeg';

function NavBarAdminPanel() {
  return (
    <>
    <div >
      <Navbar data-bs-theme="dark">
        <Container>
        <img
         src={logo}
          className="d-inline-block align-top navbar-logo"
          alt="Logo"
        />
        </Container>
      </Navbar>
      </div>
      </>
  );
}

export default NavBarAdminPanel;
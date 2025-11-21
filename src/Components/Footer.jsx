import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './Footer.css';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // Ajusta según tu ruta de admin

  return (
    <Navbar data-bs-theme="dark">
      <Container className="footer-container footer">
        <div className="footer-wrapper text-center">
          {/* Contenido oculto en ruta admin */}
          {!isAdminRoute && (
            <>
              <p className="one-line">
                GEN Impositivo no está afiliado a la entidad ARCA ni a otra agencia gubernamental. Nuestro servicio se puede hacer de forma gratuita en el sitio oficial de ARCA.
              </p>
              <Container className="flex-column text-center mb-2">
                <Link to="/terminos" style={{ color: 'aliceblue', textDecoration: 'underline' }}>
                  Términos y Condiciones
                </Link>
                <br />
                <Link to="/privacidad" style={{ color: 'aliceblue', textDecoration: 'underline' }}>
                  Política de privacidad
                </Link>
              </Container>
            </>
          )}
          {/* Siempre visible, centrado */}
          <p className="mb-0">© 2025 Softer Company Development</p>
        </div>
      </Container>
    </Navbar>
  );
}

export default Footer;

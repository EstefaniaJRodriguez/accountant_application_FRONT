import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './Footer.css';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // Ajusta según tu ruta de admin

  return (
    <Navbar data-bs-theme="dark" expand="lg"> {/* <-- para que sea responsive */}
      <Container className="footer-container footer">
        <div className="footer-wrapper text-center w-100">
          {/* Contenido oculto en ruta admin */}
          {!isAdminRoute && (
            <>
              <p className="one-line text-wrap" style={{ wordBreak: 'break-word' }}>
                GEN Impositivo no está afiliado a la entidad ARCA ni a otra agencia gubernamental. Nuestro servicio se puede hacer de forma gratuita en el sitio oficial de ARCA.
              </p>
              <Container className="d-flex flex-column flex-sm-row justify-content-center mb-2 gap-2">
                <Link to="/terminos" style={{ color: 'aliceblue', textDecoration: 'underline' }}>
                  Términos y Condiciones
                </Link>
                <Link to="/privacidad" style={{ color: 'aliceblue', textDecoration: 'underline' }}>
                  Política de privacidad
                </Link>
              </Container>
            </>
          )}
          {/* Siempre visible, centrado */}
          <p className="mb-0 text-wrap" style={{ wordBreak: 'break-word' }}>© 2025 Softer Company Development</p>
        </div>
      </Container>
    </Navbar>
  );
}

export default Footer;

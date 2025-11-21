import Card from 'react-bootstrap/Card';
import Dos from "./numerodos.png";
import Uno from './numerouno.png';
import Tres from './numerotres.png';

import DosA from "./8.png";
import UnoA from './9.png';
import TresA from './10.png';

import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Process.css'

function Process() {
  return (
    <div>
      <br></br>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>¿Como funciona?</h2>
       <p>En tan solo tres pasos, te brindamos un servicio de excelencia.</p>
    <Container fluid className="text-center my-5">
      {/* Primer bloque */}
      <Row className="align-items-center justify-content-center mb-4">
        <Col xs={6} md={2} className="d-flex justify-content-center">
          <Image src={UnoA} rounded width={44} />
        </Col>
        <Col xs={12} md={8}>
          <Card className="p-3 process-card process-section">
            <h4>Seleccioná el servicio que desees</h4>
          </Card>
        </Col>
      </Row>

      {/* Segundo bloque */}
      <Row className="align-items-center justify-content-center mb-4">
        <Col xs={6} md={2} className="d-flex justify-content-center">
          <Image src={DosA} rounded width={60} />
        </Col>
        <Col xs={12} md={8}>
          <Card className="p-3 process-card process-section">
            <h4>Abona a través de Mercado Pago</h4>
          </Card>
        </Col>
      </Row>

      {/* Tercer bloque */}
      <Row className="align-items-center justify-content-center">
        <Col xs={6} md={2} className="d-flex justify-content-center">
          <Image src={TresA} rounded width={60}  />
        </Col>
        <Col xs={12} md={8}>
          <Card className="p-3 process-card process-section">
            <h4>En un plazo de, aproximadamente, 48 hrs nos pondremos en contacto para solicitarte información necesaria o enviarte la documentación final. </h4>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Process;

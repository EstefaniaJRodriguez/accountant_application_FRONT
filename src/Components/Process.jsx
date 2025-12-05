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
import './Process.css';

function Process() {
  return (
    <div>
      <br />
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>¿Cómo funciona?</h2>
      <p style={{ textAlign: 'center' }}>
        En tan solo tres pasos, te brindamos un servicio de excelencia.
      </p>

      <Container fluid className="text-center my-5">

        {/* Primer paso */}
        <Row className="align-items-center justify-content-center mb-4">
          <Col xs={12} md={3}>
            <div className="process-number">1</div>
            <Card className="p-4 process-card">
              <h4>Seleccioná tu servicio</h4>
              <p>
                Elegí el servicio contable que mejor se adapte a tus necesidades:
                monotributo, asesoría fiscal, liquidación de sueldos y más.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Segundo paso */}
        <Row className="align-items-center justify-content-center mb-4">
          <Col xs={12} md={3}>
            <div className="process-number">2</div>
            <Card className="p-4 process-card">
              <h4>Realizá el pago</h4>
              <p>
                Aboná de forma rápida y segura con Mercado Pago. Recibirás confirmación inmediata.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Tercer paso */}
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={3}>
            <div className="process-number">3</div>
            <Card className="p-4 process-card">
              <h4>Te contactamos</h4>
              <p>
                En un plazo de aproximadamente 48 horas, un profesional se comunicará con vos para continuar el proceso o enviarte la documentación final.
              </p>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default Process;

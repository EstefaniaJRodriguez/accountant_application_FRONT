import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Process.css';

function Process() {
  return (
    <div className="process-container">
      <br />
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
        ¿Cómo funciona?
      </h2>

      <p style={{ textAlign: 'center', marginBottom: '40px', color: '#555' }}>
        Contratar un contador profesional nunca fue tan fácil. En solo <b>3 simples pasos</b> tendrás la ayuda que necesitás.
      </p>

      <Container>
        <Row className="justify-content-center text-center">

          {/* PASO 1 */}
          <Col xs={12} md={4} className="mb-4">
            <div className="process-number">1</div>
            <Card className="process-card">
              <h4>Seleccioná tu servicio</h4>
              <p>
                Elegí el servicio contable que mejor se adapte a tus necesidades: monotributo, asesoría fiscal, liquidación de sueldos y más.
              </p>
            </Card>
          </Col>

          {/* PASO 2 */}
          <Col xs={12} md={4} className="mb-4">
            <div className="process-number">2</div>
            <Card className="process-card">
              <h4>Realizá el pago</h4>
              <p>
                Aboná de forma rápida y segura a través de Mercado Pago. Recibirás confirmación inmediata.
              </p>
            </Card>
          </Col>

          {/* PASO 3 */}
          <Col xs={12} md={4} className="mb-4">
            <div className="process-number">3</div>
            <Card className="process-card">
              <h4>Te contactamos</h4>
              <p>
                En un plazo aproximado de 48 horas, un profesional se comunicará con vos para continuar el proceso o enviarte la documentación final.
              </p>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
}

export default Process;

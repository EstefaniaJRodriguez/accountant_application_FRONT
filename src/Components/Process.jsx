// import Card from 'react-bootstrap/Card';
// import Dos from "./numerodos.png";
// import Uno from './numerouno.png';
// import Tres from './numerotres.png';

// import DosA from "./8.png";
// import UnoA from './9.png';
// import TresA from './10.png';

// import Container from 'react-bootstrap/Container';
// import Image from 'react-bootstrap/Image';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import './Process.css'

// function Process() {
//   return (
//     <div>
//       <br></br>
//       <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>¿Como funciona?</h2>
//        <p>En tan solo tres pasos, te brindamos un servicio de excelencia.</p>
//     <Container fluid className="text-center my-5">
//       {/* Primer bloque */}
//       <Row className="align-items-center justify-content-center mb-4">
//         <Col xs={6} md={2} className="d-flex justify-content-center">
//           <Image src={UnoA} rounded width={44} />
//         </Col>
//         <Col xs={12} md={8}>
//           <Card className="p-3 process-card process-section">
//             <h4>Seleccioná el servicio que desees</h4>
//           </Card>
//         </Col>
//       </Row>

//       {/* Segundo bloque */}
//       <Row className="align-items-center justify-content-center mb-4">
//         <Col xs={6} md={2} className="d-flex justify-content-center">
//           <Image src={DosA} rounded width={60} />
//         </Col>
//         <Col xs={12} md={8}>
//           <Card className="p-3 process-card process-section">
//             <h4>Abona a través de Mercado Pago</h4>
//           </Card>
//         </Col>
//       </Row>

//       {/* Tercer bloque */}
//       <Row className="align-items-center justify-content-center">
//         <Col xs={6} md={2} className="d-flex justify-content-center">
//           <Image src={TresA} rounded width={60}  />
//         </Col>
//         <Col xs={12} md={8}>
//           <Card className="p-3 process-card process-section">
//             <h4>En un plazo de, aproximadamente, 48 hrs nos pondremos en contacto para solicitarte información necesaria o enviarte la documentación final. </h4>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//     </div>
//   );
// }

// export default Process;
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './Process.css';

import UnoA from './9.png';
import DosA from './8.png';
import TresA from './10.png';

function Process() {
  return (
    <div className="process-wrapper">
      <Container className="text-center">

        <h2 className="process-title">¿Cómo funciona?</h2>
        <p className="process-subtitle">
          Contratar un contador profesional nunca fue tan fácil.  
          En solo <strong>3 simples pasos</strong> tendrás la ayuda que necesitás.
        </p>

        <Row className="justify-content-center mt-5">

          {/* Paso 1 */}
          <Col xs={12} md={4} className="mb-4">
            <Card className="process-card">
              <div className="process-icon">
                <img src={UnoA} alt="Paso 1" />
              </div>

              <h4 className="process-step-title">Seleccioná tu servicio</h4>
              <p className="process-step-text">
                Elegí el servicio contable que mejor se adapte a tus necesidades:
                monotributo, asesoría fiscal, liquidación de sueldos y más.
              </p>
            </Card>
          </Col>

          {/* Paso 2 */}
          <Col xs={12} md={4} className="mb-4">
            <Card className="process-card">
              <div className="process-icon">
                <img src={DosA} alt="Paso 2" />
              </div>

              <h4 className="process-step-title">Realizá el pago</h4>
              <p className="process-step-text">
                Aboná de forma rápida y segura con Mercado Pago.  
                Recibirás confirmación inmediata.
              </p>
            </Card>
          </Col>

          {/* Paso 3 */}
          <Col xs={12} md={4} className="mb-4">
            <Card className="process-card">
              <div className="process-icon">
                <img src={TresA} alt="Paso 3" />
              </div>

              <h4 className="process-step-title">Te contactamos</h4>
              <p className="process-step-text">
                En un plazo aproximado de 48 horas, un profesional se comunicará
                con vos para continuar el proceso o enviarte la documentación final.
              </p>
            </Card>
          </Col>

        </Row>

      </Container>
    </div>
  );
}

export default Process;

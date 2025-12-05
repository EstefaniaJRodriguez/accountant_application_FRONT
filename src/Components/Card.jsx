import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import './Card.css';

function Servicio({ title, image, route }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) navigate(route);
  };

  return (
    <Card className="servicio-card">
      <Card.Img className="servicio-img" variant="top" src={image} />
      <Card.Body className="servicio-body">
        <Card.Title className="servicio-title">{title}</Card.Title>
        <Button className="servicio-btn" onClick={handleClick}>
          Solicitar
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Servicio;

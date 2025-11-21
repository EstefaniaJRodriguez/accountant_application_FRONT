import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import './Card.css'

function Servicio({ title, image, route}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route); // redirige a la ruta pasada
    }
  };
  return (
    <div>
      <Card style={{ width: '24rem' }}></Card>
    <Card style={{ width: '24rem' }}>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Button className='button' onClick={handleClick}>Solicitar</Button>
      </Card.Body>
    </Card>
     </div>
  );
}

export default Servicio;
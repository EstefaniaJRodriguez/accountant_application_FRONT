import Carousel from 'react-bootstrap/Carousel';
import slide1 from "./slide1.png";
import slide2 from "./slide2.png";
import slide3 from "./slide3.png";
import './Slide.css'

function Slide() {
  return (
    <Carousel>
      <Carousel.Item>
        <img className="d-block w-100" src={slide3} alt="First slide"/>
        <div className="overlay"></div> {/* capa oscura */}
        <Carousel.Caption>
          <h3>Estamos para ayudarte con tus finanzas</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={slide1} alt="First slide"/>
         <div className="overlay"></div> {/* capa oscura */}
        <Carousel.Caption>
          <h3>Nuestros servicios incluyen documentación y asesoramiento actualizado</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Slide;
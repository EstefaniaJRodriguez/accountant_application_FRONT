// 👉 COMPONENTE ADAPTADO
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

const RecategorizacionMonotributoForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    claveFiscal: '',
    domicilio: '',
    telefono: '',
    mail: '',
    ingresosUltimos12Meses: '',
    categoriaDeseada: '',
    servicio: '',
  });

  const [sinCuit, setSinCuit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingValor, setLoadingValor] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [valorMonotributo, setValorMonotributo] = useState(null);
  const [mensajeMonotributo, setMensajeMonotributo] = useState("");

  const precioTramite = 15000;
  const [precioGestionExtra, setPrecioGestionExtra] = useState(0);
  const total = precioTramite + precioGestionExtra;

  // ----------------------------------------------------
  // 🔹 Cargar categorías
  // ----------------------------------------------------
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/monotributo/categorias`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // ----------------------------------------------------
  // 🔹 Manejo de inputs
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------------------------------
  // 🔹 VALIDADOR ADAPTADO (misma lógica del otro)
  // ----------------------------------------------------
  const validarMonotributo = async () => {
    const ingresos = formData.ingresosUltimos12Meses;
    const categoria = formData.categoriaDeseada;
    const servicio = formData.servicio;

    // Si falta info → no calcular → no mostrar error
    if (!ingresos || !categoria || !servicio) {
      setValorMonotributo(null);
      setMensajeMonotributo("");
      return;
    }

    try {
      setLoadingValor(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/monotributo/validar`,
        {
          categoria,
          ingresos: Number(ingresos),
          tipo: servicio.toLowerCase(),
        }
      );

      if (response.data.ok) {
        setValorMonotributo(response.data.monto);
        setMensajeMonotributo(response.data.mensaje);
      } else {
        setValorMonotributo(null);
        setMensajeMonotributo(response.data.mensaje);
      }
    } catch (error) {
      console.error("Error al validar monotributo:", error);
      setValorMonotributo(null);
      setMensajeMonotributo("Ocurrió un error al validar los datos.");
    } finally {
      setLoadingValor(false);
    }
  };

  // 👉 Igual que en el otro componente
  useEffect(() => {
    validarMonotributo();
  }, [
    formData.ingresosUltimos12Meses,
    formData.servicio,
    formData.categoriaDeseada,
  ]);

  // ----------------------------------------------------
  // 🔹 Enviar formulario
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        precioTramite: Number(precioTramite),
      };
    
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recatego/create_preference`,
        dataToSend
      );
      const preferenceId = response.data.preferenceId;
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 🔹 VISTA
  // ----------------------------------------------------
  return (
    <section className="py-5 bg-light">
      <Container className="mt-4">
        <h2>Datos para el trámite de Recategorización de Monotributo</h2>
        <p>Completá el siguiente formulario para gestionar tu Recategorización:</p>

        <Form onSubmit={handleSubmit}>

          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </Form.Group>

          {/* CUIT */}
          <Form.Group className="mb-3">
            <Form.Label>CUIT/CUIL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresá tu CUIT"
              name="cuit"
              value={formData.cuit}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                handleChange({ target: { name: "cuit", value: onlyNums } });
              }}
              disabled={sinCuit}
              required={!sinCuit}
              maxLength={11}
            />
          </Form.Group>

          {/* ... (todo tu formulario original sigue igual) ... */}

          <hr />

          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>
                <em>
                  Seleccioná los datos a continuación para conocer el valor estimado del monotributo.
                </em>
              </Form.Label>
            </Col>
          </Row>

          {/* Ingresos */}
          <Form.Group className="mb-3">
            <Form.Label>Ingresos de los últimos 12 meses</Form.Label>
            <Form.Control
              type="number"
              name="ingresosUltimos12Meses"
              value={formData.ingresosUltimos12Meses}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Actividad */}
          <Form.Group className="mb-3">
            <Form.Label>Actividad</Form.Label>
            <Form.Select
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="Servicio">Servicio</option>
              <option value="Venta">Venta</option>
            </Form.Select>
          </Form.Group>

          {/* Categoría */}
          <Form.Group className="mb-3">
            <Form.Label>Categoría en la que quiere estar</Form.Label>
            <Form.Select
              name="categoriaDeseada"
              value={formData.categoriaDeseada}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.categoria} value={cat.categoria}>
                  Categoría {cat.categoria} - Tope ${Number(cat.ingresos_brutos).toLocaleString("es-AR")}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Resultado del simulador */}
          {loadingValor ? (
            <Form.Text className="text-muted d-block mb-3">
              Calculando valor estimado del monotributo...
            </Form.Text>
          ) : mensajeMonotributo ? (
            <div className={`d-block mb-3 ${valorMonotributo ? "text-success" : "text-danger"}`}>
              <h5 className="fw-semibold fst-italic">{mensajeMonotributo}</h5>
            </div>
          ) : (
            <Form.Text className="text-muted d-block mb-3">
              Seleccioná la categoría, actividad e ingresos para conocer el valor estimado.
            </Form.Text>
          )}

          {/* Términos */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="termsCheck"
              required
              label={
                <>
                  Acepto los{" "}
                  <Link to="/terminos" target="_blank">Términos y Condiciones</Link> y la{" "}
                  <Link to="/privacidad" target="_blank">Política de Privacidad</Link>.
                </>
              }
            />
          </Form.Group>

          <div className="text-center mt-4 mb-3">
            <p className="fw-bold">Monto a abonar por la gestión del trámite: ${precioTramite}</p>
          </div>

          <div className="text-center">
            <Button variant="primary" type="submit" disabled={loading}>
              Enviar formulario y pagar
            </Button>
          </div>
        </Form>

        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1050,
            }}
          >
            <Spinner animation="border" style={{ width: "4rem", height: "4rem" }} />
            <p className="mt-3">Redirigiendo a Mercado Pago...</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default RecategorizacionMonotributoForm;

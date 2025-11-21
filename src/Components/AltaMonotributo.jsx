import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./Card.css";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Row, Col } from "react-bootstrap"; 

function AltaMonotributoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    claveFiscal: "",
    calle: "",
    numero: "",
    provincia: "",
    cp: "",
    telefono: "",
    mail: "",
    actividad: "",
    ingresos: "",
    categoriaDeseada: "",
    otrosIngresos: "No",
    tipoIngreso: "",
    servicio: "",
  });

  const [sinCuit, setSinCuit] = useState(false);
  const precioTramite = 15000;
  const [precioGestionExtra, setPrecioGestionExtra] = useState(0);
  const [valorMonotributo, setValorMonotributo] = useState(null);
  const [mensajeMonotributo, setMensajeMonotributo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingValor, setLoadingValor] = useState(false);

 const [categorias, setCategorias] = useState([]);

// Cargar categorías desde el backend al montar el componente
useEffect(() => {
  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/monotributo/categorias`);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  fetchCategorias();
}, []);


  // Maneja los cambios de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Consulta al backend para validar el monotributo según categoría y actividad
  const validarMonotributo = async () => {
    if (!formData.ingresos || !formData.categoriaDeseada || !formData.servicio) {
      setValorMonotributo(null);
      setMensajeMonotributo("");
      return;
    }

    try {
      setLoadingValor(true);
      const response = await axios.post(`${API_URL}/api/monotributo/validar`, {
        categoria: formData.categoriaDeseada,
        ingresos: Number(formData.ingresos),
        tipo: formData.servicio.toLowerCase(), // "servicio" o "venta"
      });

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

  // Se recalcula automáticamente si cambian ingresos, servicio o categoría
  useEffect(() => {
    validarMonotributo();
  }, [formData.ingresos, formData.servicio, formData.categoriaDeseada]);

  // Envío del formulario con integración de Mercado Pago
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        precioGestionExtra: Number(precioGestionExtra),
        precioTramite: Number(precioTramite),
      };

      const response = await axios.post(
        `${API_URL}/api/alta/create_preference`,
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

  // Calcular total mostrado al usuario
  const total = precioTramite + (sinCuit ? 10000 : 0);

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-4">Datos para el trámite de ALTA de Monotributo</h2>
        <p>Completá el siguiente formulario para gestionar tu ALTA de Monotributo:</p>

        <Form onSubmit={handleSubmit}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresá tu nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
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
                if (onlyNums.length <= 11) {
                  handleChange({ target: { name: "cuit", value: onlyNums } });
                }
              }}
              disabled={sinCuit}
              required={!sinCuit}
            />
          </Form.Group>

          {/* Checkbox No tengo CUIT */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="No tengo CUIT"
              checked={sinCuit}
              onChange={(e) => {
                setSinCuit(e.target.checked);
                setPrecioGestionExtra(e.target.checked ? 10000 : 0);
                if (e.target.checked) {
                  handleChange({ target: { name: "cuit", value: "" } });
                }
              }}
            />
          </Form.Group>

          {sinCuit && (
            <Form.Text className="text mb-3 d-block">
              Recordá que al no tener un CUIT, se cobrará un monto extra de ${precioGestionExtra} por la gestión del mismo.
            </Form.Text>
          )}

          {/* Clave fiscal */}
          <Form.Group className="mb-3">
            <Form.Label>Clave Fiscal</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresá tu clave fiscal"
              name="claveFiscal"
              value={formData.claveFiscal}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <br />
          <Row className="mb-3">
            <Col md={12}>
              <Form.Label>Domicilio</Form.Label>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Calle"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="number"
                placeholder="Número"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Provincia"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Código Postal"
                name="cp"
                value={formData.cp}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  if (onlyNums.length <= 4) {
                    handleChange({ target: { name: "cp", value: onlyNums } });
                  }
                }}
                required
              />
            </Col>
          </Row>

          {/* Teléfono */}
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 5491112345678"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                if (onlyNums.length <= 13) {
                  handleChange({ target: { name: "telefono", value: onlyNums } });
                }
              }}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Mail</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ej: usuario@mail.com"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Actividad */}
          <Form.Group className="mb-3">
            <Form.Label>Actividad que va a ejercer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Programador, Vendedor, Contador"
              name="actividad"
              value={formData.actividad}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <br></br>
          <hr></hr>
<Row className="mb-3">
  <Col md={12}>
    <Form.Label>
      <em>
        Seleccioná los datos a continuación para conocer el valor estimado del monotributo.
      </em>
    </Form.Label>
  </Col>
</Row>

        <hr></hr>
        <br></br>
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

             {/* Tipo de servicio */}
          <Form.Group className="mb-3">
            <Form.Label>Actividad</Form.Label>
            <Form.Select
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
            >
              <option>Seleccione una opción</option>
              <option>Servicio</option>
              <option>Venta</option>
            </Form.Select>
          </Form.Group>

          {/* Ingresos */}
          <Form.Group className="mb-3">
            <Form.Label>Ingresos declarados</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ej: $500.000"
              name="ingresos"
              value={formData.ingresos}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Otros ingresos */}
          <Form.Group className="mb-3">
            <Form.Label>¿Recibe ingresos por otra actividad?</Form.Label>
            <Form.Select
              name="otrosIngresos"
              value={formData.otrosIngresos}
              onChange={handleChange}
            >
              <option>Seleccione una opción</option>
              <option>No</option>
              <option>Sí</option>
            </Form.Select>
          </Form.Group>

          {formData.otrosIngresos === "Sí" && (
            <Form.Group className="mb-3">
              <Form.Label>Tipo de ingreso</Form.Label>
              <Form.Select
                name="tipoIngreso"
                value={formData.tipoIngreso}
                onChange={handleChange}
              >
                <option value="opcion">Seleccione una opción</option>
                <option value="dependencia">Relación de dependencia</option>
                <option value="jubilado">Jubilado</option>
              </Form.Select>
            </Form.Group>
          )}

          {/* Valor estimado */}
          {loadingValor ? (
            <Form.Text className="text-muted d-block mb-3">
              Calculando valor estimado del monotributo...
            </Form.Text>
          ) : mensajeMonotributo ? (
            <div className={`d-block mb-3 ${valorMonotributo ? "text-success" : "text-danger"}`}>
              <h5 className="fw-semibold fst-italic">
                {mensajeMonotributo}
              </h5>
          </div>
          ) : (
            <Form.Text className="text-muted d-block mb-3">
              Seleccioná la 'Categoria', 'Actividad' e ingresá tus 'Ingresos declarados' para conocer el valor estimado del monotributo.
            </Form.Text>
          )}
 {/* Términos */}
 <br></br>
          <Form.Group>
            <Form.Check
              type="checkbox"
              id="termsCheck"
              required
              label={
                <>
                  Acepto los{" "}
                  <Link to="/terminos" target="_blank">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link to="/privacidad" target="_blank">
                    Política de Privacidad
                  </Link>{" "}
                  de GEN Impositivo.
                </>
              }
            />
          </Form.Group>
  {/* Monto total */}
          <div className="text-center mt-4">
            <p className="fw-bold">
              Monto a abonar por la gestión del trámite: ${precioTramite}
            </p>
            <p className="fw-bold">
              Monto a abonar por gestión extra: ${precioGestionExtra}
            </p>
            <p className="fw-bold">
              Total a pagar por la gestión del trámite: ${total.toLocaleString("es-AR")}
            </p>
            <Button variant="primary" className="button" type="submit" disabled={loading}>
              Enviar formulario y pagar
            </Button>
          </div>

        </Form>
      </Container>

      {/* Overlay con spinner */}
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
          <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem" }} />
          <p className="mt-3">Redirigiendo a Mercado Pago...</p>
        </div>
      )}
    </section>
  );
}

export default AltaMonotributoForm;

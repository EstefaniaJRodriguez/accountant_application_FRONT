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
    condicion: "autonomo",
    condicionDetalle: "",
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

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/monotributo/categorias`
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("Datos enviados handlechange:", formData);
  };

  const validarMonotributo = async () => {
    if (
      !formData.ingresos ||
      !formData.categoriaDeseada ||
      !formData.servicio ||
      !formData.condicion
    ) {
      setValorMonotributo(null);
      setMensajeMonotributo("");
      return;
    }

    if (formData.condicion !== "autonomo" && !formData.condicionDetalle) {
      setValorMonotributo(null);
      setMensajeMonotributo("Debés seleccionar el tipo de ingreso.");
      return;
    }

    const condicionFinal =
      formData.condicion === "autonomo"
        ? "autonomo"
        : formData.condicionDetalle;

    try {
      setLoadingValor(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/monotributo/validar`,
        {
          categoria: formData.categoriaDeseada,
          ingresos: Number(formData.ingresos),
          tipo: formData.servicio.toLowerCase(),
          condicion: condicionFinal,
        }
      );

      console.log("Datos enviados validarmonotribito:", {
        ...formData,
        condicionFinal,
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

  useEffect(() => {
    validarMonotributo();
  }, [
    formData.ingresos,
    formData.servicio,
    formData.categoriaDeseada,
    formData.condicionDetalle,
    formData.condicion,
  ]);

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
        `${import.meta.env.VITE_API_URL}/api/alta/create_preference`,
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

  const total = precioTramite + (sinCuit ? 5000 : 0);

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center mb-4">
          Datos para el trámite de ALTA de Monotributo
        </h2>
        <p>Completá el siguiente formulario para gestionar tu ALTA de Monotributo:</p>

        <Form onSubmit={handleSubmit}>

          {/* ...todo tu formulario arriba queda IGUAL */}

          {/* Otros ingresos */}
          <Form.Group className="mb-3">
            <Form.Label>¿Recibe ingresos por otra actividad?</Form.Label>
            <Form.Select
              name="condicion"
              value={formData.condicion}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción</option>
              <option value="autonomo">No</option>
              <option value="otro">Sí</option>
            </Form.Select>
          </Form.Group>

          {formData.condicion === "otro" && (
            <Form.Group className="mb-3">
              <Form.Label>Tipo de ingreso</Form.Label>
              <Form.Select
                name="condicionDetalle"
                value={formData.condicionDetalle}
                onChange={handleChange}
              >
                <option value="">Seleccione una opción</option>
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
            <div
              className={`d-block mb-3 ${
                valorMonotributo ? "text-success" : "text-danger"
              }`}
            >
              <h5 className="fw-semibold fst-italic">{mensajeMonotributo}</h5>
            </div>
          ) : (
            <Form.Text className="text-muted d-block mb-3">
              Seleccioná la 'Categoria', 'Actividad' e ingresá tus 'Ingresos
              declarados' para conocer el valor estimado del monotributo.
            </Form.Text>
          )}

          {/* ...resto del formulario igual */}

        </Form>
      </Container>

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
          <Spinner
            animation="border"
            role="status"
            style={{ width: "4rem", height: "4rem" }}
          />
          <p className="mt-3">Redirigiendo a Mercado Pago...</p>
        </div>
      )}
    </section>
  );
}

export default AltaMonotributoForm;

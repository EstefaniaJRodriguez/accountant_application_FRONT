import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Spinner } from "react-bootstrap";

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
    condicion: "", // autonomo o tieneOtroIngreso
    condicionDetalle: "", // dependencia o jubilado
    servicio: "",
  });

  const [valorMonotributo, setValorMonotributo] = useState(null);
  const [mensajeMonotributo, setMensajeMonotributo] = useState("");
  const [loadingValor, setLoadingValor] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia condicion → limpiar condicionDetalle
    if (name === "condicion") {
      setFormData((prev) => ({
        ...prev,
        condicion: value,
        condicionDetalle: value === "autonomo" ? "" : prev.condicionDetalle,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---- VALIDACIÓN DEL MONOTRIBUTO ----
  const validarMonotributo = async () => {
    if (!formData.ingresos || !formData.categoriaDeseada || !formData.servicio || !formData.condicion) {
      setValorMonotributo(null);
      setMensajeMonotributo("");
      return;
    }

    // Si NO es autónomo y no eligió dependencia/jubilado → no llamar API (no mostrar error)
    if (formData.condicion !== "autonomo" && !formData.condicionDetalle) {
      setValorMonotributo(null);
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

  // Se recalcula automáticamente si cambian los datos relevantes
  useEffect(() => {
    validarMonotributo();
  }, [
    formData.ingresos,
    formData.servicio,
    formData.categoriaDeseada,
    formData.condicion,
    formData.condicionDetalle,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // lo que sea que ya estabas haciendo aquí
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>

      {/* Nombre */}
      <Form.Group className="mb-3">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
      </Form.Group>

      {/* CUIT */}
      <Form.Group className="mb-3">
        <Form.Label>CUIT</Form.Label>
        <Form.Control
          name="cuit"
          value={formData.cuit}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Otros datos... */}
      <Form.Group className="mb-3">
        <Form.Label>Ingresos anuales</Form.Label>
        <Form.Control
          type="number"
          name="ingresos"
          value={formData.ingresos}
          onChange={handleChange}
        />
      </Form.Group>

      {/* Servicio o venta */}
      <Form.Group className="mb-3">
        <Form.Label>Tipo de actividad</Form.Label>
        <Form.Select
          name="servicio"
          value={formData.servicio}
          onChange={handleChange}
        >
          <option value="">Elige una opción</option>
          <option value="servicio">Servicios</option>
          <option value="venta">Venta de productos</option>
        </Form.Select>
      </Form.Group>

      {/* Categoría */}
      <Form.Group className="mb-3">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
          name="categoriaDeseada"
          value={formData.categoriaDeseada}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </Form.Select>
      </Form.Group>

      {/* CONDICIÓN */}
      <Form.Group className="mb-3">
        <Form.Label>¿Recibe ingresos por otra actividad?</Form.Label>
        <Form.Select
          name="condicion"
          value={formData.condicion}
          onChange={handleChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="autonomo">No</option>
          <option value="tieneOtroIngreso">Sí</option>
        </Form.Select>
      </Form.Group>

      {/* TIPO DE INGRESO (solo si corresponde) */}
      {formData.condicion === "tieneOtroIngreso" && (
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

      {/* RESULTADO */}
      {loadingValor ? (
        <p>Calculando...</p>
      ) : (
        mensajeMonotributo && <p>{mensajeMonotributo}</p>
      )}

      {/* ENVÍO */}
      <Button type="submit" disabled={loading}>
        {loading ? "Procesando..." : "Continuar"}
      </Button>
    </Form>
  );
}

export default AltaMonotributoForm;

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
    // campos añadidos para el simulador (no rompen nada si no se usan)
    condicion: '',         // "autonomo" | "otro"
    condicionDetalle: '',  // "dependencia" | "jubilado"
  });

  const [sinCuit, setSinCuit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingValor, setLoadingValor] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [valorMonotributo, setValorMonotributo] = useState(null);
  const [mensajeMonotributo, setMensajeMonotributo] = useState("");

  // 🔹 Precios
  const precioTramite = 15000;
  const [precioGestionExtra, setPrecioGestionExtra] = useState(0);
  const total = precioTramite + precioGestionExtra;

  // 🔹 Cargar categorías
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

  // 🔹 Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    // si se cambia condicion, limpiar condicionDetalle si corresponde
    if (name === 'condicion') {
      setFormData((prev) => ({
        ...prev,
        condicion: value,
        condicionDetalle: value === 'autonomo' ? '' : prev.condicionDetalle,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ----------------------------------------------------
  // 🔹 Validar monotributo (adaptado para condiciones)
  // ----------------------------------------------------
  const validarMonotributo = async () => {
    // Recojo valores
    const ingresos = formData.ingresosUltimos12Meses;
    const categoria = formData.categoriaDeseada;
    const servicio = formData.servicio;

    // Si falta info esencial → no calcular → no mostrar error
    if (!ingresos || !categoria || !servicio) {
      setValorMonotributo(null);
      setMensajeMonotributo("");
      return;
    }

    // Si se indicó que tiene otro ingreso pero no eligió detalle → no llamar API (silencioso)
    if (formData.condicion === 'otro' && !formData.condicionDetalle) {
      setValorMonotributo(null);
      setMensajeMonotributo("");
      return;
    }

    // Definir condicionFinal si corresponde (si el usuario no seleccionó nada, asumimos 'autonomo')
    const condicionFinal = formData.condicion === 'otro'
      ? formData.condicionDetalle // dependencia | jubilado
      : formData.condicion === 'autonomo'
        ? 'autonomo'
        : 'autonomo';

    try {
      setLoadingValor(true);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/monotributo/validar`, {
        categoria,
        ingresos: Number(ingresos),
        tipo: servicio.toLowerCase(), // "servicio" o "venta"
        condicion: condicionFinal,
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

  // Recalcular cuando cambien los valores relevantes (incluyendo la condicion del simulador)
  useEffect(() => {
    validarMonotributo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.ingresosUltimos12Meses,
    formData.servicio,
    formData.categoriaDeseada,
    formData.condicion,
    formData.condicionDetalle,
  ]);

  // 🔹 Enviar formulario
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

          {/* (Opcional) Checkbox sin CUIT - si lo tenías comentado puedes activarlo */}
          {/* <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="No tengo CUIT"
              checked={sinCuit}
              onChange={(e) => {
                setSinCuit(e.target.checked);
                setPrecioGestionExtra(e.target.checked ? 2000 : 0);
                if (e.target.checked) handleChange({ target: { name: "cuit", value: "" } });
              }}
            />
          </Form.Group> */}

          {/* Clave fiscal */}
          <Form.Group className="mb-3">
            <Form.Label>Clave Fiscal</Form.Label>
            <Form.Control type="text" name="claveFiscal" value={formData.claveFiscal} onChange={handleChange} required />
          </Form.Group>

          {/* Domicilio */}
          <Form.Group className="mb-3">
            <Form.Label>Domicilio</Form.Label>
            <Form.Control type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} placeholder="Calle, Número, Barrio, Localidad, Provincia, CP" required />
          </Form.Group>

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
                if (onlyNums.length <= 13) handleChange({ target: { name: "telefono", value: onlyNums } });
              }}
              required
            />
          </Form.Group>

          {/* Mail */}
          <Form.Group className="mb-3">
            <Form.Label>Mail</Form.Label>
            <Form.Control type="email" name="mail" value={formData.mail} onChange={handleChange} required />
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

          <Form.Group className="mb-3">
            <Form.Label>Ingresos de los últimos 12 meses</Form.Label>
            <Form.Control type="number" name="ingresosUltimos12Meses" value={formData.ingresosUltimos12Meses} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Actividad</Form.Label>
            <Form.Select name="servicio" value={formData.servicio} onChange={handleChange} required>
              <option value="">Seleccione una opción</option>
              <option value="Servicio">Servicio</option>
              <option value="Venta">Venta</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría en la que quiere estar</Form.Label>
            <Form.Select name="categoriaDeseada" value={formData.categoriaDeseada} onChange={handleChange} required>
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.categoria} value={cat.categoria}>
                  Categoría {cat.categoria} - Tope ${Number(cat.ingresos_brutos).toLocaleString("es-AR")}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* --- NUEVO: selector sobre otros ingresos (integrado al simulador) --- */}
          <Form.Group className="mb-3">
            <Form.Label>¿Recibe ingresos por otra actividad?</Form.Label>
            <Form.Select
              name="condicion"
              value={formData.condicion}
              onChange={handleChange}
            >
              <option value="">Seleccione una opción (opcional)</option>
              <option value="autonomo">No (autónomo)</option>
              <option value="otro">Sí (tengo otro ingreso)</option>
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
            <Form.Text className="text-muted d-block mb-3">Calculando valor estimado del monotributo...</Form.Text>
          ) : mensajeMonotributo ? (
            <div className={`d-block mb-3 ${valorMonotributo ? "text-success" : "text-danger"}`}>
              <h5 className="fw-semibold fst-italic">
                {mensajeMonotributo}
              </h5>
            </div>
          ) : (
            <Form.Text className="text-muted d-block mb-3">
              Seleccioná la 'Categoría', 'Actividad' e ingresá tus 'Ingresos' para conocer el valor estimado del monotributo.
            </Form.Text>
          )}

          <br></br>
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
                  <Link to="/privacidad" target="_blank">Política de Privacidad</Link> de GEN Impositivo.
                </>
              }
            />
          </Form.Group>

          {/* Precios al usuario */}
          <div className="text-center mt-4 mb-3">
            <p className="fw-bold">Monto a abonar por la gestión del trámite: ${precioTramite}</p>
          </div>

          {/* Botón */}
          <div className="text-center">
            <Button variant="primary" className="button" type="submit" disabled={loading}>
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
            <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem" }} />
            <p className="mt-3">Redirigiendo a Mercado Pago...</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default RecategorizacionMonotributoForm;

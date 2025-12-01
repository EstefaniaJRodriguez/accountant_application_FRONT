import { useState } from "react";
import { Form, Button, Container ,Spinner} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

function BajaMonotributoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    claveFiscal: "",
    domicilio: "",
    telefono: "",
    mail: "",
    mesBaja: "",
  });

  const [sinCuit, setSinCuit] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Precio del trámite
  const precioTramite = 15000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        precioTramite: Number(precioTramite),
      };
    
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/baja/create_preference`,
        dataToSend
      );

      const preferenceId = response.data.preferenceId;
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el pago");
    }
  };

  return (
    <section className="py-5 bg-light">
      <Container className="my-5">
        <h2>Datos para el trámite de Baja de Monotributo</h2>
        <p>Completá el siguiente formulario para gestionar tu BAJA de Monotributo:</p>
        <Form onSubmit={handleSubmit}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
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
                handleChange({ target: { name: "cuit", value: onlyNums } });
              }}
              disabled={sinCuit}
              required={!sinCuit}
              maxLength={11}
            />
          </Form.Group>

          {/* Clave Fiscal */}
          <Form.Group className="mb-3">
            <Form.Label>Clave Fiscal</Form.Label>
            <Form.Control
              type="text"
              name="claveFiscal"
              value={formData.claveFiscal}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Domicilio */}
          <Form.Group className="mb-3">
            <Form.Label>Domicilio</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="domicilio"
              value={formData.domicilio}
              placeholder="Calle, Número, Barrio, Localidad, Provincia, CP"
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Teléfono */}
          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: 54 9 11 1234 5678"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                if (onlyNums.length <= 12) {
                  handleChange({ target: { name: "telefono", value: onlyNums } });
                }
              }}
              required
              maxLength={12}
            />
          </Form.Group>

          {/* Mail */}
          <Form.Group className="mb-3">
            <Form.Label>Mail</Form.Label>
            <Form.Control
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Mes de baja */}
          <Form.Group className="mb-3">
            <Form.Label>Mes en que se quiere dar de baja</Form.Label>
            <Form.Select
              name="mesBaja"
              value={formData.mesBaja}
              onChange={handleChange}
              required
            >
              <option value="">Seleccioná un mes</option>
              <option value="anterior">Mes anterior</option>
              <option value="actual">Mes en curso</option>
              <option value="posterior">Mes posterior</option>
            </Form.Select>
          </Form.Group>

          {/* Términos */}
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

          {/* Precio al usuario */}
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

export default BajaMonotributoForm;

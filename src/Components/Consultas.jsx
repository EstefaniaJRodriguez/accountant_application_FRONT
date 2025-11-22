import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./Consultas.css";

function Consultas() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [respuesta, setRespuesta] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setRespuesta("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/consultas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al enviar la consulta");

      const data = await res.json();
      setRespuesta(data.message);
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error:", error);
      setRespuesta("Hubo un problema al enviar la consulta. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <br />
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        ¿Buscas asesoramiento online?
      </h2>
      <p>Dejanos tu/s consultas, aboná la misma y te respondemos al instante.</p>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre completo / Razón Social</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConsulta">
            <Form.Label>Consulta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button className="button" variant="primary" type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar consulta"}
          </Button>
        </Form>

        {respuesta && (
          <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
            {respuesta}
          </p>
        )}
      </Container>
      <br />
    </div>
  );
}

export default Consultas;

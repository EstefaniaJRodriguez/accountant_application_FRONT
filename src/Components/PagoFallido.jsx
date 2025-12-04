import { useLocation, Link } from "react-router-dom";

const PagoFallido = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const status = queryParams.get("status");
  const preferenceId = queryParams.get("preference_id");

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* Icono rojo */}
      <div style={{ fontSize: "60px", marginBottom: "20px", color: "#d9534f" }}>
        ❌
      </div>

      <h1 style={{ color: "#d9534f", marginBottom: "20px" }}>
        Pago no procesado
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Hubo un problema al procesar tu pago.  
        Te recomendamos intentar nuevamente o usar otro método.
      </p>

      <h2 style={{ marginBottom: "10px" }}>Información</h2>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "16px" }}>
        <li><strong>Status:</strong> {status || "No disponible"}</li>
        <li><strong>Payment ID:</strong> {paymentId || "No disponible"}</li>
        <li><strong>Preference ID:</strong> {preferenceId || "No disponible"}</li>
      </ul>

      <div style={{ marginTop: "40px" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            backgroundColor: "#0275d8",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            marginRight: "15px",
          }}
        >
          Volver al inicio
        </Link>

        <Link
          to="/recategorizacion"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            backgroundColor: "#5bc0de",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          Intentar nuevamente
        </Link>
      </div>
    </div>
  );
};

export default PagoFallido;

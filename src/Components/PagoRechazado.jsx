import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PagoRechazado = () => {
  const location = useLocation();
  const yaGuardado = useRef(false);

  // Obtener tramite_id desde la URL
  const tramiteIdSplit = location.pathname.split("/");
  const tramiteId = tramiteIdSplit[2]; // "/pago-rechazado/123"

  // Obtener query params de Mercado Pago
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const status = queryParams.get("status");
  const collectionStatus = queryParams.get("collection_status");
  const preferenceId = queryParams.get("preference_id");

  // 1️⃣ Si se vuelve desde Mercado Pago sin parámetros → enviar al home
  if (!paymentId || !status) {
    window.location.href = "/";
    return null;
  }

  // 2️⃣ Guardamos el registro del pago fallido una sola vez
  useEffect(() => {
    const pagoGuardadoKey = `pago_rechazado_${paymentId}`;

    if (localStorage.getItem(pagoGuardadoKey) || yaGuardado.current) return;

    const guardarPagoFallido = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tramite_id: tramiteId,
            pago_id_mp: paymentId,
            monto: null,
            estado_pago: "rechazado",
            metodo_pago: "Mercado Pago",
            detalles: { collectionStatus, preferenceId },
          }),
        });

        const data = await res.json();
        console.log("Pago rechazado guardado:", data);

        yaGuardado.current = true;
        localStorage.setItem(pagoGuardadoKey, "true");
      } catch (error) {
        console.error("Error guardando pago rechazado:", error);
      }
    };

    guardarPagoFallido();
  }, [paymentId, tramiteId, collectionStatus, preferenceId]);

  // 3️⃣ UI
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#d9534f" }}>❌ Pago Rechazado</h1>
      <p style={{ fontSize: "17px" }}>
        El pago no pudo completarse. Por favor intentá nuevamente o probá con otro método.
      </p>

      <h2 style={{ marginTop: "30px" }}>📌 Información del intento</h2>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "16px" }}>
        <li><strong>Payment ID:</strong> {paymentId}</li>
        <li><strong>Status:</strong> {status}</li>
      </ul>

      {/* Botón volver al inicio */}
      <div style={{ marginTop: "25px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 18px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔙 Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default PagoRechazado;

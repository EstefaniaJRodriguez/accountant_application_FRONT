import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PagoFallido = () => {
  const location = useLocation();
  const yaGuardado = useRef(false);

  // Obtener tramite_id desde la URL
  const pathParts = location.pathname.split("/");
  const tramiteId = pathParts[2]; // "/pago-fallido/123"

  // Obtener query params de Mercado Pago
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const status = queryParams.get("status");
  const collectionStatus = queryParams.get("collection_status");
  const preferenceId = queryParams.get("preference_id");

  // 1️⃣ Si no hay parámetros → venimos desde "volver atrás" → redirigir al home
  if (!paymentId || !status) {
    window.location.href = "/";
    return null;
  }

  // 2️⃣ Guardar en backend que el pago falló (solo una vez)
  useEffect(() => {
    const pagoFallidoKey = `pago_fallido_${paymentId}`;

    if (localStorage.getItem(pagoFallidoKey) || yaGuardado.current) return;

    const guardarPagoFallido = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tramite_id: tramiteId,
            pago_id_mp: paymentId,
            monto: null,
            estado_pago: "fallido",
            metodo_pago: "Mercado Pago",
            detalles: { collectionStatus, preferenceId },
          }),
        });

        const data = await res.json();
        console.log("Pago fallido guardado:", data);

        yaGuardado.current = true;
        localStorage.setItem(pagoFallidoKey, "true");
      } catch (error) {
        console.error("Error al guardar pago fallido:", error);
      }
    };

    guardarPagoFallido();
  }, [paymentId, tramiteId, collectionStatus, preferenceId]);

  // 3️⃣ UI
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#c9302c" }}>⚠️ Pago Fallido</h1>
      <p style={{ fontSize: "17px" }}>
        Hubo un problema procesando el pago. Te recomendamos intentarlo nuevamente
        o elegir otro método disponible.
      </p>

      <h2 style={{ marginTop: "30px" }}>📌 Información del pago</h2>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "16px" }}>
        <li><strong>Payment ID:</strong> {paymentId}</li>
        <li><strong>Status:</strong> {status}</li>
      </ul>

      {/* Botón de volver al inicio */}
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

export default PagoFallido;

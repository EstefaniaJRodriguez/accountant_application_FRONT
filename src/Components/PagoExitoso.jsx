import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PagoExitoso = () => {
  const location = useLocation();
  const yaGuardado = useRef(false); // flag para evitar doble fetch

  // Extraemos el tramiteId del pathname
  const tramiteIdComplete = location.pathname.split("/"); 
  const tramiteId = tramiteIdComplete[2]; // ej: "/pago-exitoso/123"

  // Extraemos los query params
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const status = queryParams.get("status");
  const collectionStatus = queryParams.get("collection_status");
  const preferenceId = queryParams.get("preference_id");

  useEffect(() => {
  if (!paymentId || !status) return;

  // Evitar doble guardado en el mismo navegador
  const pagoGuardadoKey = `pago_guardado_${paymentId}`;
  if (localStorage.getItem(pagoGuardadoKey) || yaGuardado.current) return;

  const guardarPago = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tramite_id: tramiteId,
          pago_id_mp: paymentId,
          monto: null,
          estado_pago: status,
          metodo_pago: "Mercado Pago",
          detalles: { collectionStatus, preferenceId },
        }),
      });

      const data = await res.json();
      console.log("Pago guardado:", data);

      yaGuardado.current = true;
      localStorage.setItem(pagoGuardadoKey, "true");
    } catch (error) {
      console.error("Error al guardar el pago:", error);
    }
  };

  guardarPago();
}, [paymentId, status, tramiteId, collectionStatus, preferenceId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ Pago Exitoso</h1>
      <p>
        Gracias por tu pago, el trámite fue procesado correctamente y el equipo
        de GEN Impositivo se contactará via email próximamente.
      </p>

      <h2>📌 Información del pago</h2>
      <ul>
        <li><strong>Payment ID:</strong> {paymentId}</li>
        <li><strong>Status:</strong> {status}</li>
      </ul>
    </div>
  );
};

export default PagoExitoso;

// import { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";

// const PagoExitoso = () => {
//   const location = useLocation();
//   const yaGuardado = useRef(false); // Evita doble envío

//   // Extraemos el tramiteId del pathname
//   const tramiteIdComplete = location.pathname.split("/");
//   const tramiteId = tramiteIdComplete[2];

//   // Extraemos los parámetros de Mercado Pago
//   const queryParams = new URLSearchParams(location.search);
//   const paymentId = queryParams.get("payment_id");
//   const status = queryParams.get("status");
//   const collectionStatus = queryParams.get("collection_status");
//   const preferenceId = queryParams.get("preference_id");

//   // Si no vienen los datos de Mercado Pago → redirigir al inicio
//   if (!paymentId || !status) {
//     window.location.href = "/";
//     return null;
//   }

//   // Guardamos el pago solo una vez
//   useEffect(() => {
//     const pagoGuardadoKey = `pago_guardado_${paymentId}`;

//     if (localStorage.getItem(pagoGuardadoKey) || yaGuardado.current) return;

//     const guardarPago = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             tramite_id: tramiteId,
//             pago_id_mp: paymentId,
//             monto: null,
//             estado_pago: status,
//             metodo_pago: "Mercado Pago",
//             detalles: { collectionStatus, preferenceId },
//           }),
//         });

//  //  evento a Google Tag Manager
//         const data = await res.json();
//         console.log("Pago guardado:", data);

//   //  evento a Google Tag Manager
//         if (status === "approved" && window.dataLayer) {
//           window.dataLayer.push({
//             event: "purchase",
//             ecommerce: {
//               transaction_id: paymentId,
//               value: monto, 
//               currency: "ARS",
//               items: [
//                 {
//                   item_id: tramiteId,
//                   item_name: "Tramite GEN Impositivo",
//                   quantity: 1
//                 }
//               ]
//             }
//           });
//           console.log("📊 Evento enviado a dataLayer");
//        }
      


//         yaGuardado.current = true;
//         localStorage.setItem(pagoGuardadoKey, "true");
//       } catch (error) {
//         console.error("Error al guardar el pago:", error);
//       }
//     };

//     guardarPago();
//   }, [paymentId, status, tramiteId, collectionStatus, preferenceId]);

//   // 3️⃣ UI del componente
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>✅ Pago Exitoso</h1>
//       <p>
//         Gracias por tu pago, el trámite fue procesado correctamente y el equipo
//         de GEN Impositivo se contactará vía email próximamente.
//       </p>

//       <h2>📌 Información del pago</h2>
//       <ul>
//         <li><strong>Payment ID:</strong> {paymentId}</li>
//         <li><strong>Status:</strong> {status}</li>
//       </ul>

//       {/* Botón volver al inicio */}
//       <div style={{ marginTop: "20px" }}>
//         <button
//           onClick={() => (window.location.href = "/")}
//           style={{
//             padding: "10px 18px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "6px",
//             cursor: "pointer",
//             fontSize: "16px",
//           }}
//         >
//           🔙 Volver al inicio
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PagoExitoso;

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PagoExitoso = () => {
  const location = useLocation();
  const yaGuardado = useRef(false); // Evita doble envío

  // Extraemos el tramiteId del pathname
  const tramiteIdComplete = location.pathname.split("/");
  const tramiteId = tramiteIdComplete[2];

  // Extraemos los parámetros de Mercado Pago
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("payment_id");
  const status = queryParams.get("status");
  const collectionStatus = queryParams.get("collection_status");
  const preferenceId = queryParams.get("preference_id");
  const monto = parseFloat(queryParams.get("amount")) || 1; // monto real, si viene

  // Extraemos el tipo de tramite si viene por query params (opcional)
  const tipoTramiteNombre = queryParams.get("tipo_tramite") || "GEN Impositivo";

  // Redirigir si no vienen los datos de Mercado Pago
  if (!paymentId || !status) {
    window.location.href = "/";
    return null;
  }

  useEffect(() => {
    // 1️⃣ Push de pageview a dataLayer al cargar la página
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "pageview",
        pagePath: location.pathname,
        pageTitle: "Pago Exitoso",
      });
      console.log("📄 Pageview enviado a dataLayer");
    }
  }, [location.pathname]);

  // Guardamos el pago solo una vez
  useEffect(() => {
    const pagoGuardadoKey = `pago_guardado_${paymentId}`;
    if (localStorage.getItem(pagoGuardadoKey) || yaGuardado.current) return;

    const guardarPago = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tramite_id: tramiteId,
            pago_id_mp: paymentId,
            monto: monto,
            estado_pago: status,
            metodo_pago: "Mercado Pago",
            detalles: { collectionStatus, preferenceId },
          }),
        });

        const data = await res.json();
        console.log("💾 Pago guardado:", data);

        // 2️⃣ Evento de compra para Google Tag Manager
        if (status === "approved" && window.dataLayer) {
          window.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id: paymentId,
              value: monto,
              currency: "ARS",
              items: [
                {
                  item_id: tramiteId,
                  item_name: tipoTramiteNombre,
                  quantity: 1,
                  payment_method: "Mercado Pago",
                },
              ],
            },
          });
          console.log("📊 Evento de compra enviado a dataLayer");
        }

        yaGuardado.current = true;
        localStorage.setItem(pagoGuardadoKey, "true");
      } catch (error) {
        console.error("❌ Error al guardar el pago:", error);
      }
    };

    guardarPago();
  }, [
    paymentId,
    status,
    tramiteId,
    collectionStatus,
    preferenceId,
    monto,
    tipoTramiteNombre,
  ]);

  // UI del componente
  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ Pago Exitoso</h1>
      <p>
        Gracias por tu pago, el trámite fue procesado correctamente y el equipo
        de GEN Impositivo se contactará vía email próximamente.
      </p>

      <h2>📌 Información del pago</h2>
      <ul>
        <li><strong>Payment ID:</strong> {paymentId}</li>
        <li><strong>Status:</strong> {status}</li>
        <li><strong>Monto:</strong> {monto} ARS</li>
        <li><strong>Trámite:</strong> {tipoTramiteNombre}</li>
      </ul>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 18px",
            backgroundColor: "#007bff",
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

export default PagoExitoso;


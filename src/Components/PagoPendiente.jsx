import React from "react";
import { Clock } from "lucide-react";

const PagoPendiente = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-gray-200">
        
        <div className="flex justify-center mb-4">
          <Clock size={64} className="text-yellow-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Pago pendiente ⏳
        </h1>

        <p className="text-gray-600 mb-6">
          Estamos esperando la confirmación del pago.  
          Esto puede tardar unos minutos.  
          Te avisaremos apenas se acredite.
        </p>

        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            Si cerraste la ventana de Mercado Pago por error, podés intentar nuevamente desde tu historial.
          </p>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition"
        >
          Volver al inicio
        </button>

      </div>
    </div>
  );
};

export default PagoPendiente;

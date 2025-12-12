import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Plus } from "lucide-react";

const getToken = () => localStorage.getItem("token");


const SolicitudesGrid = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTramite, setFiltroTramite] = useState("");
  const [filtroCuit, setFiltroCuit] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [debouncedCuit, setDebouncedCuit] = useState(filtroCuit);
  const [debouncedEmail, setDebouncedEmail] = useState(filtroEmail);

  const [showModal, setShowModal] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // 🔹 Cargar solicitudes con filtros
  const fetchSolicitudes = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.append("estado", filtroEstado);
      if (filtroTramite) params.append("tipo_tramite", filtroTramite);
      if (debouncedCuit) params.append("cuit", debouncedCuit);
      if (debouncedEmail) params.append("email", debouncedEmail);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        }
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setSolicitudes(data);
      } else {
        console.error("La respuesta del backend no es un array:", data);
        setSolicitudes([]);
      }
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    }
  };

  // 🔹 Cargar estados y tipos de trámite
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/estados`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        const data = await res.json();
        setEstados(data);
      } catch (error) {
        console.error("Error al cargar estados:", error);
      }
    };

    const fetchTiposTramite = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tipos-tramite`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        const data = await res.json();
        setTiposTramite(data);
      } catch (error) {
        console.error("Error al cargar tipos de trámite:", error);
      }
    };

    fetchEstados();
    fetchTiposTramite();
    fetchSolicitudes();
  }, []);

  // 🔹 Refrescar solicitudes cuando cambien filtros
  useEffect(() => {
    fetchSolicitudes();
  }, [filtroEstado, filtroTramite, debouncedCuit, debouncedEmail]);

  // 🔹 Debounce para CUIT y Email
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedCuit(filtroCuit), 500);
    return () => clearTimeout(handler);
  }, [filtroCuit]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedEmail(filtroEmail), 500);
    return () => clearTimeout(handler);
  }, [filtroEmail]);

  const abrirModal = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
     console.log("📦 Datos de la solicitud:", solicitud);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setSolicitudSeleccionada(null);
    setShowModal(false);
  };

 const actualizarEstado = async (nuevoEstadoId, observaciones) => {
  if (!solicitudSeleccionada) return;

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/${solicitudSeleccionada.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        estado: nuevoEstadoId,
        observaciones: observaciones !== undefined ? observaciones : solicitudSeleccionada.observaciones || ""
      }),
    });
    

    const estadoSeleccionado = estados.find((e) => e.id === parseInt(nuevoEstadoId));

    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === solicitudSeleccionada.id
          ? { 
              ...s, 
              estado_nombre: estadoSeleccionado?.nombre, 
              observaciones: observaciones !== undefined ? observaciones : s.observaciones 
            }
          : s
      )
    );

    setSolicitudSeleccionada((prev) => ({
      ...prev,
      estado_nombre: estadoSeleccionado?.nombre,
      observaciones: observaciones !== undefined ? observaciones : prev.observaciones
    }));
  } catch (error) {
    console.error("Error actualizando estado y observaciones:", error);
  }
};


  return (
    <div className="p-4">
      <h2 className="mb-3">Panel de Solicitudes</h2>

      {/* 🔹 Filtros */}
      <div className="d-flex gap-3 mb-3 flex-wrap align-items-end">
        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="m-0">Tipo de Trámite:</Form.Label>
          <Form.Select
            value={filtroTramite}
            onChange={(e) => setFiltroTramite(e.target.value)}
          >
            <option value="">Todos</option>
            {tiposTramite.map((t) => (
              <option key={t.id} value={t.id}>
                {t.tramite}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="m-0">Estado:</Form.Label>
          <Form.Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos</option>
            {estados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="m-0">CUIT/CUIL:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Buscar por CUIT/CUIL"
            value={filtroCuit}
            onChange={(e) => setFiltroCuit(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="d-flex align-items-center gap-2">
          <Form.Label className="m-0">Email:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Buscar por Email"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
          />
        </Form.Group>
      </div>

      {/* 🔹 Tabla de solicitudes */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Mail</th>
            <th>CUIT/CUIL</th>
            <th>Tipo de Trámite</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length > 0 ? (
            solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{s.nombre}</td>
                <td>{s.mail}</td>
                <td>{s.cuit}</td>
                <td>{s.tipo_tramite_nombre}</td>
                <td>{s.estado_nombre}</td>
                <td style={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}>{s.observaciones}</td>
                <td className="text-center">
                  <Button variant="primary" size="sm" onClick={() => abrirModal(s)}>
                    <Plus size={16} /> Detalle
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay solicitudes disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🔹 Modal de detalle */}
      <Modal show={showModal} onHide={cerrarModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de la Solicitud</Modal.Title>
        </Modal.Header>
       <Modal.Body>
  {solicitudSeleccionada && (
    <>
      {/* Campos comunes */}
      <p><strong>Tipo de Trámite:</strong> {solicitudSeleccionada.tipo_tramite_nombre}</p>
      <hr />
      {/* 🔸 Alta Monotributo */}
      {/* 🔸 Alta Monotributo */}
{solicitudSeleccionada.tipo_tramite_nombre === "Alta Monotributo" && (
  <>
    <p><strong>Nombre completo:</strong> {solicitudSeleccionada.datos.nombre}</p>
    <p><strong>Mail:</strong> {solicitudSeleccionada.datos.mail}</p>
    <p><strong>CUIT:</strong> {solicitudSeleccionada.datos.cuit}</p>
    <p><strong>Calle:</strong> {solicitudSeleccionada.datos.calle}</p>
    <p><strong>Número:</strong> {solicitudSeleccionada.datos.numero}</p>
    <p><strong>Ingresos:</strong> {solicitudSeleccionada.datos.ingresos}</p>
    <p><strong>Servicio:</strong> {solicitudSeleccionada.datos.servicio}</p>
    <p><strong>Teléfono:</strong> {solicitudSeleccionada.datos.telefono}</p>
    <p><strong>Actividad:</strong> {solicitudSeleccionada.datos.actividad}</p>
    <p><strong>Provincia:</strong> {solicitudSeleccionada.datos.provincia}</p>
    <p><strong>Clave Fiscal:</strong> {solicitudSeleccionada.datos.claveFiscal}</p>
    <p><strong>Tipo de Ingreso:</strong> {solicitudSeleccionada.datos.tipoIngreso}</p>
    <p><strong>Otros Ingresos:</strong> {solicitudSeleccionada.datos.otrosIngresos}</p>
    <p><strong>Categoría Deseada:</strong> {solicitudSeleccionada.datos.categoriaDeseada}</p>
  </>
)}

{/* 🔸 Baja Monotributo */}
{solicitudSeleccionada.tipo_tramite_nombre === "Baja Monotributo" && (
  <>
    <p><strong>Nombre completo:</strong> {solicitudSeleccionada.datos.nombre}</p>
    <p><strong>Mail:</strong> {solicitudSeleccionada.datos.mail}</p>
    <p><strong>CUIT:</strong> {solicitudSeleccionada.datos.cuit}</p>
    <p><strong>Mes de Baja:</strong> {solicitudSeleccionada.datos.mesBaja}</p>
    <p><strong>Teléfono:</strong> {solicitudSeleccionada.datos.telefono}</p>
    <p><strong>Domicilio:</strong> {solicitudSeleccionada.datos.domicilio}</p>
    <p><strong>Clave Fiscal:</strong> {solicitudSeleccionada.datos.claveFiscal}</p>
  </>
)}

{/* 🔸 Recategorización */}
{solicitudSeleccionada.tipo_tramite_nombre === "Recategorización" && (
  <>
    <p><strong>Nombre completo:</strong> {solicitudSeleccionada.datos.nombre}</p>
    <p><strong>Mail:</strong> {solicitudSeleccionada.datos.mail}</p>
    <p><strong>CUIT:</strong> {solicitudSeleccionada.datos.cuit}</p>
    <p><strong>Teléfono:</strong> {solicitudSeleccionada.datos.telefono}</p>
    <p><strong>Domicilio:</strong> {solicitudSeleccionada.datos.domicilio}</p>
    <p><strong>Clave Fiscal:</strong> {solicitudSeleccionada.datos.clave_fiscal}</p>
    <p><strong>Categoría Deseada:</strong> {solicitudSeleccionada.datos.categoriaDeseada}</p>
    <p><strong>Ingresos últimos 12 meses:</strong> {solicitudSeleccionada.datos.ingresosUltimos12meses}</p>
  </>
)}


      {/* 🔸 Selector de estado (se mantiene igual) */}
     <Form.Group className="mt-3">
  <Form.Label><strong>Estado:</strong></Form.Label>
  <Form.Select
    value={
      estados.find(
        (e) => e.nombre === solicitudSeleccionada.estado_nombre
      )?.id || ""
    }
    onChange={(e) => actualizarEstado(e.target.value)}
  >
    {estados.map((estado) => (
      <option key={estado.id} value={estado.id}>
        {estado.nombre}
      </option>
    ))}
  </Form.Select>
</Form.Group>


       {/* 🔸 Observaciones */}
       <Form.Group className="mt-3">
  <Form.Label><strong>Observaciones:</strong></Form.Label>
  <Form.Control
    as="textarea"
    rows={3}
    placeholder="Escribí tus observaciones aquí..."
    value={solicitudSeleccionada.observaciones || ""}
    onChange={(e) => 
      setSolicitudSeleccionada(prev => ({
        ...prev,
        observaciones: e.target.value
      }))
    }
    onBlur={() => 
      actualizarEstado(
        estados.find(e => e.nombre === solicitudSeleccionada.estado_nombre)?.id, 
        solicitudSeleccionada.observaciones
      )
    }
  />
</Form.Group>

    </>
  )}
</Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={cerrarModal}>
            Guardar y Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SolicitudesGrid;

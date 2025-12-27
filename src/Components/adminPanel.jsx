import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
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

  const [tabActiva, setTabActiva] = useState("procesados");

  const [debouncedCuit, setDebouncedCuit] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const fetchSolicitudes = async () => {
    try {
      const params = new URLSearchParams();

      if (filtroEstado) params.append("estado", filtroEstado);
      if (filtroTramite) params.append("tipo_tramite", filtroTramite);
      if (debouncedCuit) params.append("cuit", debouncedCuit);
      if (debouncedEmail) params.append("email", debouncedEmail);

      params.append(
        "estado_pago",
        tabActiva === "procesados" ? "Y" : "N"
      );

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin?${params.toString()}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      const data = await res.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    }
  };

  useEffect(() => {
    const fetchEstados = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/estados`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setEstados(await res.json());
    };

    const fetchTiposTramite = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/tipos-tramite`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setTiposTramite(await res.json());
    };

    fetchEstados();
    fetchTiposTramite();
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [
    tabActiva,
    filtroEstado,
    filtroTramite,
    debouncedCuit,
    debouncedEmail,
  ]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedCuit(filtroCuit), 500);
    return () => clearTimeout(t);
  }, [filtroCuit]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedEmail(filtroEmail), 500);
    return () => clearTimeout(t);
  }, [filtroEmail]);

  const abrirModal = (s) => {
    setSolicitudSeleccionada(s);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setSolicitudSeleccionada(null);
    setShowModal(false);
  };

  const actualizarEstado = async (nuevoEstadoId, observaciones) => {
    if (!solicitudSeleccionada) return;

    await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/${solicitudSeleccionada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          estado: nuevoEstadoId,
          observaciones:
            observaciones ??
            solicitudSeleccionada.observaciones ??
            "",
        }),
      }
    );

    const estadoSeleccionado = estados.find(
      (e) => e.id === parseInt(nuevoEstadoId)
    );

    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === solicitudSeleccionada.id
          ? {
              ...s,
              estado_nombre: estadoSeleccionado?.nombre,
              observaciones:
                observaciones ?? s.observaciones,
            }
          : s
      )
    );

    setSolicitudSeleccionada((prev) => ({
      ...prev,
      estado_nombre: estadoSeleccionado?.nombre,
      observaciones:
        observaciones ?? prev.observaciones,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="mb-3">Panel de Solicitudes</h2>

      <Tabs
        activeKey={tabActiva}
        onSelect={(k) => setTabActiva(k)}
        className="mb-4"
      >
        <Tab eventKey="procesados" title="✅ Pagos Procesados" />
        <Tab eventKey="no_procesados" title="⏳ Pagos No procesados" />
      </Tabs>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Mail</th>
            <th>CUIT</th>
            <th>Trámite</th>
            <th>Estado</th>
            <th>Obs.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>{s.mail}</td>
              <td>{s.cuit}</td>
              <td>{s.tipo_tramite_nombre}</td>
              <td>{s.estado_nombre}</td>
              <td className="text-truncate" style={{ maxWidth: 200 }}>
                {s.observaciones}
              </td>
              <td className="text-center">
                <Button size="sm" onClick={() => abrirModal(s)}>
                  <Plus size={14} /> Detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🔹 Modal con detalle por tipo de trámite */}
      <Modal show={showModal} onHide={cerrarModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {solicitudSeleccionada && (
            <>
              <p>
                <strong>Tipo de Trámite:</strong>{" "}
                {solicitudSeleccionada.tipo_tramite_nombre}
              </p>
              <hr />

              {/* 🔸 Alta Monotributo */}
              {solicitudSeleccionada.tipo_tramite_nombre === "Alta Monotributo" && (
                <>
                  <p><strong>Nombre completo:</strong> {solicitudSeleccionada.datos?.nombre}</p>
                  <p><strong>Mail:</strong> {solicitudSeleccionada.datos?.mail}</p>
                  <p><strong>CUIT:</strong> {solicitudSeleccionada.datos?.cuit}</p>
                  <p><strong>Calle:</strong> {solicitudSeleccionada.datos?.calle}</p>
                  <p><strong>Número:</strong> {solicitudSeleccionada.datos?.numero}</p>
                  <p><strong>Ingresos:</strong> {solicitudSeleccionada.datos?.ingresos}</p>
                  <p><strong>Servicio:</strong> {solicitudSeleccionada.datos?.servicio}</p>
                  <p><strong>Teléfono:</strong> {solicitudSeleccionada.datos?.telefono}</p>
                  <p><strong>Actividad:</strong> {solicitudSeleccionada.datos?.actividad}</p>
                  <p><strong>Provincia:</strong> {solicitudSeleccionada.datos?.provincia}</p>
                  <p><strong>Clave Fiscal:</strong> {solicitudSeleccionada.datos?.claveFiscal}</p>
                  <p><strong>Tipo de Ingreso:</strong> {solicitudSeleccionada.datos?.tipoIngreso}</p>
                  <p><strong>Otros Ingresos:</strong> {solicitudSeleccionada.datos?.otrosIngresos}</p>
                  <p><strong>Categoría Deseada:</strong> {solicitudSeleccionada.datos?.categoriaDeseada}</p>
                </>
              )}

              {/* 🔸 Baja Monotributo */}
              {solicitudSeleccionada.tipo_tramite_nombre === "Baja Monotributo" && (
                <>
                  <p><strong>Nombre completo:</strong> {solicitudSeleccionada.datos?.nombre}</p>
                  <p><strong>Mail:</strong> {solicitudSeleccionada.datos?.mail}</p>
                  <p><strong>CUIT:</strong> {solicitudSeleccionada.datos?.cuit}</p>
                  <p><strong>Mes de Baja:</strong> {solicitudSeleccionada.datos?.mesBaja}</p>
                  <p><strong>Teléfono:</strong> {solicitudSeleccionada.datos?.telefono}</p>
                  <p><strong>Domicilio:</strong> {solicitudSeleccionada.datos?.domicilio}</p>
                  <p><strong>Clave Fiscal:</strong> {solicitudSeleccionada.datos?.claveFiscal}</p>
                </>
              )}

              {/* 🔸 Recategorización */}
              {solicitudSeleccionada.tipo_tramite_nombre === "Recategorización" && (
                <>
                  <p><strong>Nombre completo:</strong> {solicitudSeleccionada.datos?.nombre}</p>
                  <p><strong>Mail:</strong> {solicitudSeleccionada.datos?.mail}</p>
                  <p><strong>CUIT:</strong> {solicitudSeleccionada.datos?.cuit}</p>
                  <p><strong>Teléfono:</strong> {solicitudSeleccionada.datos?.telefono}</p>
                  <p><strong>Domicilio:</strong> {solicitudSeleccionada.datos?.domicilio}</p>
                  <p><strong>Clave Fiscal:</strong> {solicitudSeleccionada.datos?.clave_fiscal}</p>
                  <p><strong>Categoría Deseada:</strong> {solicitudSeleccionada.datos?.categoriaDeseada}</p>
                  <p><strong>Ingresos últimos 12 meses:</strong> {solicitudSeleccionada.datos?.ingresosUltimos12meses}</p>
                </>
              )}

              <Form.Group className="mt-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={
                    estados.find(
                      (e) =>
                        e.nombre ===
                        solicitudSeleccionada.estado_nombre
                    )?.id || ""
                  }
                  onChange={(e) =>
                    actualizarEstado(e.target.value)
                  }
                >
                  {estados.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={solicitudSeleccionada.observaciones || ""}
                  onChange={(e) =>
                    setSolicitudSeleccionada((prev) => ({
                      ...prev,
                      observaciones: e.target.value,
                    }))
                  }
                  onBlur={() =>
                    actualizarEstado(
                      estados.find(
                        (e) =>
                          e.nombre ===
                          solicitudSeleccionada.estado_nombre
                      )?.id,
                      solicitudSeleccionada.observaciones
                    )
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cerrarModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SolicitudesGrid;

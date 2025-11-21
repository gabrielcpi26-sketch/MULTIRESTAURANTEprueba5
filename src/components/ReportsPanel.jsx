<<<<<<< HEAD
// =============================================
// ReportsPanel.jsx (Modularizado, MISMO DISEÑO)
// =============================================
// Mantiene el estilo original: tarjetas, totales,
// listas de ventas y diseño simple. Sin cambios.
// =============================================

import React from "react";
import Container from "./ui/Container";
import Card from "./ui/Card";

function ReportsPanel({ r }) {
  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>Selecciona un restaurante para ver reportes.</p>
        </Card>
      </Container>
    );
  }

  const ventas = r.ventas || [];
  const totalGeneral = ventas.reduce((s, v) => s + (v.total || 0), 0);

  return (
    <Container>
      {/* RESUMEN GENERAL */}
      <Card>
        <h3 style={{ marginTop: 0 }}>Resumen de Ventas</h3>
        <p style={{ fontSize: 14, margin: 0 }}>
          <strong>Total de ventas:</strong> {ventas.length}
        </p>
        <p style={{ fontSize: 14, margin: "4px 0 0 0" }}>
          <strong>Monto total:</strong> ${totalGeneral}
        </p>
      </Card>

      {/* LISTA DE VENTAS */}
      <h3 style={{ marginTop: 20 }}>Historial</h3>

      {ventas.length === 0 && <p>No hay ventas registradas.</p>}

      {ventas.map((v, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>
            Fecha: {new Date(v.fecha).toLocaleString()}
          </p>

          {/* ITEMS */}
          {v.items.map((item, idx) => (
            <p key={idx} style={{ margin: "4px 0", fontSize: 13 }}>
              {item.nombre} — ${item.total}
            </p>
          ))}

          <p style={{ margin: "4px 0", fontSize: 13 }}>
            <strong>Método de pago:</strong> {v.metodoPago}
          </p>

          <p style={{ margin: 0, fontWeight: "bold" }}>Total: ${v.total}</p>
        </Card>
      ))}
    </Container>
  );
}

=======
// =============================================
// ReportsPanel.jsx (Modularizado, MISMO DISEÑO)
// =============================================
// Mantiene el estilo original: tarjetas, totales,
// listas de ventas y diseño simple. Sin cambios.
// =============================================

import React from "react";
import Container from "./ui/Container";
import Card from "./ui/Card";

function ReportsPanel({ r }) {
  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>Selecciona un restaurante para ver reportes.</p>
        </Card>
      </Container>
    );
  }

  const ventas = r.ventas || [];
  const totalGeneral = ventas.reduce((s, v) => s + (v.total || 0), 0);

  return (
    <Container>
      {/* RESUMEN GENERAL */}
      <Card>
        <h3 style={{ marginTop: 0 }}>Resumen de Ventas</h3>
        <p style={{ fontSize: 14, margin: 0 }}>
          <strong>Total de ventas:</strong> {ventas.length}
        </p>
        <p style={{ fontSize: 14, margin: "4px 0 0 0" }}>
          <strong>Monto total:</strong> ${totalGeneral}
        </p>
      </Card>

      {/* LISTA DE VENTAS */}
      <h3 style={{ marginTop: 20 }}>Historial</h3>

      {ventas.length === 0 && <p>No hay ventas registradas.</p>}

      {ventas.map((v, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>
            Fecha: {new Date(v.fecha).toLocaleString()}
          </p>

          {/* ITEMS */}
          {v.items.map((item, idx) => (
            <p key={idx} style={{ margin: "4px 0", fontSize: 13 }}>
              {item.nombre} — ${item.total}
            </p>
          ))}

          <p style={{ margin: "4px 0", fontSize: 13 }}>
            <strong>Método de pago:</strong> {v.metodoPago}
          </p>

          <p style={{ margin: 0, fontWeight: "bold" }}>Total: ${v.total}</p>
        </Card>
      ))}
    </Container>
  );
}

>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8
export default ReportsPanel;
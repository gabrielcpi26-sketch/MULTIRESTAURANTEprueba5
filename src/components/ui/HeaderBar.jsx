// =============================================
// HeaderBar.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Barra superior de tu app. Mantiene el mismo
// estilo verde, texto centrado y padding.
// =============================================

import React from "react";

function HeaderBar() {
  return (
    <div
      style={{
        width: "100%",
        background: "#16a34a",
        padding: "14px 0",
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        borderBottom: "3px solid #0f5132",
      }}
    >
      Mi Restaurante
    </div>
  );
}

export default HeaderBar;
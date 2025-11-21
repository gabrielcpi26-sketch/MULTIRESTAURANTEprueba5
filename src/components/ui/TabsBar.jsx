// =============================================
// TabsBar.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Barra de pestañas para navegar entre:
// Menú, Vista pública, Configuración y Reportes.
// Mantiene el comportamiento y estilo original.
// =============================================

import React from "react";

const tabs = [
  { id: "menu", label: "Menú" },
  { id: "public", label: "Vista cliente" },
  { id: "settings", label: "Configuración" },
  { id: "reports", label: "Reportes" },
];

function TabsBar({ tab, setTab }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        borderBottom: "1px solid #e5e7eb",
        background: "#f9fafb",
      }}
    >
      {tabs.map((t) => {
        const active = t.id === tab;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderBottom: active ? "3px solid #16a34a" : "3px solid transparent",
              background: active ? "white" : "#f9fafb",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active ? "bold" : "normal",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default TabsBar;

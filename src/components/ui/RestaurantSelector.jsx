// =============================================
// RestaurantSelector.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Selector de restaurante + botón para agregar uno nuevo.
// Mantiene el flujo original: lista desplegable simple
// y botón para crear restaurante.
// =============================================

import React from "react";
import Card from "./Card";
import Button from "./Button";

function RestaurantSelector({ restaurantes, activeRest, setActiveRest, addRestaurant }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "10px auto 0 auto",
        padding: "0 16px",
      }}
    >
      <Card>
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: "bold" }}>
            Restaurante activo
          </label>
          <select
            value={activeRest || ""}
            onChange={(e) => setActiveRest(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #d1d5db",
              marginTop: 4,
            }}
          >
            {restaurantes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={addRestaurant}>Agregar nuevo restaurante</Button>
      </Card>
    </div>
  );
}

export default RestaurantSelector;

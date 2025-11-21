// =============================================
// CheckoutModal.jsx (Modularizado, MISMO DISEÑO)
// =============================================

import React, { useState, useEffect } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";

// =============================================
// MODAL DE CHECKOUT (CONFIRMAR PEDIDO)
// =============================================
// Mantiene DISEÑO Y FLUJO ORIGINAL
// Solo modularizado para evitar errores.
// =============================================

function CheckoutModal({ r, cart, onClose, onSaleRegistered }) {
  const [nombre, setNombre] = useState("");
  const [tipoServicio, setTipoServicio] = useState("recoger");
  const [domicilio, setDomicilio] = useState("");
  const [ubicacionExacta, setUbicacionExacta] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const total = cart.reduce((s, i) => s + (i.total || 0), 0);

  // ==========================================================
  // USAR UBICACIÓN GPS (misma lógica de tu diseño original)
  // ==========================================================
  const handleUsarUbicacion = () => {
    if (!navigator.geolocation) {
      alert("Tu dispositivo no permite obtener la ubicación automáticamente.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setUbicacionExacta(coords);
        setDomicilio(coords);
      },
      () => {
        alert("No se pudo obtener tu ubicación.");
      }
    );
  };

  const handleConfirmar = () => {
    if (!nombre.trim()) {
      alert("Escribe tu nombre para continuar.");
      return;
    }

    if (tipoServicio === "domicilio" && !domicilio.trim()) {
      alert("Escribe tu dirección o usa tu ubicación actual.");
      return;
    }

    onSaleRegistered(cart, metodoPago);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <Card style={{ width: "90%", maxWidth: 420 }}>
        <h2 style={{ marginTop: 0 }}>Confirmar Pedido</h2>

        {/* NOMBRE */}
        <label style={{ fontSize: 13 }}>Tu nombre</label>
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Juan Pérez"
          style={{ marginBottom: 12 }}
        />

        {/* TIPO DE SERVICIO */}
        <label style={{ fontSize: 13 }}>Tipo de servicio</label>
        <select
          value={tipoServicio}
          onChange={(e) => setTipoServicio(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 6 }}
        >
          <option value="recoger">Recoger en el local</option>
          <option value="domicilio">Entrega a domicilio</option>
        </select>

        {/* DIRECCIÓN / UBICACIÓN */}
        {tipoServicio === "domicilio" && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>Dirección de entrega</label>
            <TextArea
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              placeholder="Calle, número, colonia... o usa ubicación"
            />

            <Button
              onClick={handleUsarUbicacion}
              style={{
                marginTop: 6,
                fontSize: 12,
                background: "#e5e7eb",
                color: "#111",
              }}
            >
              📍 Usar mi ubicación actual
            </Button>
          </div>
        )}

        {/* MÉTODO DE PAGO */}
        <label style={{ fontSize: 13 }}>Método de pago</label>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 6 }}
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta / Link de pago</option>
          <option value="transferencia">Transferencia</option>
        </select>

        {/* TOTAL */}
        <h3 style={{ marginTop: 0 }}>Total a pagar: ${total}</h3>

        <Button
          style={{ background: "#34d399", width: "100%", marginBottom: 8 }}
          onClick={handleConfirmar}
        >
          Confirmar pedido
        </Button>

        <Button
          style={{ background: "#dc2626", width: "100%" }}
          onClick={onClose}
        >
          Cancelar
        </Button>
      </Card>
    </div>
  );
}

export default CheckoutModal;

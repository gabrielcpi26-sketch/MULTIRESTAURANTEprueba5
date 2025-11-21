// =============================================
// CustomizeModal.jsx (Modularizado, MISMO DISEÑO)
// =============================================

import React, { useState, useEffect } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Grid from "./ui/Grid";

// =============================================
// MODAL DE PERSONALIZACIÓN DE PLATILLOS
// =============================================
// Mantiene DISEÑO Y LÓGICA ORIGINAL.
// NO cambia tu forma de personalizar.
// =============================================

function CustomizeModal({ item, onClose, onAdd }) {
  const [seleccionIngredientes, setSeleccionIngredientes] = useState([]);
  const [seleccionExtras, setSeleccionExtras] = useState([]);
  const [total, setTotal] = useState(item.precio || 0);

  // Inicializar selección con los ingredientes base
  useEffect(() => {
    setSeleccionIngredientes(item.ingredientesBase || []);
    setSeleccionExtras([]);
    setTotal(item.precio || 0);
  }, [item]);

  // ==========================================================
  // QUITAR INGREDIENTES → el cliente toca uno y significa “sin”
  // ==========================================================
  const toggleIngrediente = (ing) => {
    if (seleccionIngredientes.includes(ing)) {
      // Si está incluido → lo quitamos
      setSeleccionIngredientes(
        seleccionIngredientes.filter((i) => i !== ing)
      );
    } else {
      // Si no está → lo volvemos a agregar
      setSeleccionIngredientes([...seleccionIngredientes, ing]);
    }
  };

  // ==========================================================
  // EXTRAS → suman costo adicional $10 por extra
  // ==========================================================
  const toggleExtra = (extra) => {
    if (seleccionExtras.includes(extra)) {
      setSeleccionExtras(seleccionExtras.filter((e) => e !== extra));
      setTotal(total - 10);
    } else {
      setSeleccionExtras([...seleccionExtras, extra]);
      setTotal(total + 10);
    }
  };

  const handleAdd = () => {
    const configurado = {
      ...item,
      qty: 1,
      seleccionIngredientes,
      seleccionExtras,
      total,
    };

    onAdd(configurado);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <Card style={{ width: "90%", maxWidth: 400 }}>
        <h3 style={{ marginTop: 0 }}>Personalizar {item.nombre}</h3>

        {/* INGREDIENTES BASE */}
        {item.ingredientesBase?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h4 style={{ marginBottom: 6 }}>Ingredientes</h4>
            <Grid columns={2} style={{ gap: 8 }}>
              {item.ingredientesBase.map((ing) => (
                <Button
                  key={ing}
                  style={{
                    background: seleccionIngredientes.includes(ing)
                      ? "#34d399"
                      : "#ef4444",
                  }}
                  onClick={() => toggleIngrediente(ing)}
                >
                  {seleccionIngredientes.includes(ing)
                    ? ing
                    : `Sin ${ing}`}
                </Button>
              ))}
            </Grid>
          </div>
        )}

        {/* EXTRAS */}
        {item.extras?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h4 style={{ marginBottom: 6 }}>Extras ($10 c/u)</h4>
            <Grid columns={2} style={{ gap: 8 }}>
              {item.extras.map((ext) => (
                <Button
                  key={ext}
                  style={{
                    background: seleccionExtras.includes(ext)
                      ? "#3b82f6"
                      : "#6b7280",
                  }}
                  onClick={() => toggleExtra(ext)}
                >
                  {ext}
                </Button>
              ))}
            </Grid>
          </div>
        )}

        <h3>Total: ${total}</h3>

        <Button
          style={{ background: "#34d399", width: "100%", marginBottom: 8 }}
          onClick={handleAdd}
        >
          Agregar al carrito
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

export default CustomizeModal;
<<<<<<< HEAD
// =============================================
// Card.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Tarjeta base utilizada en TODA tu interfaz.
// Mantiene el estilo original: bordes suaves,
// sombra ligera, fondo blanco o gris claro.
// =============================================

import React from "react";

function Card({ children, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        background: "white",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

=======
// =============================================
// Card.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Tarjeta base utilizada en TODA tu interfaz.
// Mantiene el estilo original: bordes suaves,
// sombra ligera, fondo blanco o gris claro.
// =============================================

import React from "react";

function Card({ children, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        background: "white",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8
export default Card;
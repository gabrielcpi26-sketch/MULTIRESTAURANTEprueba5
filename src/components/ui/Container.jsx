<<<<<<< HEAD
// =============================================
// Container.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Contenedor principal usado en todas las vistas.
// Mantiene el padding y ancho original para que
// tu diseño luzca exactamente igual.
// =============================================

import React from "react";

function Container({ children, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        padding: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

=======
// =============================================
// Container.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Contenedor principal usado en todas las vistas.
// Mantiene el padding y ancho original para que
// tu diseño luzca exactamente igual.
// =============================================

import React from "react";

function Container({ children, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        padding: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8
export default Container;
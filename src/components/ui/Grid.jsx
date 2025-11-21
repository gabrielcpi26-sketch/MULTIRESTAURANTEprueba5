<<<<<<< HEAD
// =============================================
// Grid.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Usa CSS Grid simple para organizar elementos.
// Mantiene el diseño original: 2 columnas en menú,
// botones, inputs, etc.
// =============================================

import React from "react";

function Grid({ children, columns = 2, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

=======
// =============================================
// Grid.jsx (UI Component - MISMO DISEÑO)
// =============================================
// Usa CSS Grid simple para organizar elementos.
// Mantiene el diseño original: 2 columnas en menú,
// botones, inputs, etc.
// =============================================

import React from "react";

function Grid({ children, columns = 2, style = {}, ...rest }) {
  return (
    <div
      {...rest}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8
export default Grid;
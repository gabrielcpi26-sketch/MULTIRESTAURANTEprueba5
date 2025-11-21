// =============================================
// Button.jsx (UI Component - MISMO DISEÑO)
// =============================================

import React from "react";

function Button({ children, style = {}, ...rest }) {
  return (
    <button
      {...rest}
      style={{
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 14,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default Button;

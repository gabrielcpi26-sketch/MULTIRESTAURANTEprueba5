<<<<<<< HEAD
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
=======
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
>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8

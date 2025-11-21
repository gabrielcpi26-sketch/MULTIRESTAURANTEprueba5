<<<<<<< HEAD
// =============================================
// Input.jsx (UI Component - MISMO DISEÑO)
// =============================================

import React from "react";

function Input({ style = {}, ...rest }) {
  return (
    <input
      {...rest}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 14,
        outline: "none",
        marginTop: 4,
        ...style,
      }}
    />
  );
}

=======
// =============================================
// Input.jsx (UI Component - MISMO DISEÑO)
// =============================================

import React from "react";

function Input({ style = {}, ...rest }) {
  return (
    <input
      {...rest}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 14,
        outline: "none",
        marginTop: 4,
        ...style,
      }}
    />
  );
}

>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8
export default Input;
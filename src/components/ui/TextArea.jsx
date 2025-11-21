// =============================================
// TextArea.jsx (UI Component - MISMO DISEÑO)
// =============================================

import React from "react";

function TextArea({ style = {}, ...rest }) {
  return (
    <textarea
      {...rest}
      style={{
        width: "100%",
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 14,
        minHeight: 70,
        outline: "none",
        marginTop: 4,
        resize: "vertical",
        ...style,
      }}
    />
  );
}

export default TextArea;
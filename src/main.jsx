import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import LandingPro from "./LandingPro.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta principal normal */}
        <Route path="/*" element={<App />} />

        {/* Ruta para la landing */}
        <Route path="/demo" element={<LandingPro />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

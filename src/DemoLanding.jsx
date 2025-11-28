// src/DemoLanding.jsx
import React, { useState } from "react";
const DemoLanding = () => {
  const [activeDemo, setActiveDemo] = useState("restaurante");

  const demoConfig = {
    restaurante: {
      titulo: "Demo Restaurante · Menú digital y pedidos",
      linea: "Así verían tus clientes el menú desde su celular.",
      items: ["Hamburguesa clásica", "Pasta Alfredo", "Combo familiar"],
      demoUrl: "https://plataforma-multi-restaurante-a3ga.vercel.app/?view=cliente&rest=nubia-s-snack", // ⚠️ CAMBIA ESTO
    },
    gym: {
      titulo: "Demo Gym / Fitness · Membresías y clases",
      linea: "Agenda, control de socios y recordatorios.",
      items: ["Membresía mensual", "Clase funcional", "Paquete anual"],
      demoUrl: "https://plataforma-multi-restaurante-a3ga.vercel.app/?view=cliente&rest=nubia-s-snack", // ⚠️ CAMBIA ESTO
    },
    hotel: {
      titulo: "Demo Hotel / Airbnb · Reservas rápidas",
      linea: "Reservas, upsell de servicios y mensajes automáticos.",
      items: ["Noche habitación doble", "Desayuno", "Late check-out"],
      demoUrl: "https://plataforma-multi-restaurante-a3ga.vercel.app/?view=cliente&rest=nubia-s-snack", // ⚠️ CAMBIA ESTO
    },
    ecom: {
      titulo: "Demo E-commerce · Carrito de compra",
      linea: "Catálogo, carrito y flujo de pago simple.",
      items: ["Playera", "Jeans", "Tenis"],
      demoUrl: "https://plataforma-multi-restaurante-a3ga.vercel.app/?view=cliente&rest=nubia-s-snack", // ⚠️ CAMBIA ESTO
    },
  };

  const demo = demoConfig[activeDemo];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const nombre = form.nombre.value.trim();
    const whatsapp = form.whatsapp.value.trim();
    const tipo = form["tipo-negocio"].value;
    const comentarios = form.comentarios.value.trim();

    if (!nombre || !whatsapp || !tipo) {
      alert("Por favor completa nombre, WhatsApp y tipo de negocio.");
      return;
    }

    // ⚠️ PON AQUÍ TU NÚMERO DE WHATSAPP EN FORMATO INTERNACIONAL (SIN +, NI ESPACIOS)
    // Ejemplo México: 5215512345678
    const tuNumeroWhatsApp = "524872586302"; // CAMBIA ESTO

    const mensaje = `
Hola, soy ${nombre}.
Me interesa una DEMO de tus apps.

📌 Tipo de negocio: ${tipo}
📱 Mi WhatsApp: ${whatsapp}
🧩 Demo que estaba viendo: ${demo.titulo}
📝 Lo que me gustaría lograr: ${
      comentarios || "por definir, pero quiero más info."
    }

¿Me ayudas con una demo guiada y precios?`;

    const url = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Estilos SOLO para esta página */}
      <style>{`
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: radial-gradient(circle at top, #1f2937, #020617 60%);
          color: #f9fafb;
        }
        .demo-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 16px 40px;
        }
        .demo-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 24px;
        }
        .demo-logo {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .demo-logo-circle {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, #ffffff, #22c55e 40%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #020617;
          font-size: 18px;
        }
        .demo-logo-text-main {
          font-weight: 700;
          font-size: 18px;
        }
        .demo-logo-text-sub {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .demo-header-right {
          font-size: 11px;
          color: #9ca3af;
          text-align: right;
        }
        .demo-badge {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.5);
          font-size: 11px;
          margin-bottom: 10px;
        }
        .demo-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 12px rgba(34,197,94,0.7);
        }
        .demo-main {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .demo-main {
            grid-template-columns: minmax(0,1fr);
          }
          .demo-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .demo-header-right {
            text-align: left;
          }
        }
        .demo-title {
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .demo-highlight {
          background: linear-gradient(to right, #22c55e, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          color: transparent;
        }
        .demo-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 14px;
          max-width: 500px;
        }
        .demo-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .demo-chip {
          font-size: 11px;
          padding: 4px 9px;
          border-radius: 999px;
          border: 1px solid rgba(55,65,81,0.9);
          background: rgba(15,23,42,0.95);
        }
        .demo-benefits {
          font-size: 12px;
          color: #9ca3af;
          display: grid;
          gap: 8px;
          margin-top: 8px;
        }
        .demo-benefit-item span {
          color: #e5e7eb;
          font-weight: 500;
        }
        .demo-note {
          margin-top: 10px;
          font-size: 11px;
          color: #9ca3af;
        }
        .demo-right-card {
          background: radial-gradient(circle at top, rgba(37,99,235,0.25), #020617);
          border-radius: 20px;
          border: 1px solid rgba(51,65,85,0.9);
          padding: 14px;
          box-shadow: 0 18px 30px rgba(15,23,42,0.9);
        }
        .demo-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }
        .demo-tab-btn {
          font-size: 11px;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid rgba(55,65,81,0.9);
          background: rgba(15,23,42,0.9);
          color: #9ca3af;
          cursor: pointer;
        }
        .demo-tab-btn.active {
          border-color: rgba(129,140,248,0.9);
          background: rgba(37,99,235,0.18);
          color: #e5e7eb;
        }
        .demo-preview {
          border-radius: 14px;
          border: 1px solid rgba(30,64,175,0.9);
          padding: 10px;
          background: linear-gradient(135deg, #020617, #111827);
          margin-bottom: 12px;
          font-size: 12px;
        }
        .demo-preview-title {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .demo-preview-line {
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .demo-preview-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        .demo-pill-item {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px dashed rgba(148,163,184,0.6);
        }
        .demo-preview-footer {
          font-size: 11px;
          color: #9ca3af;
        }
        .demo-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 10px 0 4px;
        }
        .demo-link {
          font-size: 11px;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.7);
          color: #e5e7eb;
          text-decoration: none;
        }
        .demo-link.main {
          border-color: rgba(34,197,94,0.9);
          color: #bbf7d0;
        }
        .demo-form {
          margin-top: 10px;
          border-radius: 16px;
          border: 1px solid rgba(55,65,81,0.9);
          padding: 12px;
          background: radial-gradient(circle at top, rgba(56,189,248,0.2), #020617);
        }
        .demo-form-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .demo-form-sub {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 10px;
        }
        .demo-form-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        }
        .demo-form-row label {
          font-size: 11px;
          color: #9ca3af;
        }
        .demo-form-input,
        .demo-form-select,
        .demo-form-textarea {
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.7);
          background: rgba(15,23,42,0.95);
          padding: 7px 10px;
          font-size: 12px;
          color: #f9fafb;
          outline: none;
        }
        .demo-form-textarea {
          border-radius: 10px;
          resize: vertical;
          min-height: 55px;
        }
        .demo-form-input:focus,
        .demo-form-select:focus,
        .demo-form-textarea:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 1px rgba(59,130,246,0.5);
        }
        .demo-form-hint {
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 6px;
        }
        .demo-btn {
          width: 100%;
          border-radius: 999px;
          border: none;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #eff6ff;
        }
        .demo-form-foot {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 6px;
        }
      `}</style>

      <div className="demo-wrap">
        <header className="demo-header">
          <div className="demo-logo">
            <div className="demo-logo-circle">G</div>
            <div>
              <div className="demo-logo-text-main">Gabriel Cruz Apps</div>
              <div className="demo-logo-text-sub">Demo en vivo para negocios</div>
            </div>
          </div>
          <div className="demo-header-right">
            <div>Link especial para mostrar la plataforma a tus clientes.</div>
            <div>Usa esta URL solo como DEMO: /demo</div>
          </div>
        </header>

        <main className="demo-main">
          {/* Columna izquierda: mensaje de venta */}
          <section>
            <div className="demo-badge">
              <span className="demo-dot" />
              <span>Demo lista para compartir por WhatsApp</span>
            </div>
            <h1 className="demo-title">
              Convierte curiosos en clientes con una{" "}
              <span className="demo-highlight">demo guiada</span> de tus apps.
            </h1>
            <p className="demo-subtitle">
              Manda este link a tus prospectos. Ellos prueban la app como
              clientes, te dejan sus datos y tú solo entras a cerrar la venta.
            </p>

            <div className="demo-chips">
              <div className="demo-chip">Vista solo modo cliente</div>
              <div className="demo-chip">Optimizada para celular</div>
              <div className="demo-chip">Formulario directo a WhatsApp</div>
            </div>

            <div className="demo-benefits">
              <div className="demo-benefit-item">
                <span>1. </span>Mandas un solo link:{" "}
                <strong>tudominio.vercel.app/demo</strong>
              </div>
              <div className="demo-benefit-item">
                <span>2. </span>El prospecto prueba la demo (restaurante, gym, hotel,
                e-commerce…)
              </div>
              <div className="demo-benefit-item">
                <span>3. </span>Te escribe por WhatsApp con un mensaje armado y tú
                cierras la venta.
              </div>
            </div>

            <div className="demo-note">
              Ideal para restaurantes, dark kitchens, gimnasios, hoteles,
              cafeterías, clínicas y tiendas online.
            </div>
          </section>

          {/* Columna derecha: demos + formulario */}
          <section className="demo-right-card">
            <div className="demo-tabs">
              <button
                className={
                  "demo-tab-btn " +
                  (activeDemo === "restaurante" ? "active" : "")
                }
                onClick={() => setActiveDemo("restaurante")}
              >
                🍽 Restaurante
              </button>
              <button
                className={
                  "demo-tab-btn " + (activeDemo === "gym" ? "active" : "")
                }
                onClick={() => setActiveDemo("gym")}
              >
                💪 Gym
              </button>
              <button
                className={
                  "demo-tab-btn " + (activeDemo === "hotel" ? "active" : "")
                }
                onClick={() => setActiveDemo("hotel")}
              >
                🏨 Hotel
              </button>
              <button
                className={
                  "demo-tab-btn " + (activeDemo === "ecom" ? "active" : "")
                }
                onClick={() => setActiveDemo("ecom")}
              >
                🛒 E-commerce
              </button>
            </div>

            <div className="demo-preview">
              <div className="demo-preview-title">{demo.titulo}</div>
              <div className="demo-preview-line">{demo.linea}</div>
              <div className="demo-preview-list">
                {demo.items.map((it) => (
                  <div key={it} className="demo-pill-item">
                    {it}
                  </div>
                ))}
              </div>
              <div className="demo-preview-footer">
                Así vería tu cliente la app (sin panel administrador ni cosas
                técnicas).
              </div>

              <div className="demo-actions">
                <a
                  className="demo-link main"
                  href={demo.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Probar demo en vivo
                </a>
              </div>
            </div>

            <form className="demo-form" onSubmit={handleSubmit}>
              <div className="demo-form-title">
                Recibe tu demo adaptada a tu negocio
              </div>
              <div className="demo-form-sub">
                Llena 3 datos y se abrirá WhatsApp con un mensaje automático.
              </div>

              <div className="demo-form-row">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  id="nombre"
                  name="nombre"
                  className="demo-form-input"
                  placeholder="Cómo te llamas"
                  required
                />
              </div>

              <div className="demo-form-row">
                <label htmlFor="whatsapp">WhatsApp *</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  className="demo-form-input"
                  placeholder="Ej. 55 1234 5678"
                  required
                />
              </div>

              <div className="demo-form-row">
                <label htmlFor="tipo-negocio">Tipo de negocio *</label>
                <select
                  id="tipo-negocio"
                  name="tipo-negocio"
                  className="demo-form-select"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option value="Restaurante / Dark Kitchen">
                    Restaurante / Dark Kitchen
                  </option>
                  <option value="Cafetería / Pastelería">
                    Cafetería / Pastelería
                  </option>
                  <option value="Gimnasio / Fitness">Gimnasio / Fitness</option>
                  <option value="Hotel / Posada / Airbnb">
                    Hotel / Posada / Airbnb
                  </option>
                  <option value="Tienda en línea / E-commerce">
                    Tienda en línea / E-commerce
                  </option>
                  <option value="Clínica / Consultorio">
                    Clínica / Consultorio
                  </option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="demo-form-row">
                <label htmlFor="comentarios">
                  ¿Qué te gustaría lograr con la app?{" "}
                  <span style={{ opacity: 0.6 }}>(opcional)</span>
                </label>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  className="demo-form-textarea"
                  placeholder="Ej. tomar pedidos por WhatsApp, controlar repartos, vender más sin apps de terceros…"
                />
              </div>

              <div className="demo-form-hint">
                Al enviar, se abrirá WhatsApp para confirmar tu interés de
                inmediato.
              </div>

              <button type="submit" className="demo-btn">
                💬 Enviar mis datos por WhatsApp
              </button>

              <div className="demo-form-foot">
                Respuesta típica en menos de unas horas (horario MX).
              </div>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default DemoLanding;

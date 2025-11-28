// src/DemoLanding.jsx
import React, { useState } from "react";

const DemoLanding = () => {
  const [activeDemo, setActiveDemo] = useState("restaurante");

  // 👉 Aquí configuras las demos y los links REALES
  const demoConfig = {
    restaurante: {
      titulo: "Demo Restaurante · Menú digital y pedidos",
      linea: "Muestra tu menú desde el celular y recibe pedidos sin complicarte.",
      items: ["Entradas", "Platillos fuertes", "Promos y combos"],
      demoUrl:
        "https://plataforma-multi-restaurante-a3ga.vercel.app/?view=cliente&rest=nubia-s-snack", // <-- TU DEMO REAL
    },
    gym: {
      titulo: "Demo Gym / Fitness · Socios y clases",
      linea: "Controla membresías, clases y comunicación con tus clientes.",
      items: ["Membresías", "Agenda de clases", "Recordatorios"],
      demoUrl: "https://tu-link-demo-gym.com", // <-- EDITABLE
    },
    hotel: {
      titulo: "Demo Hotel / Airbnb · Reservas fáciles",
      linea: "Reservas rápidas, upsell de servicios y mejor experiencia al huésped.",
      items: ["Reservas", "Servicios extra", "Check-in sencillo"],
      demoUrl: "https://tu-link-demo-hotel.com", // <-- EDITABLE
    },
    ecom: {
      titulo: "Demo E-commerce · Carrito y pedidos",
      linea: "Catálogo, carrito y pedidos en línea para vender más todos los días.",
      items: ["Catálogo", "Carrito de compra", "Pedidos en línea"],
      demoUrl: "https://tu-link-demo-ecommerce.com", // <-- EDITABLE
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
    const tuNumeroWhatsApp = "5215512345678"; // <-- CAMBIA ESTO

    const mensaje = `
Hola, soy ${nombre}.
Me interesa una DEMO de tus apps.

📌 Tipo de negocio: ${tipo}
📱 Mi WhatsApp: ${whatsapp}
🧩 Demo que estaba viendo: ${demo.titulo}
📝 Lo que me gustaría lograr: ${
      comentarios || "todavía definiendo, pero quiero más información."
    }

¿Me ayudas con una demo guiada y precios?`;

    const url = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Estilos SOLO para esta landing de ventas */}
      <style>{`
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: radial-gradient(circle at top, #020617 0%, #020617 45%, #020617 100%);
          color: #f9fafb;
        }

        .demo-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 26px 16px 40px;
        }

        .demo-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 26px;
        }

        .demo-logo {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .demo-logo-circle {
          width: 36px;
          height: 36px;
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

        @media (max-width: 900px) {
          .demo-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .demo-header-right {
            text-align: left;
          }
        }

        .demo-badge {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          padding: 4px 11px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.5);
          font-size: 11px;
          margin-bottom: 12px;
          background: rgba(15,23,42,0.9);
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
          gap: 26px;
        }

        @media (max-width: 900px) {
          .demo-main {
            grid-template-columns: minmax(0,1fr);
          }
        }

        .demo-title {
          font-size: clamp(26px, 4vw, 34px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .demo-highlight {
          background: linear-gradient(to right, #22c55e, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          color: transparent;
        }

        .demo-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 16px;
          max-width: 520px;
        }

        .demo-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .demo-chip {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(55,65,81,0.9);
          background: rgba(15,23,42,0.95);
        }

        .demo-benefits {
          font-size: 12px;
          color: #9ca3af;
          display: grid;
          gap: 7px;
          margin-top: 4px;
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
          background: radial-gradient(circle at top, rgba(37,99,235,0.28), #020617);
          border-radius: 20px;
          border: 1px solid rgba(51,65,85,0.9);
          padding: 14px;
          box-shadow: 0 18px 30px rgba(15,23,42,0.9);
        }

        /* AVATAR FEMENINO ELEGANTE */
        .avatar-wrap {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          margin-bottom: 14px;
        }

        .avatar-media {
          width: 70px;
          height: 70px;
          border-radius: 999px;
          overflow: hidden;
          border: 2px solid rgba(251, 191, 183, 0.85);
          box-shadow: 0 0 24px rgba(251, 113, 133, 0.5);
          background: radial-gradient(circle at 30% 20%, #f9a8d4, #1d2438);
          position: relative;
        }

        .avatar-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-badge-ring {
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          border: 2px solid rgba(244, 114, 182, 0.35);
          pointer-events: none;
          animation: avatar-pulse 2.4s infinite;
        }

        @keyframes avatar-pulse {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
          100% { opacity: 0.4; transform: scale(1); }
        }

        .avatar-bubble {
          border-radius: 14px;
          padding: 8px 10px;
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(148,163,184,0.6);
          font-size: 11px;
          color: #e5e7eb;
          position: relative;
        }

        .avatar-bubble::before {
          content: "";
          position: absolute;
          left: -6px;
          top: 18px;
          width: 10px;
          height: 10px;
          background: rgba(15,23,42,0.95);
          border-left: 1px solid rgba(148,163,184,0.6);
          border-bottom: 1px solid rgba(148,163,184,0.6);
          transform: rotate(45deg);
        }

        .avatar-name {
          font-weight: 600;
          font-size: 11px;
          margin-bottom: 2px;
          color: #f9fafb;
        }

        .avatar-role {
          font-size: 10px;
          color: #9ca3af;
          margin-bottom: 4px;
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
          border-color: rgba(129,140,248,0.95);
          background: rgba(37,99,235,0.22);
          color: #e5e7eb;
        }

        .demo-preview {
          border-radius: 14px;
          border: 1px solid rgba(30,64,175,0.9);
          padding: 10px;
          background: linear-gradient(135deg, #020617, #0b1220);
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
          margin-bottom: 10px;
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
          flex-direction: column;
          gap: 4px;
          margin: 12px 0 2px;
        }

        .demo-link.main {
          font-size: 12px;
          padding: 9px 14px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #022c22;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          box-shadow: 0 16px 30px rgba(22,163,74,0.45);
          position: relative;
        }

        .demo-link.main:hover {
          filter: brightness(1.02);
        }

        .demo-hand-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #bbf7d0;
        }

        .demo-hand-icon {
          display: inline-flex;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          align-items: center;
          justify-content: center;
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(16,185,129,0.7);
          box-shadow: 0 0 14px rgba(34,197,94,0.5);
          animation: demo-hand-bounce 1.4s infinite;
        }

        @keyframes demo-hand-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .demo-form {
          margin-top: 12px;
          border-radius: 16px;
          border: 1px solid rgba(55,65,81,0.9);
          padding: 12px;
          background: radial-gradient(circle at top, rgba(56,189,248,0.22), #020617);
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
            {/* 🔧 LOGO EDITABLE:
                Puedes reemplazar la bolita "G" por una imagen, por ejemplo:
                <img src="/mi-logo.png" alt="Mi marca" style={{ width: 40, height: 40, borderRadius: "999px" }} />
            */}
            <div className="demo-logo-circle">G</div>
            <div>
              <div className="demo-logo-text-main">Gabriel Cruz Apps</div>
              <div className="demo-logo-text-sub">Apps y sitios web para negocios</div>
            </div>
          </div>
          <div className="demo-header-right">
            <div>Soluciones digitales para negocios que quieren vender más y verse profesionales.</div>
          </div>
        </header>

        <main className="demo-main">
          {/* Columna izquierda: mensaje comercial */}
          <section>
            <div className="demo-badge">
              <span className="demo-dot" />
              <span>Demo interactiva lista para mostrar a tus clientes</span>
            </div>

            <h1 className="demo-title">
              Convierte curiosos en clientes con una{" "}
              <span className="demo-highlight">app a la medida</span> de tu negocio.
            </h1>

            <p className="demo-subtitle">
              Esta demo está pensada para todo tipo de negocios: restaurantes, cafeterías,
              gimnasios, hoteles, clínicas, tiendas en línea y más. Queremos entender tus
              necesidades y mostrarte cómo una app puede ayudarte a vender mejor y trabajar
              más fácil.
            </p>

            <div className="demo-chips">
              <div className="demo-chip">Más ventas, menos complicaciones</div>
              <div className="demo-chip">Tus clientes piden directo desde su celular</div>
              <div className="demo-chip">Imagen profesional para tu marca</div>
            </div>

            <div className="demo-benefits">
              <div className="demo-benefit-item">
                <span>1. </span>Eliges el tipo de negocio que se parece al tuyo.
              </div>
              <div className="demo-benefit-item">
                <span>2. </span>Ves cómo se vería tu app funcionando para tus clientes.
              </div>
              <div className="demo-benefit-item">
                <span>3. </span>Dejas tus datos y te contactamos por WhatsApp con una propuesta hecha a tu medida.
              </div>
            </div>

            <div className="demo-note">
              Funciona para restaurantes, cafeterías, dark kitchens, gimnasios, hoteles,
              clínicas, tiendas online <strong>y muchos tipos de negocio más.</strong>
            </div>
          </section>

          {/* Columna derecha: avatar + demos + formulario */}
          <section className="demo-right-card">
            {/* AVATAR FEMENINO ELEGANTE */}
            <div className="avatar-wrap">
              <div className="avatar-media">
                {/* 🎥 Cuando tengas tu video de avatar, colócalo en /public/avatar-host.mp4
                    y se verá aquí automáticamente */}
                <video
                  className="avatar-video"
                  src="/avatar-host.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="avatar-badge-ring" />
              </div>
              <div className="avatar-bubble">
                <div className="avatar-name">Host digital</div>
                <div className="avatar-role">Asesora virtual de Gabriel Cruz Apps</div>
                <div>
                  Bienvenido a tu demo interactiva ✨. Elige arriba el tipo de negocio,
                  toca <strong>“Probar demo en vivo”</strong> y mira cómo podría verse tu
                  app. Si quieres algo hecho a tu medida, llena el formulario y te
                  contactamos por WhatsApp.
                </div>
              </div>
            </div>

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
                className={"demo-tab-btn " + (activeDemo === "gym" ? "active" : "")}
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
                className={"demo-tab-btn " + (activeDemo === "ecom" ? "active" : "")}
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
                Así verán tus clientes la app: sencilla, clara y sin paneles complicados.
              </div>

              <div className="demo-actions">
                <a
                  className="demo-link main"
                  href={demo.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  🚀 Probar demo en vivo
                </a>
                <span className="demo-hand-hint">
                  <span className="demo-hand-icon">👆</span>
                  Toca este botón para ver la demo funcionando.
                </span>
              </div>
            </div>

            <form className="demo-form" onSubmit={handleSubmit}>
              <div className="demo-form-title">
                ¿Quieres una propuesta pensada en tu negocio?
              </div>
              <div className="demo-form-sub">
                Déjanos tus datos y te contactamos por WhatsApp con una demo guiada
                y opciones de paquete según tus necesidades.
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
                  Cuéntanos brevemente qué te gustaría mejorar{" "}
                  <span style={{ opacity: 0.6 }}>(opcional)</span>
                </label>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  className="demo-form-textarea"
                  placeholder="Ej. recibir pedidos por WhatsApp, organizar entregas, vender más sin depender de plataformas, etc."
                />
              </div>

              <div className="demo-form-hint">
                Al enviar, se abrirá WhatsApp con un mensaje listo para que solo tengas
                que presionar “enviar”.
              </div>

              <button type="submit" className="demo-btn">
                💬 Enviar mis datos por WhatsApp
              </button>

              <div className="demo-form-foot">
                Respondemos normalmente en pocas horas (horario México).  
                Sin spam: solo información útil y opciones para tu negocio.
              </div>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default DemoLanding;

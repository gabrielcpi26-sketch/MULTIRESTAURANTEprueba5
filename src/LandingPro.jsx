import React, { useEffect, useState } from "react";

const LOGO_URL = "/logo.png";
const DEMO_URL = "/nubias-demo.jpg";
const AVATAR_URL = "/avatar.mp4";

const WHATSAPP_NUMBER = "524872586302";
const WHATSAPP_MESSAGE =
  "Hola Diana, quiero activar mi mini-app para mi restaurante y agendar una demo.";
const whatsapp = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

const demoMenuURL = "/?view=cliente&rest=nubia-s-snack";

const CASES = [
  {
    nombre: "Nubia's Snack",
    resultado: "+27% más pedidos organizados",
    detalle:
      "Antes recibían mensajes confusos. Ahora cada pedido llega como ticket listo para cocina.",
  },
  {
    nombre: "Taquería El Camino",
    resultado: "+32% ventas en fines de semana",
    detalle:
      "Implementaron la mini-app y ahora en horas pico no pierden pedidos por WhatsApp.",
  },
  {
    nombre: "Café La Terraza",
    resultado: "0 errores en cocina",
    detalle:
      "Cada bebida y extra llega detallado. El cliente recibe su orden exactamente como la pidió.",
  },
];

const TESTIMONIALS = [
  {
    nombre: "Nubia, dueña de Nubia's Snack",
    texto:
      "Antes los clientes mandaban notas de voz y fotos mezcladas. Ahora cada pedido llega clarito y ya no me confundo al cobrar.",
    resultado: "+27% más pedidos organizados",
  },
  {
    nombre: "Luis, Taquería El Camino",
    texto:
      "En fines de semana siempre perdíamos pedidos. Con la mini-app, la gente arma su orden y solo confirmamos por WhatsApp.",
    resultado: "+32% más ventas en horas pico",
  },
  {
    nombre: "Ana, Café La Terraza",
    texto:
      "Los baristas ahora reciben el ticket con todos los extras. Se acabaron los errores en las bebidas.",
    resultado: "0 errores en cocina",
  },
];

const styles = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }

  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 100px 100px; }
  }

  .parallax-img:hover {
    transform: scale(1.03) rotateX(4deg) rotateY(4deg);
  }

  .float {
    animation: float 3s ease-in-out infinite;
  }

  .hero-layout {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .hero-text {
    text-align: center;
  }

  .hero-avatar {
    max-width: 480px;
    margin: 0 auto;
  }

  @media (min-width: 900px) {
    .hero-layout {
      flex-direction: column;
      align-items: center;
    }
    .hero-text {
      text-align: center;
    }
    .hero-avatar {
      margin: 0 auto;
    }
  }

  .testimonial-track {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 6px;
    scroll-snap-type: x mandatory;
  }

  .testimonial-track::-webkit-scrollbar {
    display: none;
  }

  .testimonial-card {
    min-width: 260px;
    max-width: 320px;
    scroll-snap-align: center;
  }
`;

function getTimeLeftToEndOfDay() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(
    Math.floor((diff / (1000 * 60)) % 60)
  ).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
  return { hours, minutes, seconds };
}

function LandingPro() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeftToEndOfDay);
  const [avatarMuted, setAvatarMuted] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeftToEndOfDay());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#05030b",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Fondo de rejilla animada */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            animation: "gridMove 18s linear infinite",
          }}
        />

        {/* Header sticky minimal */}
        <header
          style={{
            position: "sticky",
            top: 0,
            backdropFilter: "blur(14px)",
            background: "rgba(5,3,12,0.92)",
            zIndex: 50,
            borderBottom: "1px solid #1f2937",
            padding: "12px 20px",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={LOGO_URL}
                alt="logo"
                style={{ width: 40, height: 40, objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div style={{ fontSize: 16, fontWeight: 600 }}>Mini-App PRO</div>
            </div>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "9px 18px",
                borderRadius: 999,
                border: "1px solid #22c55e",
                color: "#22c55e",
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Hablar por WhatsApp
            </a>
          </div>
        </header>

        {/* Franja de beneficios rápidos */}
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
            fontSize: 12,
            padding: "10px 20px 4px",
            opacity: 0.85,
          }}
        >
          ✔ Mini-app lista en 24 horas · ✔ Sin comisiones por pedido · ✔ Soporte
          directo con Diana
        </div>

        {/* HERO estilo referencia con video centrado */}
        <section
          style={{
            maxWidth: 760,
            margin: "26px auto 40px",
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 16px",
                borderRadius: 999,
                background: "#1f2937",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Cupos abiertos · Solo 7 restaurantes por ciudad
            </div>
          </div>

          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 14,
            }}
          >
            🔥 Tu restaurante puede vender MÁS hoy mismo con una mini‑app que convierte curiosos en pedidos reales.
          </h1>

          <p
            style={{
              color: "#d1d5db",
              fontSize: 16,
              maxWidth: 640,
              margin: "0 auto 22px",
            }}
          >
            Restaurantes como el tuyo están dejando de perder pedidos en horas
            pico y organizando todos sus mensajes con una mini-app sencilla que
            tus clientes usan desde WhatsApp.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "14px 26px",
                background: "#22c55e",
                color: "black",
                fontSize: 16,
                borderRadius: 999,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              🚀 Activar mi mini-app hoy
            </a>

            <a
              href={demoMenuURL}
              style={{
                padding: "14px 26px",
                borderRadius: 999,
                border: "1px solid #4b5563",
                fontSize: 15,
                textDecoration: "none",
                color: "white",
              }}
            >
              Ver demo real
            </a>
          </div>

          <div className="hero-avatar">
            <p
              style={{
                color: "#9ca3af",
                fontSize: 13,
                marginBottom: 8,
                textAlign: "left",
              }}
            >
              Tu anfitriona digital — Toca el video para activar el audio y en
              menos de 30 segundos te explico cómo tu mini-app puede aumentar tus
              ventas desde hoy.
            </p>
            <video
              src={AVATAR_URL}
              autoPlay
              muted={avatarMuted}
              playsInline
              loop
              controls={false}
              controlsList="nofullscreen nodownload noplaybackrate"
              disablePictureInPicture
              onClick={(e) => {
                const newMuted = !avatarMuted;
                setAvatarMuted(newMuted);
                e.currentTarget.muted = newMuted;
                if (!newMuted) {
                  const playPromise = e.currentTarget.play();
                  if (playPromise?.catch) {
                    playPromise.catch(() => {});
                  }
                }
              }}
              style={{
                width: "100%",
                height: "80%",
                objectFit: "cover",
                borderRadius: 20,
                marginTop: 4,
                cursor: "pointer",
                boxShadow:
                  "0 0 45px rgba(34,197,94,0.65), 0 18px 40px rgba(0,0,0,0.7)",
              }}
            />
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: "#9ca3af",
                textAlign: "left",
              }}
            >
              {avatarMuted
                ? "🔊 Toca el video para escuchar el audio."
                : "✅ Audio activado."}
            </div>
          </div>
        </section>

        {/* Mockup flotando */}
        <section
          style={{ textAlign: "center", zIndex: 2, position: "relative" }}
        >
          <div
            className="float parallax-img"
            style={{
              width: 270,
              margin: "auto",
              padding: 14,
              borderRadius: 30,
              background: "#111827",
              border: "1px solid #374151",
              transition: "0.4s",
            }}
          >
            <img
              src={DEMO_URL}
              alt="demo mini-app"
              style={{ width: "100%", borderRadius: 22 }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </section>

        {/* Barra de confianza: restaurantes que confían */}
        <section
          style={{
            maxWidth: 1100,
            position: "relative",
            zIndex: 2,
            margin: "40px auto 10px",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
            Restaurantes que ya confían en Mini-App PRO
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 22,
              opacity: 0.9,
            }}
          >
            {["Nubia's Snack", "Taquería El Camino", "Café La Terraza", "Don Beto Burgers"].map(
              (name) => (
                <div
                  key={name}
                  style={{
                    background: "#111827",
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    fontSize: 13,
                  }}
                >
                  {name}
                </div>
              )
            )}
          </div>
        </section>

        <div
          style={{
            maxWidth: 900,
            margin: "20px auto 10px",
            padding: "10px 20px",
            textAlign: "center",
            fontSize: 14,
            color: "#d1d5db",
            background: "#111827",
            borderRadius: 14,
            border: "1px solid #1f2937",
            opacity: 0.95,
          }}
        >
          ⭐ Más de <strong>58 negocios</strong> ya usan Mini-App PRO para vender más.
        </div>

        {/* Sección de confianza de pago seguro */}
        <section
          style={{
            maxWidth: 1100,
            margin: "32px auto 40px",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}>
            ¿Es seguro activar tu mini-app?
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 700,
              margin: "0 auto",
              background: "#111827",
              borderRadius: 18,
              border: "1px solid #1f2937",
              padding: 20,
              fontSize: 14,
              color: "#e5e7eb",
            }}
          >
            <div>
              ✔ Pagas <strong>solo cuando tengas tu mini-app funcionando.</strong>
            </div>
            <div>
              ✔ Entrega garantizada en <strong>menos de 24 horas.</strong>
            </div>
            <div>
              ✔ Comunicación y soporte <strong>directo conmigo por WhatsApp.</strong>
            </div>
          </div>
        </section>

        {/* Para quién es / para quién no es */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 18 }}>
            ¿Para quién es Mini-App PRO?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
                fontSize: 14,
                color: "#e5e7eb",
              }}
            >
              <p>
                ✅ Para restaurantes, taquerías, snacks, cafeterías y dark
                kitchens que ya reciben pedidos por WhatsApp.
              </p>
              <p>
                ✅ Para dueños que quieren dejar de perder pedidos en horas pico y
                tener cada orden clara para cocina.
              </p>
              <p>
                ✅ Para negocios que quieren verse más profesionales sin pagar una
                app carísima ni comisiones por pedido.
              </p>
              <p>
                ✅ Para quienes quieren empezar a vender más esta misma semana con
                algo simple de usar.
              </p>
            </div>

            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
                fontSize: 14,
                color: "#e5e7eb",
              }}
            >
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>¿Para quién NO es?</h3>
              <p>❌ No es para quien no quiere atender pedidos por WhatsApp.</p>
              <p>
                ❌ No es para negocios que no están dispuestos a mandar fotos y
                precios de su menú.
              </p>
              <p>
                ❌ No es para quien quiere "probar" pero nunca toma acción.
              </p>
            </div>
          </div>
        </section>

        {/* Lo que recibes */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>
            Todo lo que recibes al activar Mini-App PRO
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              color: "#e5e7eb",
              fontSize: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <li>📲 Mini-app personalizada con tu logo, colores y menú completo.</li>
            <li>🧾 Ticket automático para cocina con producto, nota y extras.</li>
            <li>📊 Panel básico de ventas (día, semana, mes).</li>
            <li>🧾 QR del menú listo para imprimir y pegar en tu negocio.</li>
            <li>🧠 Asesoría de menú para aumentar ticket promedio.</li>
            <li>🧩 Plantilla de mensaje para WhatsApp para anunciar tu mini-app.</li>
          </ul>
        </section>

        {/* Cómo funciona paso a paso */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16 }}>
            ¿Cómo funciona paso a paso?
          </h2>
          <ol
            style={{
              margin: 0,
              paddingLeft: 20,
              color: "#e5e7eb",
              fontSize: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <li>1. Me mandas tu logo y tu menú por WhatsApp.</li>
            <li>2. En menos de 24 horas preparo tu mini-app lista para pedidos.</li>
            <li>
              3. Te envío tu link y tu QR para que los uses en tu local, mesas y
              redes.
            </li>
            <li>4. Tus clientes escanean, piden y tú solo confirmas y cobras.</li>
            <li>5. Recibes soporte directo conmigo para ajustes o nuevos platillos.</li>
          </ol>
        </section>

        {/* Casos reales */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>
            Casos reales de negocios como el tuyo
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {CASES.map((c, i) => (
              <div
                key={i}
                style={{
                  padding: 18,
                  borderRadius: 16,
                  background: "#111827",
                  border: "1px solid #1f2937",
                  animation: "fadeUp 1s ease forwards",
                  opacity: 0,
                }}
              >
                <div style={{ fontSize: 13, color: "#9ca3af" }}>{c.nombre}</div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    margin: "4px 0 6px",
                  }}
                >
                  {c.resultado}
                </div>
                <p style={{ color: "#aaa", fontSize: 13 }}>{c.detalle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Carrusel de testimonios */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 14 }}>
            Lo que dicen dueños como tú
          </h2>
          <p
            style={{ color: "#9ca3af", fontSize: 14, marginBottom: 14 }}
          >
            Desliza para ver más testimonios.
          </p>
          <div className="testimonial-track">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="testimonial-card"
                style={{
                  background: "#111827",
                  borderRadius: 18,
                  border: "1px solid #1f2937",
                  padding: 18,
                  fontSize: 14,
                  color: "#e5e7eb",
                }}
              >
                <p style={{ marginBottom: 10 }}>“{t.texto}”</p>
                <div
                  style={{
                    fontSize: 13,
                    color: "#9ca3af",
                    marginBottom: 4,
                  }}
                >
                  {t.nombre}
                </div>
                <div style={{ fontSize: 13, color: "#22c55e" }}>{t.resultado}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de precio con contador */}
        <section
          style={{
            maxWidth: 1100,
            position: "relative",
            zIndex: 2,
            margin: "0 auto 40px",
            padding: 26,
            background: "linear-gradient(135deg,#022c22,#020617,#022c22)",
            borderRadius: 22,
            border: "1px solid #22c55e55",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 10,
              fontSize: 12,
              color: "#bbf7d0",
            }}
          >
            <div>Lanzamiento especial · Solo 7 restaurantes por ciudad</div>
            <div>
              ⏰ Último día de promoción · Termina en {timeLeft.hours}:
              {timeLeft.minutes}:{timeLeft.seconds}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              margin: "10px 0 18px",
            }}
          >
            <div
              style={{
                background: "#033",
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid #044",
                fontSize: 12,
                color: "#22c55e",
              }}
            >
              🛡 Garantía 24h
            </div>
            <div
              style={{
                background: "#033",
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid #044",
                fontSize: 12,
                color: "#22c55e",
              }}
            >
              💸 Pago después de entrega
            </div>
            <div
              style={{
                background: "#033",
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid #044",
                fontSize: 12,
                color: "#22c55e",
              }}
            >
              📞 Soporte directo
            </div>
          </div>

          <h2 style={{ margin: 0, marginBottom: 6 }}>Plan Restaurante Local</h2>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "#ef4444",
                textDecoration: "line-through",
                opacity: 0.8,
              }}
            >
              $499
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 800 }}>$299</span>
            <span style={{ fontSize: 14, color: "#bbf7d0" }}>MXN / mes</span>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#bbf7d0",
              marginBottom: 10,
            }}
          >
            🔒 Precio congelado de por vida si contratas hoy.
          </div>

          <p style={{ fontSize: 13, color: "#e5e7eb", marginBottom: 12 }}>
            Sin comisiones por pedido. Sin contrato forzoso. Tu mini-app lista en
            menos de 24 horas.
          </p>

          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 13,
              color: "#e5e7eb",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 14,
            }}
          >
            <li>Menú digital ilimitado con fotos y descripciones.</li>
            <li>Pedidos automáticos por WhatsApp con ticket listo para cocina.</li>
            <li>Reportes básicos de ventas (día, semana y mes).</li>
            <li>QR del menú y opción de QR por mesa.</li>
            <li>Soporte directo con Diana para ajustes y mejoras.</li>
          </ul>

          <div
            style={{
              fontSize: 12,
              color: "#bbf7d0",
              marginBottom: 14,
            }}
          >
            🎁 <strong>Bonos de lanzamiento:</strong> instalación guiada, asesoría de
            menú para aumentar ticket promedio y plantilla de mensaje para tus
            clientes.
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: "#22c55e",
              color: "#022c22",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Reservar uno de los 7 lugares
          </a>
        </section>

        {/* Bonos explicados */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            Bonos exclusivos de lanzamiento
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
                color: "#e5e7eb",
                fontSize: 14,
              }}
            >
              <strong>Bono 1 – Instalación guiada</strong>
              <p style={{ marginTop: 6 }}>
                Te acompaño paso a paso por videollamada para que dejes tu
                mini-app funcionando en tu celular.
              </p>
            </div>
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1f2937",
                borderStyle: "solid",
                padding: 18,
                color: "#e5e7eb",
                fontSize: 14,
              }}
            >
              <strong>Bono 2 – Plantillas de mensajes</strong>
              <p style={{ marginTop: 6 }}>
                Textos listos para avisar a tus clientes que ahora tienes
                mini-app y que empiecen a pedir por WhatsApp.
              </p>
            </div>
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
                color: "#e5e7eb",
                fontSize: 14,
              }}
            >
              <strong>Bono 3 – Revisión de menú</strong>
              <p style={{ marginTop: 6 }}>
                Te doy recomendaciones para ordenar tu menú y crear combos que
                aumenten tu ticket promedio.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de autoridad */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            ¿Quién está detrás de Mini-App PRO?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
              gap: 20,
            }}
          >
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
                color: "#e5e7eb",
                fontSize: 14,
              }}
            >
              <p>
                Soy Diana Montoya y llevo años trabajando con negocios de comida
                que venden por WhatsApp: snacks, taquerías, cafeterías y
                restaurantes locales.
              </p>
              <p>
                Después de ver cómo muchos dueños perdían pedidos por mensajes
                confusos, notas de voz y papelitos, creé Mini-App PRO para que
                cualquier restaurante pueda tener su propia "app" de pedidos sin
                pagar miles de pesos ni comisiones por pedido.
              </p>
              <p>
                Mi objetivo es que tengas un sistema simple, claro y rentable que
                te ayude a vender más sin complicarte la vida.
              </p>
            </div>
            <div
              style={{
                background: "#020617",
                borderRadius: 18,
                border: "1px dashed #1f2937",
                padding: 18,
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              <p style={{ marginBottom: 10 }}>
                "No necesitas ser experto en tecnología para tener tu propio
                sistema de pedidos. Sólo necesitas tomar la decisión de dejar de
                perder ventas y empezar a ordenar tus pedidos." – Diana
              </p>
              <p>
                Si tu restaurante ya vende rico, Mini-App PRO te ayuda a vender
                mejor: más organizado, más rápido y con menos errores.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 20px" }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            Preguntas frecuentes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
              fontSize: 14,
              color: "#e5e7eb",
            }}
          >
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
              }}
            >
              <strong>¿Tengo que firmar contrato forzoso?</strong>
              <p style={{ marginTop: 6 }}>
                No. Pagas mes a mes y puedes cancelar cuando quieras.
              </p>
            </div>
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
              }}
            >
              <strong>¿Qué pasa si no me entregas la mini-app?</strong>
              <p style={{ marginTop: 6 }}>
                No pagas nada. Sólo pagas cuando tu mini-app está funcionando y
                lista para usar.
              </p>
            </div>
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
              }}
            >
              <strong>¿Necesito computadora?</strong>
              <p style={{ marginTop: 6 }}>
                No, todo se maneja desde tu celular con WhatsApp.
              </p>
            </div>
            <div
              style={{
                background: "#111827",
                borderRadius: 18,
                border: "1px solid #1f2937",
                padding: 18,
              }}
            >
              <strong>¿Puedo cambiar precios o platillos después?</strong>
              <p style={{ marginTop: 6 }}>
                Sí, puedes pedirme ajustes y te ayudo a actualizarlos.
              </p>
            </div>
          </div>
        </section>

        {/* Cierre emocional + CTA */}
        <section
          style={{
            maxWidth: 1100,
            position: "relative",
            zIndex: 2,
            margin: "0 auto 40px",
            padding: 26,
            background: "#020617",
            borderRadius: 20,
            border: "1px solid #1f2937",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>
            Tu restaurante ya vende rico.
          </h2>
          <p
            style={{
              color: "#9ca3af",
              maxWidth: 580,
              margin: "0 auto 18px",
              fontSize: 15,
            }}
          >
            Ahora es momento de vender mejor: sin perder pedidos, sin mensajes
            confusos y con un sistema que trabaja por ti todos los días.
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "14px 26px",
              background: "#22c55e",
              color: "black",
              borderRadius: 999,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              display: "inline-block",
              marginTop: 8,
            }}
          >
            Quiero activar mi mini-app ahora
          </a>
        </section>

        {/* CTA final */}
        <section
          style={{
            maxWidth: 1100,
            position: "relative",
            zIndex: 2,
            margin: "0 auto 60px",
            padding: 26,
            background: "#111827",
            borderRadius: 20,
            border: "1px solid #1f2937",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 24 }}>¿Lista para vender más HOY?</h2>
          <p
            style={{ color: "#9ca3af", maxWidth: 500, margin: "12px auto" }}
          >
            Mándame tu logo y tu menú y te preparo una demo personalizada que
            puedes mandar por WhatsApp a tus clientes.
          </p>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "14px 26px",
              background: "#22c55e",
              color: "black",
              borderRadius: 999,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              display: "inline-block",
              marginTop: 8,
            }}
          >
            Enviar mi menú por WhatsApp
          </a>
        </section>
      </div>
    </>
  );
}

export default LandingPro;

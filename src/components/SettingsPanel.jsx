// =============================================
// SettingsPanel.jsx (Modularizado, MISMO DISEÑO)
// =============================================
// Mantiene EXACTAMENTE tu diseño y comportamiento original.
// Solo está organizado, corregido y sin errores.
// =============================================

import React, { useState, useEffect } from "react";
import Container from "./ui/Container";
import Card from "./ui/Card";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";
import Button from "./ui/Button";

function SettingsPanel({ r, store }) {
  const { updateRestaurant } = store;

  // --------------------------
  // ESTADO LOCAL
  // --------------------------
  const [local, setLocal] = useState({
    nombre: r?.nombre || "",
    direccion: r?.direccion || "",
    whatsapp: r?.whatsapp || "",
    paymentLink: r?.paymentLink || "",
    logo: r?.logo || "",
    themePrimary: r?.theme?.primary || "#16a34a",
    themeSecondary: r?.theme?.secondary || "#065f46",
  });

  const [testimonios, setTestimonios] = useState(r?.testimonios || []);
  const [testNombre, setTestNombre] = useState("");
  const [testTexto, setTestTexto] = useState("");

  // --------------------------
  // SINCRONIZAR CUANDO CAMBIA r
  // --------------------------
  useEffect(() => {
    if (!r) return;

    setLocal({
      nombre: r?.nombre || "",
      direccion: r?.direccion || "",
      whatsapp: r?.whatsapp || "",
      paymentLink: r?.paymentLink || "",
      logo: r?.logo || "",
      themePrimary: r?.theme?.primary || "#16a34a",
      themeSecondary: r?.theme?.secondary || "#065f46",
    });

    setTestimonios(r?.testimonios || []);
  }, [r]);

  // --------------------------
  // GUARDAR DATOS
  // --------------------------
  const handleGuardar = () => {
    updateRestaurant(r.id, {
      nombre: local.nombre,
      direccion: local.direccion,
      whatsapp: local.whatsapp,
      paymentLink: local.paymentLink,
      logo: local.logo,
      theme: {
        primary: local.themePrimary,
        secondary: local.themeSecondary,
      },
      testimonios,
    });

    alert("Configuración guardada correctamente.");
  };

  // --------------------------
  // AGREGAR TESTIMONIO
  // --------------------------
  const handleAgregarTestimonio = () => {
    if (!testNombre.trim() || !testTexto.trim()) return;

    const nuevo = {
      id: "test-" + Date.now(),
      nombre: testNombre,
      texto: testTexto,
    };

    setTestimonios([...testimonios, nuevo]);
    setTestNombre("");
    setTestTexto("");
  };

  // --------------------------
  // ELIMINAR TESTIMONIO
  // --------------------------
  const handleEliminarTestimonio = (id) => {
    setTestimonios(testimonios.filter((t) => t.id !== id));
  };

  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>Selecciona un restaurante para configurar.</p>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <h3 style={{ marginTop: 0 }}>Configuración del restaurante</h3>

        {/* NOMBRE */}
        <label style={{ fontSize: 13 }}>Nombre del restaurante</label>
        <Input
          value={local.nombre}
          onChange={(e) => setLocal({ ...local, nombre: e.target.value })}
          placeholder="Ej: Restaurante La Esquina"
          style={{ marginBottom: 10 }}
        />

        {/* DIRECCIÓN */}
        <label style={{ fontSize: 13 }}>Dirección</label>
        <Input
          value={local.direccion}
          onChange={(e) => setLocal({ ...local, direccion: e.target.value })}
          placeholder="Ej: Calle Sabor #123, Ciudad"
          style={{ marginBottom: 10 }}
        />

        {/* WHATSAPP */}
        <label style={{ fontSize: 13 }}>WhatsApp</label>
        <Input
          value={local.whatsapp}
          onChange={(e) => setLocal({ ...local, whatsapp: e.target.value })}
          placeholder="Ej: 521234567890"
          style={{ marginBottom: 10 }}
        />

        {/* LINK PAGO */}
        <label style={{ fontSize: 13 }}>Link de pago</label>
        <Input
          value={local.paymentLink}
          onChange={(e) => setLocal({ ...local, paymentLink: e.target.value })}
          placeholder="Ej: link a tu pasarela de pago"
          style={{ marginBottom: 10 }}
        />

        {/* LOGO */}
        <label style={{ fontSize: 13 }}>Logo (URL)</label>
        <Input
          value={local.logo}
          onChange={(e) => setLocal({ ...local, logo: e.target.value })}
          placeholder="URL del logo"
          style={{ marginBottom: 10 }}
        />

        {/* COLORES */}
        <label style={{ fontSize: 13 }}>Color primario</label>
        <Input
          type="color"
          value={local.themePrimary}
          onChange={(e) => setLocal({ ...local, themePrimary: e.target.value })}
          style={{ marginBottom: 10 }}
        />

        <label style={{ fontSize: 13 }}>Color secundario</label>
        <Input
          type="color"
          value={local.themeSecondary}
          onChange={(e) =>
            setLocal({ ...local, themeSecondary: e.target.value })
          }
          style={{ marginBottom: 10 }}
        />

        {/* TESTIMONIOS */}
        <h4 style={{ marginTop: 20 }}>Testimonios</h4>

        <Input
          value={testNombre}
          onChange={(e) => setTestNombre(e.target.value)}
          placeholder="Nombre del cliente"
          style={{ marginBottom: 6 }}
        />

        <TextArea
          value={testTexto}
          onChange={(e) => setTestTexto(e.target.value)}
          placeholder="Comentario del cliente"
          style={{ marginBottom: 6 }}
        />

        <Button style={{ marginBottom: 10 }} onClick={handleAgregarTestimonio}>
          Agregar testimonio
        </Button>

        {testimonios.map((t) => (
          <Card key={t.id} style={{ marginBottom: 8 }}>
            <strong>{t.nombre}</strong>
            <p style={{ margin: 0, fontSize: 12 }}>{t.texto}</p>
            <Button
              style={{ background: "#dc2626", marginTop: 6 }}
              onClick={() => handleEliminarTestimonio(t.id)}
            >
              Eliminar
            </Button>
          </Card>
        ))}

        <Button
          style={{ background: "#34d399", width: "100%", marginTop: 14 }}
          onClick={handleGuardar}
        >
          Guardar cambios
        </Button>
      </Card>
    </Container>
  );
}

export default SettingsPanel;
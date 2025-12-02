// ===============================
// App.jsx — Plataforma Multi-Restaurante
// ===============================

import DemoLanding from "./DemoLanding";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
// Crea un id de restaurante a partir del nombre, por ejemplo "NUBIA´S SNACK" -> "nubias-snack"
function slugifyRestaurantId(nombre) {
  if (!nombre) {
    return "rest-" + Date.now().toString(36);
  }

  return nombre
    .toLowerCase()
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-") // todo lo que no sea letra o número -> guion
    .replace(/(^-|-$)+/g, "");   // quita guiones al inicio/fin
}



// ===============================
// COLORES Y ANIMACIONES GLOBALES
// ===============================

const EMERALD = "#16a34a";
const EMERALD_DARK = "#0f5132";
const STORAGE_RESTAURANTES = "multi_rest_restaurantes_v1";

if (
  typeof document !== "undefined" &&
  !document.getElementById("multi-rest-global-styles")
) {
  const globalStyles = document.createElement("style");
  globalStyles.id = "multi-rest-global-styles";
  globalStyles.innerHTML = `
html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #020617;
  color: #0f172a;
}
* {
  box-sizing: border-box;
}
button {
  font-family: inherit;
}
input, select, textarea {
  font-family: inherit;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes floatSoft {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes softPop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
`;
  document.head.appendChild(globalStyles);
}

// ===============================
// ESTILOS BÁSICOS REUTILIZABLES
// ===============================

const layoutStyles = {
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 16px 36px",
  },
  card: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 12px 25px rgba(15,23,42,0.15)",
    border: "1px solid rgba(148,163,184,0.25)",
  },
};

const Input = (props) => (
  <input
    {...props}
    style={{
      width: "100%",
      borderRadius: 999,
      border: "1px solid #e5e7eb",
      padding: "7px 11px",
      fontSize: 13,
      outline: "none",
      ...props.style,
    }}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    style={{
      width: "100%",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: "8px 11px",
      fontSize: 13,
      resize: "vertical",
      minHeight: 60,
      outline: "none",
      ...props.style,
    }}
  />
);

const Container = (props) => (
  <div
    {...props}
    style={{
      ...layoutStyles.container,
      ...(props.style || {}),
    }}
  />
);

const Grid = ({ columns = 2, children, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
      gap: 10,
      ...style,
    }}
  >
    {children}
  </div>
);

const Chip = ({ active, children, style, ...props }) => (
  <button
    {...props}
    style={{
      borderRadius: 999,
      border: "1px solid",
      borderColor: active ? EMERALD : "#e5e7eb",
      background: active ? "rgba(16,185,129,0.08)" : "#ffffff",
      color: active ? "#065f46" : "#374151",
      fontSize: 11,
      padding: "4px 9px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      ...style,
    }}
  >
    {children}
  </button>
);

const Badge = ({ children, tone = "default" }) => {
  const colors = {
    default: { bg: "#e5e7eb", fg: "#111827" },
    success: { bg: "#dcfce7", fg: "#166534" },
    warning: { bg: "#fef3c7", fg: "#92400e" },
    danger: { bg: "#fee2e2", fg: "#b91c1c" },
    info: { bg: "#eff6ff", fg: "#1d4ed8" },
  };
  const c = colors[tone] || colors.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        background: c.bg,
        color: c.fg,
      }}
    >
      {children}
    </span>
  );
};

// Botones básicos
const BTN_BASE = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 999,
  border: "1px solid transparent",
  fontSize: 12,
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const BTN = {
  ...BTN_BASE,
};

const BTN_OUTLINE = {
  ...BTN_BASE,
  background: "#ffffff",
  borderColor: "#e5e7eb",
  color: "#111827",
};

const BTN_DANGER = {
  ...BTN_BASE,
  background: "#fee2e2",
  borderColor: "#fecaca",
  color: "#b91c1c",
};

// Helper para formatear moneda
const currency = (value) => {
  if (!value) return "$0.00";
  return `$${value.toFixed(2)}`;
};

// Convierte el texto de extras en objetos { nombre, costo }
function parseExtrasInput(text) {
  if (!text) return [];

  return text
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, idx) => {
      // Formato esperado: "Tocino/15"
      const [nombreRaw, precioRaw] = chunk.split("/").map((p) => p.trim());

      const nombre = nombreRaw || `Extra ${idx + 1}`;
      const costo = precioRaw
        ? Number(precioRaw.replace(/[^\d.]/g, "")) || 0
        : 0;

      return {
        id: `extra-${Date.now()}-${idx}`,
        nombre,
        costo,
      };
    });
}


// Iconos por categoría
const DEFAULT_ICONS = {
  Comidas: "🍽️",
  Bebidas: "🥤",
  Desayunos: "🥞",
  Postres: "🍰",
  Snacks: "🍟",
  Especiales: "⭐",
};

// ===============================
// UTILIDADES
// ===============================

const fileToDataUrl = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    cb(e.target.result);
  };
  reader.readAsDataURL(file);
};

// ===============================
// STORE PRINCIPAL
// ===============================

function useStore() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [activeRest, setActiveRest] = useState(null);
  const [tab, setTab] = useState("menu");
  const [loading, setLoading] = useState(true);

// ==============
// CARGA INICIAL
// ==============
useEffect(() => {
  const load = async () => {
    try {
      // 1) Intentar leer desde Supabase
      const { data: restRows, error: restError } = await supabase
        .from("restaurants")
        .select("*");

      if (restError) {
        console.error(
          "Error cargando restaurantes desde Supabase:",
          restError
        );
        throw restError;
      }

      let result = [];

      if (restRows && restRows.length > 0) {
        const restIds = restRows.map((r) => r.id);

        // 2) Leer los platillos de menu_items
        let menuByRest = {};
        try {
          const { data: menuRows, error: menuError } = await supabase
            .from("menu_items")
            .select("*")
            .in("restaurant_id", restIds);

          if (menuError) {
            console.error("Error cargando menú desde Supabase:", menuError);
          } else {
            (menuRows || []).forEach((m) => {
              const rId = m.restaurant_id;
              if (!menuByRest[rId]) menuByRest[rId] = [];
              menuByRest[rId].push({
                id: m.id,
                nombre: m.nombre || "",
                categoria: m.categoria || "Comidas",
                precio: Number(m.precio) || 0,
                costo: Number(m.costo) || 0,
                stock: m.stock ?? 0,
                foto: m.foto || "",
                ingredientesBase: m.ingredientes_base || [],
                extras: m.extras || [],
                activo: m.activo !== false,
              });
            });
          }
        } catch (e) {
          console.error("Error general cargando menú:", e);
        }

        // 3) Mapear filas de restaurants al formato que usa la app
        result = restRows.map((row) => ({
          id: row.id,
          nombre: row.nombre || "Sin nombre",
          direccion: row.direccion || "",
          whatsapp: row.whatsapp || "",
          paymentLink: row.payment_link || "",
          zonas: {
            lat: row.zona_lat || 0,
            lon: row.zona_lon || 0,
            feePerKm: row.zona_fee_per_km || 0,
          },
          menu: menuByRest[row.id] || [],
          categoryIcons: row.category_icons || DEFAULT_ICONS,
          ventas: [],
          logo: row.logo || "",
          theme: {
            primary: row.theme_primary || EMERALD,
            secondary: row.theme_secondary || EMERALD_DARK,
          },
          testimonios: row.testimonios || [],
          transferenciaBanco: row.transferencia_banco || "",
          transferenciaCuenta: row.transferencia_cuenta || "",
          transferenciaClabe: row.transferencia_clabe || "",
          transferenciaTitular: row.transferencia_titular || "",
          mensajeBienvenida: row.mensaje_bienvenida || "",
        }));
      }

      
      // 3.1) Cargar ventas desde Supabase y vincularlas a cada restaurante
      try {
        const { data: salesRows, error: salesError } = await supabase
          .from("ventas")
          .select("*");

        if (salesError) {
          console.warn("Error cargando ventas desde Supabase:", salesError);
        } else if (Array.isArray(salesRows)) {
          const ventasPorRest = {};

          salesRows.forEach((row) => {
            const rid = row.restaurant_id;
            if (!rid) return;
            if (!ventasPorRest[rid]) ventasPorRest[rid] = [];

            ventasPorRest[rid].push({
              id: row.id,
              fecha: row.fecha || row.created_at,
              items: row.items || [],
              metodoPago: row.metodo_pago || "desconocido",
              total: Number(row.total) || 0,
              estadoPago: row.estado_pago || "pendiente",
            });
          });

          result = result.map((rest) => ({
            ...rest,
            ventas: ventasPorRest[rest.id] || rest.ventas || [],
          }));
        }
      } catch (ventasErr) {
        console.warn("Error inesperado cargando ventas Supabase:", ventasErr);
      }


// 4) Si Supabase estaba vacío, usamos demo
      if (!result || result.length === 0) {
        const demoId = "demo-rest";
        result = [
          {
            id: demoId,
            nombre: "Mi restaurante demo",
            direccion: "Calle Sabor #123, Ciudad",
            whatsapp: "",
            paymentLink: "",
            zonas: { lat: 0, lon: 0, feePerKm: 0 },
            menu: [],
            categoryIcons: DEFAULT_ICONS,
            ventas: [],
            logo: "",
            theme: { primary: EMERALD, secondary: EMERALD_DARK },
            testimonios: [],
            transferenciaBanco: "",
            transferenciaCuenta: "",
            transferenciaClabe: "",
            transferenciaTitular: "",
            mensajeBienvenida: "",
          },
        ];
      }

      // 🔁 Recuperar ventas previas desde localStorage (si existen)
      if (typeof window !== "undefined") {
        try {
          const savedStr = window.localStorage.getItem(STORAGE_RESTAURANTES);
          if (savedStr) {
            const savedArr = JSON.parse(savedStr);
            if (Array.isArray(savedArr)) {
              result = result.map((rest) => {
                               const previo = savedArr.find((x) => x.id === rest.id);
                if (
                  previo &&
                  Array.isArray(previo.ventas) &&
                  previo.ventas.length > 0 &&
                  (!rest.ventas || rest.ventas.length === 0)
                ) {
                  return { ...rest, ventas: previo.ventas };
                }

                return rest;
              });
            }
          }
        } catch (mergeErr) {
          console.warn("No se pudieron recuperar ventas previas:", mergeErr);
        }
      }
    


  // 5) Guardar en estado (y localStorage)
      setRestaurantes(result);
      setActiveRest(result[0]?.id || null);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_RESTAURANTES,
          JSON.stringify(result)
        );
      }
    } catch (e) {
      console.warn("Fallo Supabase, usando localStorage / demo:", e);

      // Intentar leer respaldo de localStorage
      try {
        if (typeof window !== "undefined") {
          const saved = window.localStorage.getItem(STORAGE_RESTAURANTES);
          if (saved) {
            const parsed = JSON.parse(saved);
            setRestaurantes(parsed);
            setActiveRest(parsed[0]?.id || null);
            return;
          }
        }
      } catch (err) {
        console.warn("Error leyendo STORAGE_RESTAURANTES:", err);
      }

      // Si tampoco hay localStorage, usamos demo directo
      const demoId = "demo-rest";
      const demo = [
        {
          id: demoId,
          nombre: "Mi restaurante demo",
          direccion: "Calle Sabor #123, Ciudad",
          whatsapp: "",
          paymentLink: "",
          zonas: { lat: 0, lon: 0, feePerKm: 0 },
          menu: [],
          categoryIcons: DEFAULT_ICONS,
          ventas: [],
          logo: "",
          theme: { primary: EMERALD, secondary: EMERALD_DARK },
          testimonios: [],
          transferenciaBanco: "",
          transferenciaCuenta: "",
          transferenciaClabe: "",
          transferenciaTitular: "",
          mensajeBienvenida: "",
        },
      ];
      setRestaurantes(demo);
      setActiveRest(demoId);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  // Guardar respaldo en localStorage ante cualquier cambio
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_RESTAURANTES,
        JSON.stringify(restaurantes)
      );
    } catch (e) {
      console.warn("No se pudo guardar restaurantes:", e);
    }
  }, [restaurantes]);

  // ======================
  // ACCIONES SOBRE RESTAURANTES
  // ======================

  const addRestaurant = async () => {
    const nombre = window.prompt(
      "Nombre del nuevo restaurante:",
      "Nuevo restaurante"
    );
    if (!nombre) return;

    const id = slugifyRestaurantId(nombre);

    const nuevo = {
      id,
      nombre,
      direccion: "",
      whatsapp: "",
      paymentLink: "",
      zonas: { lat: 0, lon: 0, feePerKm: 0 },
      menu: [],
      categoryIcons: DEFAULT_ICONS,
      ventas: [],
      logo: "",
      theme: { primary: EMERALD, secondary: EMERALD_DARK },
      testimonios: [],
      transferenciaBanco: "",
      transferenciaCuenta: "",
      transferenciaClabe: "",
      transferenciaTitular: "",
      mensajeBienvenida: "",
    };

    setRestaurantes((prev) => [...prev, nuevo]);
    setActiveRest(id);

    try {
      const { error } = await supabase.from("restaurants").insert({
        id,
        nombre,
        logo: nuevo.logo || null,
      });
      if (error) {
        console.error("Error insertando restaurante en Supabase:", error);
      }
    } catch (e) {
      console.error("Error insertando restaurante en Supabase:", e);
    }
  };

  // ACTUALIZAR RESTAURANTE
  const updateRestaurant = async (id, patch) => {
    // 1) Actualizar en estado local
    setRestaurantes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );

    // 2) Preparar solo campos válidos para Supabase
    const rowPatch = {
      nombre: patch.nombre,
      direccion: patch.direccion,
      whatsapp: patch.whatsapp,
      payment_link: patch.paymentLink,
      transferencia_banco: patch.transferenciaBanco,
      transferencia_cuenta: patch.transferenciaCuenta,
      transferencia_clabe: patch.transferenciaClabe,
      transferencia_titular: patch.transferenciaTitular,
      logo: patch.logo,
      theme_primary: patch.theme?.primary,
      theme_secondary: patch.theme?.secondary,
      testimonios: patch.testimonios,
    };

    Object.keys(rowPatch).forEach(
      (k) => rowPatch[k] === undefined && delete rowPatch[k]
    );

    try {
      if (Object.keys(rowPatch).length > 0) {
        await supabase.from("restaurants").update(rowPatch).eq("id", id);
      }
    } catch (e) {
      console.error("Error actualizando restaurante en Supabase:", e);
    }
  };

  // ======================
  // MENÚ (platillos)
  // ======================

  const addMenuItem = async (restId, item) => {
    const id = crypto.randomUUID();
    const newItem = {
      ...item,
      id,
      activo: true,
    };

    setRestaurantes((prev) =>
      prev.map((rr) =>
        rr.id === restId ? { ...rr, menu: [...rr.menu, newItem] } : rr
      )
    );

    try {
      await supabase.from("menu_items").insert({
        id,
        restaurant_id: restId,
        nombre: item.nombre,
        categoria: item.categoria,
        precio: item.precio,
        foto: item.foto,
        ingredientes_base: item.ingredientesBase,
        extras: item.extras,
        activo: true,
      });
    } catch (e) {
      console.error("Error insertando menú en Supabase:", e);
    }
  };

  const updateMenuItem = async (restId, itemId, patch) => {
    setRestaurantes((prev) =>
      prev.map((rr) =>
        rr.id === restId
          ? {
              ...rr,
              menu: rr.menu.map((m) =>
                m.id === itemId ? { ...m, ...patch } : m
              ),
            }
          : rr
      )
    );

    const rowPatch = {
      nombre: patch.nombre,
      categoria: patch.categoria,
      precio: patch.precio,
      foto: patch.foto,
      ingredientes_base: patch.ingredientesBase,
      extras: patch.extras,
      activo: patch.activo,
    };
    Object.keys(rowPatch).forEach(
      (k) => rowPatch[k] === undefined && delete rowPatch[k]
    );

    try {
      if (Object.keys(rowPatch).length > 0) {
        await supabase.from("menu_items").update(rowPatch).eq("id", itemId);
      }
    } catch (e) {
      console.error("Error actualizando platillo en Supabase:", e);
    }
  };

  const deleteMenuItem = async (restId, itemId) => {
    setRestaurantes((prev) =>
      prev.map((rr) =>
        rr.id === restId
          ? { ...rr, menu: rr.menu.filter((m) => m.id !== itemId) }
          : rr
      )
    );

    try {
      await supabase.from("menu_items").delete().eq("id", itemId);
    } catch (e) {
      console.error("Error eliminando platillo en Supabase:", e);
    }
  };

  // ======================
  // VENTAS (solo front por ahora)
  // ======================

  const closeSale = (restId, items, metodoPago) => {
    const total = items.reduce((a, b) => a + (b.total || 0), 0);
    const venta = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      items,
      metodoPago,
      total,
      estadoPago: "pendiente",
    };

    // 1) Actualizar en memoria (para que el admin vea la venta al instante)
    setRestaurantes((prev) =>
      prev.map((rr) =>
        rr.id === restId
          ? { ...rr, ventas: [...(rr.ventas || []), venta] }
          : rr
      )
    );

    // 2) Guardar también en Supabase (ventas centralizadas)
    supabase
      .from("ventas")
      .insert({
        id: venta.id,
        restaurant_id: restId,
        fecha: venta.fecha,
        items: venta.items,
        metodo_pago: venta.metodoPago,
        total: venta.total,
        estado_pago: venta.estadoPago,
      })
      .then(({ error }) => {
        if (error) {
          console.warn("No se pudo guardar venta en Supabase:", error);
        }
      })
      .catch((e) => {
        console.warn("Error inesperado guardando venta en Supabase:", e);
      });
  };


      // 2) Guardar inmediatamente en localStorage
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            STORAGE_RESTAURANTES,
            JSON.stringify(updated)
          );
        }
      } catch (e) {
        console.warn("No se pudo guardar ventas en localStorage:", e);
      }

      return updated;
    });
  };


  const updateSaleStatus = (restId, saleId, estadoPago) => {
    setRestaurantes((prev) =>
      prev.map((rr) => {
        if (rr.id !== restId) return rr;
        return {
          ...rr,
          ventas: (rr.ventas || []).map((v) =>
            v.id === saleId ? { ...v, estadoPago } : v
          ),
        };
      })
    );
  };

  const r =
    restaurantes.find((x) => x.id === activeRest) || restaurantes[0] || null;

  return {
    restaurantes,
    activeRest,
    setActiveRest,
    tab,
    setTab,
    r,
    addRestaurant,
    updateRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    closeSale,
    updateSaleStatus,
    loading,
  };
}


// ===============================
// HEADER / SELECTOR / TABS
// ===============================

function HeaderBar({ titulo }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background:
          "radial-gradient(circle at top left, rgba(74,222,128,0.18), transparent 55%), #020617",
        borderBottom: "1px solid rgba(148,163,184,0.35)",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "10px 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 12,
              background:
                "radial-gradient(circle at 0 0, #bbf7d0, #16a34a 35%, #0f172a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ecfdf5",
              fontWeight: 800,
              fontSize: 18,
              boxShadow: "0 8px 20px rgba(16,185,129,0.55)",
              transform: "translateY(0)",
              animation: "floatSoft 4s ease-in-out infinite",
            }}
          >
            R
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                color: "#e5e7eb",
              }}
            >
              Plataforma para restaurantes
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#9ca3af",
              }}
            >
              Menú digital + pedidos + reportes en una sola app
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#9ca3af",
            textAlign: "right",
          }}
        >
          Hecho para <span style={{ color: "#bbf7d0" }}>dueños</span> y{" "}
          <span style={{ color: "#bbf7d0" }}>equipos</span>
        </div>
      </div>
    </div>
  );
}

function RestaurantSelector({
  restaurantes,
  activeRest,
  setActiveRest,
  addRestaurant,
}) {
  // 1) Leer ?admin= de la URL (ej: ?admin=nubia-s-snack)
  let adminRestId = null;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    adminRestId = params.get("admin");
  }

  // 2) Filtrar restaurantes visibles según el admin
  const visibles = useMemo(() => {
    if (!adminRestId) {
      // Sin ?admin= → se muestran todos (tú como master / demo)
      return restaurantes;
    }
    // Con ?admin= → solo el restaurante de ese id
    return restaurantes.filter((r) => r.id === adminRestId);
  }, [adminRestId, restaurantes]);

  // Si por alguna razón no encuentra coincidencias, caemos de nuevo en todos
  const listaRestaurantes =
    visibles && visibles.length > 0 ? visibles : restaurantes;

  // 3) Solo el MASTER puede agregar restaurantes (cuando NO hay ?admin=)
  const canAddRestaurant = !adminRestId;

  return (
    <Container style={{ paddingTop: 0, paddingBottom: 10 }}>
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Restaurantes
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {listaRestaurantes.map((r) => (
                <Chip
                  key={r.id}
                  active={r.id === activeRest}
                  onClick={() => setActiveRest(r.id)}
                >
                  <span style={{ fontSize: 13 }}>
                    {r.nombre || "Sin nombre"}
                  </span>
                </Chip>
              ))}

              {/* 👇 ESTE BOTÓN SOLO LO VE EL MASTER (sin ?admin= en la URL) */}
              {canAddRestaurant && (
                <Chip
                  onClick={addRestaurant}
                  style={{
                    borderStyle: "dashed",
                    borderColor: "#d4d4d8",
                    background: "#f9fafb",
                    color: "#4b5563",
                  }}
                >
                  + Agregar restaurante
                </Chip>
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#6b7280",
              maxWidth: 260,
              textAlign: "right",
            }}
          >
            Administra varios restaurantes desde un solo panel. Cada uno con
            menú, colores, WhatsApp y reportes separados.
          </div>
        </div>
      </Card>
    </Container>
  );
}




function TabsBar({ tab, setTab }) {
  const tabs = [
    { id: "menu", label: "Menú y platillos" },
    { id: "public", label: "Vista del cliente" },
    { id: "settings", label: "Ajustes del restaurante" },
    { id: "reports", label: "Reportes" },
  ];

  return (
    <Container style={{ paddingTop: 4, paddingBottom: 4 }}>
      <div
        style={{
          display: "inline-flex",
          padding: 3,
          borderRadius: 999,
          background: "#020617",
          border: "1px solid rgba(148,163,184,0.4)",
          boxShadow: "0 18px 45px rgba(15,23,42,0.55)",
        }}
      >
        {tabs.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                borderRadius: 999,
                padding: "5px 10px",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                color: active ? "#0f172a" : "#9ca3af",
                background: active
                  ? "linear-gradient(135deg, #22c55e, #a3e635)"
                  : "transparent",
                boxShadow: active
                  ? "0 10px 25px rgba(34,197,94,0.5)"
                  : "none",
                transform: active ? "translateY(-1px)" : "translateY(0)",
                transition: "all 0.16s ease",
                minWidth: 80,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </Container>
  );
}

// ===============================
// COMPONENTES DE ADMINISTRACIÓN
// ===============================
const Card = ({ children, style }) => (
  <div
    style={{
      ...layoutStyles.card,
      ...style,
    }}
  >
    {children}
  </div>
);

const Label = ({ children, style }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 500,
      color: "#4b5563",
      marginBottom: 3,
      ...style,
    }}
  >
    {children}
  </div>
);

// Editor de menú
function MenuEditor({ r, store }) {
  const { addMenuItem, updateMenuItem, deleteMenuItem, updateRestaurant } =
    store;

  if (!r) return null;

  const [form, setForm] = useState({
    nombre: "",
    categoria: "Comidas",
    precio: "",
    costo: "",
    stock: "",
    foto: "",
    ingredientesBase: "",
    extras: "",
  });

  const handleFotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileToDataUrl(file, (dataUrl) => {
      setForm((prev) => ({ ...prev, foto: dataUrl }));
    });
  };

  // 👉 Para mostrar los extras existentes como "Tocino/15, Aguacate/20"
  const formatExtrasForInput = (extrasArr) => {
    if (!extrasArr) return "";
    return extrasArr
      .map((ex, idx) => {
        if (!ex) return "";
        if (typeof ex === "string") return ex; // compatibilidad con datos viejos
        const nombre = ex.nombre || `Extra ${idx + 1}`;
        const costo = ex.costo ? ex.costo : 0;
        return costo ? `${nombre}/${costo}` : nombre;
      })
      .filter(Boolean)
      .join(", ");
  };

  const handleAdd = () => {
    if (!form.nombre || !form.precio) {
      alert("Nombre y precio son obligatorios.");
      return;
    }
    const precioNumber = parseFloat(form.precio) || 0;
    const costoNumber = parseFloat(form.costo) || 0;
    const stockNumber = parseInt(form.stock || "0", 10);

    addMenuItem(r.id, {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: precioNumber,
      costo: costoNumber,
      stock: stockNumber,
      foto: form.foto,
      ingredientesBase: form.ingredientesBase
        ? form.ingredientesBase.split(",").map((s) => s.trim())
        : [],
      // 👇 ahora guardamos objetos {nombre, costo}
      extras: parseExtrasInput(form.extras),
    });

    setForm({
      nombre: "",
      categoria: "Comidas",
      precio: "",
      costo: "",
      stock: "",
      foto: "",
      ingredientesBase: "",
      extras: "",
    });
  };

  const handleUpdateField = (itemId, field, value) => {
    updateMenuItem(r.id, itemId, { [field]: value });
  };

  const handleFotoUpdate = (itemId, file) => {
    fileToDataUrl(file, (dataUrl) => {
      updateMenuItem(r.id, itemId, { foto: dataUrl });
    });
  };

  const handleIconChange = (categoria, value) => {
    const newIcons = { ...(r.categoryIcons || {}) };
    newIcons[categoria] = value || DEFAULT_ICONS[categoria] || "🍽️";
    updateRestaurant(r.id, { categoryIcons: newIcons });
  };

  const categoriasDef = [
    "Comidas",
    "Bebidas",
    "Desayunos",
    "Postres",
    "Snacks",
    "Especiales",
  ];

  return (
    <Container>
      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>Configura tu menú</h3>
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Agrega platillos con foto, precio, costo y opciones de personalización
          (ingredientes y extras). Todo lo que cargues aquí se reflejará en la
          vista del cliente.
        </p>

        <Grid columns={3}>
          <div>
            <Label>Nombre del platillo</Label>
            <Input
              value={form.nombre}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, nombre: e.target.value }))
              }
              placeholder="Ej: Hamburguesa clásica"
            />
          </div>
          <div>
            <Label>Categoría</Label>
            <select
              value={form.categoria}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categoria: e.target.value }))
              }
              style={{
                width: "100%",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                padding: "7px 11px",
                fontSize: 13,
              }}
            >
              {categoriasDef.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Precio de venta</Label>
            <Input
              type="number"
              value={form.precio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, precio: e.target.value }))
              }
              placeholder="Ej: 89.00"
            />
          </div>
          <div>
            <Label>Costo (opcional)</Label>
            <Input
              type="number"
              value={form.costo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, costo: e.target.value }))
              }
              placeholder="Ej: 45.00"
            />
          </div>
          <div>
            <Label>Stock (opcional)</Label>
            <Input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              placeholder="Ej: 20"
            />
          </div>
          <div>
            <Label>Foto (subir desde archivo)</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="file" accept="image/*" onChange={handleFotoFile} />
              {form.foto && (
                <span style={{ fontSize: 11, color: "#15803d" }}>
                  ✅ Imagen lista
                </span>
              )}
            </div>
          </div>
          <div>
            <Label>Ingredientes base (separados por coma)</Label>
            <Input
              value={form.ingredientesBase}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  ingredientesBase: e.target.value,
                }))
              }
              placeholder="Ej: Pan, carne, queso, lechuga"
            />
          </div>
          <div>
            <Label>
              Extras opcionales (nombre/precio, separados por coma)
            </Label>
            <Input
              value={form.extras}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, extras: e.target.value }))
              }
              placeholder="Ej: Tocino/15, Aguacate/20, Doble queso/25"
            />
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
              Escribe cada extra como <b>nombre/precio</b> y sepáralos con coma.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              style={{
                ...BTN,
                background: EMERALD,
                color: "#ffffff",
                borderColor: EMERALD_DARK,
                fontWeight: 600,
              }}
              onClick={handleAdd}
            >
              + Agregar platillo
            </button>
          </div>
        </Grid>
      </Card>

      <Card>
        <h4 style={{ marginTop: 0, marginBottom: 8 }}>Categorías y iconos</h4>
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          Elige un ícono para cada categoría. Así se mostrará en la vista del
          cliente.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {categoriasDef.map((cat) => (
            <div
              key={cat}
              style={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                padding: 8,
                minWidth: 130,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {r.categoryIcons?.[cat] || DEFAULT_ICONS[cat] || "🍽️"}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#111827",
                  }}
                >
                  {cat}
                </span>
              </div>
              <Input
                value={r.categoryIcons?.[cat] || DEFAULT_ICONS[cat] || "🍽️"}
                onChange={(e) => handleIconChange(cat, e.target.value)}
                placeholder="Ej: 🍕"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <h4 style={{ marginTop: 0, marginBottom: 8 }}>Platillos del menú</h4>
        {r.menu.length === 0 ? (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            Aún no has agregado platillos. Usa el formulario de arriba para
            comenzar.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 10,
            }}
          >
            {r.menu.map((item) => (
              <div
                key={item.id}
                style={{
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  {item.foto ? (
                    <img
                      src={item.foto}
                      alt={item.nombre}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: 24,
                        flexShrink: 0,
                      }}
                    >
                      📷
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <Input
                      value={item.nombre}
                      onChange={(e) =>
                        handleUpdateField(item.id, "nombre", e.target.value)
                      }
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    />
                    <select
                      value={item.categoria}
                      onChange={(e) =>
                        handleUpdateField(item.id, "categoria", e.target.value)
                      }
                      style={{
                        width: "100%",
                        borderRadius: 999,
                        border: "1px solid #e5e7eb",
                        padding: "4px 8px",
                        fontSize: 11,
                      }}
                    >
                      {categoriasDef.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                    gap: 6,
                  }}
                >
                  <div>
                    <Label style={{ fontSize: 10 }}>Precio</Label>
                    <Input
                      type="number"
                      value={item.precio}
                      onChange={(e) =>
                        handleUpdateField(
                          item.id,
                          "precio",
                          Number(e.target.value || 0)
                        )
                      }
                      style={{ fontSize: 11, padding: "5px 8px" }}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: 10 }}>Costo</Label>
                    <Input
                      type="number"
                      value={item.costo || ""}
                      onChange={(e) =>
                        handleUpdateField(
                          item.id,
                          "costo",
                          Number(e.target.value || 0)
                        )
                      }
                      style={{ fontSize: 11, padding: "5px 8px" }}
                    />
                  </div>
                  <div>
                    <Label style={{ fontSize: 10 }}>Stock</Label>
                    <Input
                      type="number"
                      value={item.stock || ""}
                      onChange={(e) =>
                        handleUpdateField(
                          item.id,
                          "stock",
                          Number(e.target.value || 0)
                        )
                      }
                      style={{ fontSize: 11, padding: "5px 8px" }}
                    />
                  </div>
                </div>

                <div>
                  <Label style={{ fontSize: 10 }}>Ingredientes base</Label>
                  <TextArea
                    value={(item.ingredientesBase || []).join(", ")}
                    onChange={(e) =>
                      handleUpdateField(
                        item.id,
                        "ingredientesBase",
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    style={{ fontSize: 11 }}
                  />
                </div>
                <div>
                  <Label style={{ fontSize: 10 }}>
                    Extras opcionales (nombre/precio)
                  </Label>
                  <TextArea
                    value={formatExtrasForInput(item.extras || [])}
                    onChange={(e) =>
                      handleUpdateField(
                        item.id,
                        "extras",
                        parseExtrasInput(e.target.value)
                      )
                    }
                    style={{ fontSize: 11 }}
                  />
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
                    Ejemplo: <b>Tocino/15, Aguacate/20</b>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 4,
                    gap: 8,
                  }}
                >
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#4b5563",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.activo !== false}
                      onChange={(e) =>
                        handleUpdateField(item.id, "activo", e.target.checked)
                      }
                    />
                    Visible en menú del cliente
                  </label>
                  <button
                    type="button"
                    style={{
                      ...BTN_DANGER,
                      paddingInline: 10,
                      fontSize: 11,
                    }}
                    onClick={() => {
                      const ok = window.confirm(
                        "¿Eliminar este platillo del menú?"
                      );
                      if (!ok) return;
                      deleteMenuItem(r.id, item.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>

                <div>
                  <Label style={{ fontSize: 10 }}>Actualizar foto</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      handleFotoUpdate(item.id, file);
                    }}
                    style={{ fontSize: 11 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}

// ===============================
// MODAL PARA PERSONALIZAR PLATILLO
// ===============================

function CustomizeModal({ item, onClose, onAdd }) {
  // ingredientes que el cliente QUIERE QUITAR
  const [ingredientesFuera, setIngredientesFuera] = useState([]);
  // nombres de extras seleccionados
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  // cantidad del platillo
  const [qty, setQty] = useState(1);

  const base = item.ingredientesBase || [];

  // Normalizar extras: string → { nombre, costo }
  const extrasInfo = Array.isArray(item.extras)
    ? item.extras.map((ex) =>
        typeof ex === "string" ? { nombre: ex, costo: 0 } : ex
      )
    : [];

  const toggleExtra = (nombreExtra) => {
    setExtrasSeleccionados((prev) =>
      prev.includes(nombreExtra)
        ? prev.filter((e) => e !== nombreExtra)
        : [...prev, nombreExtra]
    );
  };

  const toggleIngrediente = (ing) => {
    setIngredientesFuera((prev) =>
      prev.includes(ing)
        ? prev.filter((i) => i !== ing) // lo vuelve a dejar normal
        : [...prev, ing] // lo marca como SIN
    );
  };

  // control + / -
  const changeQty = (delta) => {
    setQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 99) return 99;
      return next;
    });
  };

  const handleConfirm = () => {
    const basePrecio = item.precio || 0;

    const extrasSeleccionadasInfo = extrasInfo.filter((ex) =>
      extrasSeleccionados.includes(ex.nombre)
    );

    const costoExtrasUnitario = extrasSeleccionadasInfo.reduce(
      (acc, ex) => acc + (ex.costo || 0),
      0
    );

    const total = (basePrecio + costoExtrasUnitario) * qty;

    // 🔴 AQUÍ armamos la línea tal como la espera "Tu pedido"
    onAdd({
      id: item.id,
      nombre: item.nombre,
      categoria: item.categoria,
      precio: item.precio,
      foto: item.foto,
      qty,
      seleccionIngredientes: ingredientesFuera, // lo que se quita
      seleccionExtras: extrasSeleccionados, // nombres de extras
      total,
    });

    onClose();
  };

  const extras = extrasInfo;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          background: "#ffffff",
          borderRadius: 18,
          boxShadow: "0 18px 40px rgba(15,23,42,0.45)",
          padding: 14,
          animation: "softPop 0.2s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 15 }}>{item.nombre}</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Personaliza este platillo como lo quiera el cliente.
        </p>

        {/* INGREDIENTES BASE */}
        <div style={{ marginBottom: 8 }}>
          <Label style={{ fontSize: 11 }}>Ingredientes base</Label>
          {base.length === 0 ? (
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
              No se especificaron ingredientes base.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {base.map((ing) => (
                <Chip
                  key={ing}
                  active={ingredientesFuera.includes(ing)}
                  onClick={() => toggleIngrediente(ing)}
                  style={{ fontSize: 11 }}
                >
                  {ing}
                </Chip>
              ))}
            </div>
          )}
        </div>

        {/* EXTRAS OPCIONALES */}
        <div style={{ marginBottom: 8 }}>
          <Label style={{ fontSize: 11 }}>Extras opcionales</Label>
          {extras.length === 0 ? (
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>
              No se configuraron extras.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {extras.map((extra) => (
                <Chip
                  key={extra.nombre}
                  active={extrasSeleccionados.includes(extra.nombre)}
                  onClick={() => toggleExtra(extra.nombre)}
                  style={{ fontSize: 11 }}
                >
                  {extra.nombre}
                  {extra.costo ? ` (+$${extra.costo} MXN)` : ""}
                </Chip>
              ))}
            </div>
          )}
        </div>

        {/* CANTIDAD CON + / - BONITO */}
        <div style={{ marginBottom: 8 }}>
          <Label style={{ fontSize: 11 }}>Cantidad</Label>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(15,23,42,0.12)",
            }}
          >
            <button
              type="button"
              onClick={() => changeQty(-1)}
              style={{
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
                background: "#f3f4f6",
                fontSize: 14,
              }}
            >
              −
            </button>
            <div
              style={{
                minWidth: 40,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {qty}
            </div>
            <button
              type="button"
              onClick={() => changeQty(1)}
              style={{
                border: "none",
                padding: "6px 10px",
                cursor: "pointer",
                background: "#22c55e",
                color: "#f0fdf4",
                fontSize: 14,
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* PIE: PRECIO Y BOTÓN */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#4b5563",
            }}
          >
            Precio base:{" "}
            <span style={{ fontWeight: 600 }}>{currency(item.precio)}</span>
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              ...BTN,
              background: EMERALD,
              color: "#ffffff",
              borderColor: EMERALD_DARK,
              fontSize: 12,
            }}
          >
            Agregar al pedido
          </button>
        </div>
      </div>
    </div>
  );
}


// ===============================
// VISTA DEL CLIENTE
// ===============================

function PublicMenu({ r, cart, onStartOrder, onOpenCheckout, onRemoveItem, onClearCart }) {
  const [categoriaActiva, setCategoriaActiva] = useState("Comidas");

  const categorias = useMemo(() => {
    if (!r) return [];
    const cats = new Set();
    r.menu.forEach((item) => {
      if (item.activo !== false) {
        cats.add(item.categoria || "Comidas");
      }
    });
    return Array.from(cats);
  }, [r]);

  const itemsFiltrados = useMemo(() => {
    if (!r) return [];
    return r.menu.filter(
      (item) =>
        item.activo !== false &&
        (categoriaActiva ? item.categoria === categoriaActiva : true)
    );
  }, [r, categoriaActiva]);

  if (!r) return null;

  const themePrimary = r.theme?.primary || EMERALD;
  const themeSecondary = r.theme?.secondary || EMERALD_DARK;

  // 👇 detectar si el usuario está en móvil
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  // Totales para la barrita flotante
  const totalItems = (cart || []).reduce(
    (sum, line) => sum + (line.qty || 0),
    0
  );
  const totalAmount = (cart || []).reduce(
    (sum, line) => sum + (line.total || 0),
    0
  );

  // 👉 nuevo: función para hacer scroll hacia "Tu pedido"
  const handleScrollToPedido = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById("tu-pedido-panel");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        background: "#020617",
        minHeight: 480,
        padding: "12px 12px 24px",
        borderRadius: 24,
        border: "1px solid rgba(148,163,184,0.4)",
        boxShadow: "0 22px 60px rgba(15,23,42,0.85)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            background: "radial-gradient(circle at top, #22c55e, #052e16)",
            border: "1px solid rgba(74,222,128,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(22,163,74,0.65)",
          }}
        >
          {r.logo ? (
            <img
              src={r.logo}
              alt={r.nombre}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <span style={{ fontSize: 20 }}>🍽️</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e5e7eb",
            }}
          >
            {r.nombre || "Restaurante sin nombre"}
          </div>

          {/* MENSAJE PERSONALIZADO DESDE AJUSTES */}
          {r.mensajeBienvenida && (
            <div
              style={{
                marginTop: 6,
                marginBottom: 6,
                padding: "6px 10px",
                borderRadius: 10,
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(148,163,184,0.5)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "#e5e7eb",
                whiteSpace: "pre-line",
              }}
            >
              {r.mensajeBienvenida}
            </div>
          )}

          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            Explora el menú, personaliza tu orden y envíala por WhatsApp.
          </div>
        </div>
        <div>
          <Badge tone="success">Online</Badge>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 2,
        }}
      >
        {categorias.length === 0 ? (
          <span
            style={{
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            No hay platillos activos todavía.
          </span>
        ) : (
          categorias.map((cat) => {
            const icon = r.categoryIcons?.[cat] || DEFAULT_ICONS[cat] || "🍽️";
            const active = cat === categoriaActiva;
            return (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                style={{
                  borderRadius: 999,
                  padding: "4px 9px",
                  border: "1px solid",
                  borderColor: active ? themePrimary : "rgba(148,163,184,0.5)",
                  background: active ? "rgba(16,185,129,0.22)" : "transparent",
                  color: active ? "#bbf7d0" : "#e5e7eb",
                  fontSize: 11,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  backdropFilter: "blur(10px)",
                }}
              >
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span>{cat}</span>
              </button>
            );
          })
        )}
      </div>

      {/* CONTENEDOR PRINCIPAL MENÚ + TU PEDIDO */}
      <div
        style={{
          display: isMobile ? "flex" : "grid",
          flexDirection: isMobile ? "column" : "row",
          gridTemplateColumns: isMobile
            ? "none"
            : "minmax(0,1.5fr) minmax(0,1fr)",
          gap: 10,
          marginTop: 8,
          alignItems: "stretch",
        }}
      >
        {/* LISTA DE PLATILLOS */}
        <div
          style={{
            borderRadius: 18,
            background: "linear-gradient(135deg, #0f172a, #020617)",
            border: "1px solid rgba(148,163,184,0.35)",
            padding: 8,
            minHeight: 220,
            maxHeight: isMobile ? "none" : 350,
            overflowY: "auto",
          }}
        >
          {itemsFiltrados.length === 0 ? (
            <p
              style={{
                fontSize: 11,
                color: "#9ca3af",
                margin: 0,
                padding: 8,
              }}
            >
              No hay platillos activos en esta categoría.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {itemsFiltrados.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: 8,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(6,78,59,0.8))",
                    border: "1px solid rgba(74,222,128,0.25)",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "#0b1120",
                      border: "1px solid rgba(148,163,184,0.4)",
                      flexShrink: 0,
                    }}
                  >
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={item.nombre}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          fontSize: 22,
                        }}
                      >
                        📷
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#e5e7eb",
                      }}
                    >
                      {item.nombre}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.ingredientesBase &&
                      item.ingredientesBase.length > 0 ? (
                        <span>
                          {item.ingredientesBase.slice(0, 4).join(", ")}
                          {item.ingredientesBase.length > 4 ? "..." : ""}
                        </span>
                      ) : (
                        <span>Personaliza al gusto del cliente.</span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: isMobile ? "flex-start" : "center",
                        justifyContent: "space-between",
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? 6 : 0,
                        marginTop: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#bbf7d0",
                        }}
                      >
                        {currency(item.precio || 0)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          gap: 4,
                          width: isMobile ? "100%" : "auto",
                        }}
                      >
                        <button
                          type="button"
                          style={{
                            ...BTN_OUTLINE,
                            fontSize: 11,
                            padding: "6px 8px",
                            color: "#e5e7eb",
                            borderColor: "rgba(148,163,184,0.5)",
                            background:
                              "linear-gradient(90deg, rgba(15,23,42,0.9), rgba(15,118,110,0.8))",
                            width: isMobile ? "100%" : "auto",
                          }}
                          onClick={() => onStartOrder(item, true)}
                        >
                          Personalizar
                        </button>
                        <button
                          type="button"
                          style={{
                            ...BTN,
                            fontSize: 11,
                            padding: "6px 8px",
                            background:
                              "linear-gradient(135deg,#22c55e,#4ade80)",
                            color: "#022c22",
                            borderColor: "rgba(74,222,128,0.7)",
                            width: isMobile ? "100%" : "auto",
                          }}
                          onClick={() => onStartOrder(item, false)}
                        >
                          Agregar al pedido
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL "TU PEDIDO" */}
        <div
          id="tu-pedido-panel" // <- ID para hacer scroll
          style={{
            borderRadius: 18,
            background:
              "radial-gradient(circle at top, rgba(22,163,74,0.25), transparent 55%), #020617",
            border: "1px solid rgba(148,163,184,0.35)",
            padding: 10,
            minHeight: 220,
            maxHeight: isMobile ? "none" : 350,
            overflowY: "auto",
            color: "#e5e7eb",
            marginTop: isMobile ? 8 : 0,
          }}
        >
          <h4
            style={{
              marginTop: 0,
              marginBottom: 6,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🧾 Tu pedido</span>
          </h4>
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginTop: 0,
              marginBottom: 8,
            }}
          >
            Desde el celular del cliente verán aquí su resumen antes de
            confirmar.
          </p>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              borderRadius: 12,
              border: "1px dashed rgba(148,163,184,0.5)",
              padding: 8,
            }}
          >
            {!cart || cart.length === 0 ? (
              <>
                Cuando el cliente agregue platillos, aquí aparecerá el detalle y
                el botón para confirmar el pedido y enviarlo por WhatsApp.
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  {cart.map((line, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        background: "rgba(15,23,42,0.6)",
                        border: "1px solid rgba(148,163,184,0.4)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 2,
                        }}
                      >
                        <span style={{ fontSize: 12 }}>
                          {line.qty}× {line.nombre}
                        </span>
                        <span style={{ fontSize: 12 }}>
                          {line.total != null ? `$${line.total}` : ""}
                        </span>
                      </div>

                      {line.seleccionIngredientes &&
                        line.seleccionIngredientes.length > 0 && (
                          <div style={{ fontSize: 10 }}>
                            Sin: {line.seleccionIngredientes.join(", ")}
                          </div>
                        )}

                      {line.seleccionExtras &&
                        line.seleccionExtras.length > 0 && (
                          <div style={{ fontSize: 10 }}>
                            Extras: {line.seleccionExtras.join(", ")}
                          </div>
                        )}

                      {onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          style={{
                            marginTop: 4,
                            border: "none",
                            background: "transparent",
                            color: "#f97373",
                            fontSize: 10,
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Quitar de este pedido
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4,
                    flexDirection: isMobile ? "column" : "row",
                  }}
                >
                  {onClearCart && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      style={{
                        ...BTN,
                        fontSize: 11,
                        padding: "4px 8px",
                        background: "transparent",
                        color: "#e5e7eb",
                        borderColor: "rgba(148,163,184,0.7)",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Vaciar pedido
                    </button>
                  )}

                  {onOpenCheckout && (
                    <button
                      type="button"
                      onClick={onOpenCheckout}
                      style={{
                        ...BTN,
                        fontSize: 11,
                        padding: "6px 10px",
                        background:
                          "linear-gradient(90deg,#22c55e,#4ade80)",
                        color: "#022c22",
                        borderColor: "rgba(74,222,128,0.7)",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Confirmar pedido y pagar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 BARRA FLOTANTE "TU PEDIDO" EN MÓVIL */}
      {isMobile && cart && cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 10,
            padding: "0 12px",
            zIndex: 999,
          }}
        >
          <div
            style={{
              borderRadius: 999,
              padding: "8px 12px",
              background:
                "linear-gradient(90deg, #16a34a, #22c55e, #4ade80)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 18px 40px rgba(22,163,74,0.85)",
              border: "1px solid rgba(22,163,74,0.95)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>🛒</span>
              <span>
                {totalItems}{" "}
                {totalItems === 1 ? "artículo" : "artículos"} ·{" "}
                <strong>{currency(totalAmount)}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleScrollToPedido} // 👈 ahora solo baja al panel
              style={{
                ...BTN,
                padding: "6px 10px",
                fontSize: 11,
                background: "#022c22",
                borderColor: "rgba(15,118,110,0.9)",
                color: "#ecfdf5",
                boxShadow: "0 10px 25px rgba(15,23,42,0.9)",
              }}
            >
              Ver pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===============================
// CHECKOUT MODAL (CORREGIDO)
// ===============================
function CheckoutModal({ r, cart, onClose, onSaleRegistered }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [enviando, setEnviando] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const transferenciaBanco = r.transferenciaBanco || "";
  const transferenciaCuenta = r.transferenciaCuenta || "";
  const transferenciaClabe = r.transferenciaClabe || "";
  const transferenciaTitular = r.transferenciaTitular || "";


  if (!cart || cart.length === 0) return null;
  if (!r) return null;

  const total = cart.reduce((acc, line) => {
    const lineaTotal =
      line.total != null
        ? Number(line.total)
        : (Number(line.precio) || 0) * (line.qty || 1);
    return acc + (isNaN(lineaTotal) ? 0 : lineaTotal);
  }, 0);

  const restauranteNombre = r.nombre || "tu restaurante";
  const whatsappDestino = (r.whatsapp || "").replace(/[^0-9]/g, "");

  const construirMensajeWhatsApp = () => {
    let msg = `*Nuevo pedido para ${restauranteNombre}*\n\n`;

    msg += `*Detalles del pedido:*\n`;
    cart.forEach((line, idx) => {
      const lineaTotal =
        line.total != null
          ? Number(line.total)
          : (Number(line.precio) || 0) * (line.qty || 1);
      msg += `${idx + 1}. ${line.qty || 1}× ${line.nombre} - ${currency(
        lineaTotal
      )}\n`;

      if (line.seleccionIngredientes && line.seleccionIngredientes.length > 0) {
        msg += `   • Sin: ${line.seleccionIngredientes.join(", ")}\n\n`;
      }

      if (line.seleccionExtras && line.seleccionExtras.length > 0) {
        msg += `   • Extras: ${line.seleccionExtras.join(", ")}\n`;
      }
    });

    msg += `\n*Total:* ${currency(total)}\n\n`;

    msg += `*Datos del cliente:*\n`;
    if (nombre) msg += `• Nombre: ${nombre}\n`;
    if (telefono) msg += `• Teléfono: ${telefono}\n`;
    if (direccion) msg += `• Dirección/Ubicación: ${direccion}\n`;
    msg += `• Método de pago: ${metodoPago}\n`;
    if (notas) msg += `• Notas: ${notas}\n`;

    msg += `\nEnviado desde el menú digital.`;

    return msg;
  };

  const handleConfirmarWhatsApp = () => {
    if (!whatsappDestino) {
      alert(
        "Este restaurante no tiene configurado un número de WhatsApp en Ajustes."
      );
      return;
    }
    if (enviando) return;
    setEnviando(true);

    try {
      const mensaje = construirMensajeWhatsApp();
      const encoded = encodeURIComponent(mensaje);
      const url = `https://wa.me/${whatsappDestino}?text=${encoded}`;

      // 👉 Abrimos WhatsApp
      window.open(url, "_blank");

      // 👉 Registramos la venta en reportes
      if (typeof onSaleRegistered === "function") {
        onSaleRegistered(cart, metodoPago);
      }

      onClose && onClose();
    } catch (e) {
      console.error("Error enviando por WhatsApp:", e);
      alert("Hubo un problema al preparar el pedido para WhatsApp.");
    } finally {
      setEnviando(false);
    }
  };

  const handleSoloRegistrar = () => {
    if (enviando) return;
    setEnviando(true);
    try {
      if (typeof onSaleRegistered === "function") {
        onSaleRegistered(cart, metodoPago);
      }
      alert("Venta registrada (sin enviar por WhatsApp).");
      onClose && onClose();
    } catch (e) {
      console.error("Error registrando venta:", e);
      alert("Hubo un problema al registrar la venta.");
    } finally {
      setEnviando(false);
    }
  };

  const handleUsarUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Tu navegador no soporta geolocalización.");
      return;
    }

    setGeoStatus("Obteniendo ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const txt = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
        setDireccion((prev) => (prev ? `${prev} | ${txt}` : txt));
        setGeoStatus("Ubicación agregada.");
      },
      (err) => {
        console.error("Geo error:", err);
        setGeoStatus("No se pudo obtener la ubicación.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: 12,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 20,
          background:
            "radial-gradient(circle at top, rgba(34,197,94,0.15), transparent 55%), #020617",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 24px 80px rgba(15,23,42,0.9)",
          color: "#e5e7eb",
          padding: 16,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Confirmar pedido
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#9ca3af",
              }}
            >
              Revisa el resumen y completa los datos del cliente.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Resumen del pedido */}
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(148,163,184,0.5)",
            padding: 10,
            marginBottom: 12,
            maxHeight: 150,
            overflowY: "auto",
            background: "rgba(15,23,42,0.8)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            🧾 Resumen del pedido
          </div>
          {cart.map((line, idx) => {
            const lineaTotal =
              line.total != null
                ? Number(line.total)
                : (Number(line.precio) || 0) * (line.qty || 1);
            return (
              <div
                key={idx}
                style={{
                  fontSize: 11,
                  padding: "4px 0",
                  borderBottom:
                    idx < cart.length - 1
                      ? "1px dashed rgba(55,65,81,0.7)"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <span>
                    {line.qty || 1}× {line.nombre}
                  </span>
                  <span>{currency(lineaTotal)}</span>
                </div>
                {line.seleccionIngredientes &&
                  line.seleccionIngredientes.length > 0 && (
                    <div style={{ color: "#9ca3af" }}>
                      <span style={{ fontSize: 10 }}>
                        Sin: {line.seleccionIngredientes.join(", ")}
                      </span>
                    </div>
                  )}
                {line.seleccionExtras && line.seleccionExtras.length > 0 && (
                  <div style={{ color: "#9ca3af" }}>
                    <span style={{ fontSize: 10 }}>
                      Extras: {line.seleccionExtras.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              fontWeight: 700,
              color: "#bbf7d0",
            }}
          >
            <span>Total</span>
            <span>{currency(total)}</span>
          </div>
        </div>

        {/* Datos del cliente */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.9fr",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 11, marginBottom: 3 }}>Nombre</div>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
              style={{
                width: "100%",
                borderRadius: 999,
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
                padding: "6px 10px",
                fontSize: 12,
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 11, marginBottom: 3 }}>Teléfono</div>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="10 dígitos"
              style={{
                width: "100%",
                borderRadius: 999,
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
                padding: "6px 10px",
                fontSize: 12,
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              marginBottom: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Dirección / ubicación</span>
            <button
              type="button"
              onClick={handleUsarUbicacion}
              style={{
                border: "none",
                background: "transparent",
                color: "#22c55e",
                fontSize: 10,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Usar mi ubicación actual
            </button>
          </div>
          <textarea
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Calle, número, referencias…"
            rows={2}
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid #4b5563",
              background: "#020617",
              color: "#e5e7eb",
              padding: "6px 10px",
              fontSize: 12,
              resize: "vertical",
            }}
          />
          {geoStatus && (
            <div
              style={{
                fontSize: 10,
                marginTop: 3,
                color: "#9ca3af",
              }}
            >
              {geoStatus}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, marginBottom: 3 }}>Notas del pedido</div>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Sin cebolla, entregar en portón negro, etc."
            rows={2}
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid #4b5563",
              background: "#020617",
              color: "#e5e7eb",
              padding: "6px 10px",
              fontSize: 12,
              resize: "vertical",
            }}
          />
        </div>

        {/* Método de pago */}
        <div
          style={{
            marginBottom: 12,
            fontSize: 11,
          }}
        >
          <div style={{ marginBottom: 4 }}>Método de pago</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {[
              { id: "efectivo", label: "Efectivo" },
              { id: "transferencia", label: "Transferencia" },
              { id: "tarjeta", label: "Tarjeta" },
            ].map((m) => {
              const active = metodoPago === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetodoPago(m.id)}
                  style={{
                    borderRadius: 999,
                    padding: "4px 10px",
                    border: "1px solid",
                    borderColor: active
                      ? "rgba(74,222,128,0.9)"
                      : "rgba(75,85,99,0.9)",
                    background: active
                      ? "linear-gradient(135deg,#22c55e,#4ade80)"
                      : "transparent",
                    color: active ? "#022c22" : "#e5e7eb",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
        {metodoPago === "transferencia" && (
          <div
            style={{
              marginBottom: 12,
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px dashed #4b5563",
              background: "#020617",
              fontSize: 11,
              color: "#e5e7eb",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Datos para transferencia
            </div>

            {!transferenciaBanco &&
            !transferenciaCuenta &&
            !transferenciaClabe &&
            !transferenciaTitular ? (
              <div style={{ color: "#9ca3af" }}>
                Aún no has configurado los datos de transferencia en Ajustes.
              </div>
            ) : (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 14,
                  listStyleType: "disc",
                }}
              >
                {transferenciaBanco && (
                  <li>Banco / tipo de cuenta: {transferenciaBanco}</li>
                )}
                {transferenciaCuenta && (
                  <li>Número de cuenta / tarjeta: {transferenciaCuenta}</li>
                )}
                {transferenciaClabe && <li>CLABE: {transferenciaClabe}</li>}
                {transferenciaTitular && (
                  <li>Titular de la cuenta: {transferenciaTitular}</li>
                )}
              </ul>
            )}
          </div>
        )}


        {/* Botones finales */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <button
            type="button"
            onClick={handleConfirmarWhatsApp}
            disabled={enviando}
            style={{
              ...BTN,
              width: "100%",
              fontSize: 12,
              padding: "8px 10px",
              background: "linear-gradient(90deg,#22c55e,#4ade80)",
              color: "#022c22",
              borderColor: "rgba(74,222,128,0.8)",
              opacity: enviando ? 0.7 : 1,
              cursor: enviando ? "wait" : "pointer",
            }}
          >
            📲 Confirmar y enviar por WhatsApp
          </button>

          <button
            type="button"
            onClick={handleSoloRegistrar}
            disabled={enviando}
            style={{
              ...BTN_OUTLINE,
              width: "100%",
              fontSize: 11,
              padding: "7px 10px",
              background: "transparent",
              color: "#e5e7eb",
              borderColor: "rgba(148,163,184,0.8)",
              opacity: enviando ? 0.7 : 1,
              cursor: enviando ? "wait" : "pointer",
            }}
          >
            💾 Registrar venta sin WhatsApp
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={enviando}
            style={{
              ...BTN_OUTLINE,
              width: "100%",
              fontSize: 11,
              padding: "6px 10px",
              background: "transparent",
              color: "#9ca3af",
              borderColor: "rgba(75,85,99,0.9)",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}


// ===============================
// PANEL DE REPORTES (MEJORADO)
// ===============================
function ReportsPanel({ r, store }) {
  const ventas = r?.ventas || [];
  const { updateSaleStatus } = store;

  // Helpers para fechas
  const toDate = (iso) => {
    try {
      return new Date(iso);
    } catch {
      return new Date();
    }
  };


  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isWithinLastDays = (date, days) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const max = days * 24 * 60 * 60 * 1000;
    return diff >= 0 && diff <= max;
  };

  const today = new Date();

  const ventasHoy = ventas.filter((v) => isSameDay(toDate(v.fecha), today));
  const ventasSemana = ventas.filter((v) =>
    isWithinLastDays(toDate(v.fecha), 7)
  );
  const ventasMes = ventas.filter((v) => {
    const d = toDate(v.fecha);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  });

  const sumTotal = (arr) => arr.reduce((s, v) => s + (v.total || 0), 0);
  const countItems = (arr) =>
    arr.reduce(
      (s, v) =>
        s +
        (Array.isArray(v.items)
          ? v.items.reduce((acc, it) => acc + (it.qty || 0), 0)
          : 0),
      0
    );

  const totalHoy = sumTotal(ventasHoy);
  const totalSemana = sumTotal(ventasSemana);
  const totalMes = sumTotal(ventasMes);
  const totalGeneral = sumTotal(ventas);
  const numVentas = ventas.length;
  const ticketPromedio = numVentas ? totalGeneral / numVentas : 0;
  const articulosVendidos = countItems(ventas);

  // Métodos de pago
  const paymentMap = {};
  ventas.forEach((v) => {
    const key = v.metodoPago || "Sin método";
    if (!paymentMap[key]) paymentMap[key] = 0;
    paymentMap[key] += v.total || 0;
  });
  const paymentList = Object.entries(paymentMap);

  // Top productos
  const contadorProductos = {};
  ventas.forEach((v) => {
    (v.items || []).forEach((it) => {
      if (!contadorProductos[it.nombre]) {
        contadorProductos[it.nombre] = 0;
      }
      contadorProductos[it.nombre] += it.qty || 0;
    });
  });
  const topProductos = Object.entries(contadorProductos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Filtros por fecha
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFin, setFiltroFin] = useState("");

  const ventasFiltradas = useMemo(() => {
    if (!filtroInicio && !filtroFin) return ventas;

    const inicio = filtroInicio ? new Date(filtroInicio) : null;
    const fin = filtroFin ? new Date(filtroFin) : null;

    return ventas.filter((v) => {
      const fechaVenta = toDate(v.fecha);

      if (inicio && fechaVenta < inicio) return false;
      if (fin) {
        const finDia = new Date(fin);
        finDia.setHours(23, 59, 59, 999);
        if (fechaVenta > finDia) return false;
      }

      return true;
    });
  }, [ventas, filtroInicio, filtroFin]);

  const handleSendDailyWhatsApp = () => {
    if (!ventasHoy.length) {
      alert("Hoy no hay ventas registradas todavía.");
      return;
    }
    const total = currency(totalHoy);
    const tickets = ventasHoy.length;
    const productos = topProductos
      .map(([nombre, qty]) => `${qty} x ${nombre}`)
      .join("\n");

    let msg =
      `Resumen de ventas de hoy (${today.toLocaleDateString(
        "es-MX"
      )}):\n\n` +
      `• Ventas totales: ${total}\n` +
      `• Número de tickets: ${tickets}\n` +
      `• Ticket promedio: ${currency(ticketPromedio)}\n` +
      `• Artículos vendidos: ${articulosVendidos}\n`;

    if (productos) {
      msg += `\nTop productos:\n${productos}`;
    }

    const phoneRaw = r?.whatsapp || "";
    const phone = phoneRaw.replace(/\D/g, "");
    const baseUrl = "https://wa.me/";
    const url =
      phone.length >= 8
        ? `${baseUrl}${phone}?text=${encodeURIComponent(msg)}`
        : `${baseUrl}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank");
  };

  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>
            Selecciona un restaurante para ver sus reportes.
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: 10, paddingBottom: 40 }}>
      {/* Resumen principal */}
      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>
          Resumen de ventas de {r.nombre || "tu restaurante"}
        </h3>
      {/* MENSAJE DE BIENVENIDA CONFIGURABLE */}
      {r?.mensajeBienvenida && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 10px",
            borderRadius: 10,
            background: "rgba(15,23,42,0.6)",
            border: "1px solid rgba(148,163,184,0.6)",
            fontSize: 13,
            lineHeight: 1.5,
            color: "#e5e7eb",
            whiteSpace: "pre-line",
            textAlign: "center",
          }}
        >
          {r.mensajeBienvenida}
        </div>
      )}

        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Aquí ves un resumen rápido de cómo va tu restaurante. Más abajo puedes
          revisar ventas por periodo, métodos de pago y platillos más vendidos.
        </p>

        <Grid columns={4} style={{ gap: 10 }}>
          <div
            style={{
              borderRadius: 10,
              padding: 8,
              background: "#ecfdf3",
              border: "1px solid #bbf7d0",
            }}
          >
            <div style={{ fontSize: 11, color: "#166534" }}>Ventas hoy</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {currency(totalHoy)}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563" }}>
              Tickets: {ventasHoy.length}
            </div>
          </div>

          <div
            style={{
              borderRadius: 10,
              padding: 8,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ fontSize: 11, color: "#1d4ed8" }}>
              Semana (7 días)
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {currency(totalSemana)}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563" }}>
              Ventas: {ventasSemana.length}
            </div>
          </div>

          <div
            style={{
              borderRadius: 10,
              padding: 8,
              background: "#fefce8",
              border: "1px solid #facc15",
            }}
          >
            <div style={{ fontSize: 11, color: "#854d0e" }}>Mes actual</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {currency(totalMes)}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563" }}>
              Ventas: {ventasMes.length}
            </div>
          </div>

          <div
            style={{
              borderRadius: 10,
              padding: 8,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: 11, color: "#111827" }}>
              Total histórico
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {currency(totalGeneral)}
            </div>
            <div style={{ fontSize: 11, color: "#4b5563" }}>
              Ticket promedio: {currency(ticketPromedio)}
            </div>
          </div>
        </Grid>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            alignItems: "center",
          }}
        >
          {/* Filtros por fecha */}
          <div style={{ display: "flex", gap: 8, fontSize: 11 }}>
            <div>
              <div style={{ color: "#6b7280", marginBottom: 2 }}>
                Desde
              </div>
              <input
                type="date"
                value={filtroInicio}
                onChange={(e) => setFiltroInicio(e.target.value)}
                style={{
                  padding: 4,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  fontSize: 11,
                }}
              />
            </div>
            <div>
              <div style={{ color: "#6b7280", marginBottom: 2 }}>
                Hasta
              </div>
              <input
                type="date"
                value={filtroFin}
                onChange={(e) => setFiltroFin(e.target.value)}
                style={{
                  padding: 4,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  fontSize: 11,
                }}
              />
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <button
                type="button"
                onClick={() => {
                  setFiltroInicio("");
                  setFiltroFin("");
                }}
                style={{
                  ...BTN_OUTLINE,
                  fontSize: 11,
                  padding: "4px 8px",
                }}
              >
                Restablecer
              </button>
            </div>
          </div>

          {/* Botón WhatsApp */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              style={{
                ...BTN,
                background: EMERALD,
                color: "white",
                borderColor: EMERALD_DARK,
                fontSize: 12,
              }}
              onClick={handleSendDailyWhatsApp}
            >
              Enviar resumen de hoy por WhatsApp
            </button>
          </div>
        </div>
      </Card>

      {/* Panel de métodos de pago y top productos */}
      <Grid columns={2} style={{ gap: 12 }}>
        <Card>
          <h4 style={{ marginTop: 0, marginBottom: 6 }}>
            Ventas por método de pago
          </h4>
          {paymentList.length === 0 ? (
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              Aún no hay ventas registradas.
            </p>
          ) : (
            <div style={{ fontSize: 12 }}>
              {paymentList.map(([metodo, total]) => (
                <div
                  key={metodo}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span>{metodo}</span>
                  <span style={{ fontWeight: 600 }}>
                    {currency(total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h4 style={{ marginTop: 0, marginBottom: 6 }}>
            Top platillos más vendidos
          </h4>
          {topProductos.length === 0 ? (
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
              Aún no hay ventas para analizar.
            </p>
          ) : (
            <ol
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 12,
              }}
            >
              {topProductos.map(([nombre, qty]) => (
                <li key={nombre} style={{ marginBottom: 2 }}>
                  {nombre}{" "}
                  <span style={{ color: "#6b7280" }}>
                    ({qty} piezas)
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </Grid>

      {/* Control de pagos */}
      <Card style={{ marginTop: 12 }}>
        <h4 style={{ marginTop: 0, marginBottom: 6 }}>
          Control de pagos (últimas ventas)
        </h4>
        <p
          style={{
            fontSize: 11,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          Marca cada pedido como pagado o pendiente para llevar el control de
          cobros. Solo visible para el restaurantero.
        </p>

        {ventasFiltradas.length === 0 ? (
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
            No hay ventas en el rango seleccionado.
          </p>
        ) : (
          <div
            style={{
              maxHeight: 260,
              overflowY: "auto",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              padding: 8,
              fontSize: 12,
            }}
          >
            {ventasFiltradas
              .slice()
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((v) => {
                const estado = v.estadoPago || "pendiente";
                const colorBg =
                  estado === "pagado" ? "#dcfce7" : "#fee2e2";
                const colorText =
                  estado === "pagado" ? "#166534" : "#b91c1c";

                return (
                  <div
                    key={v.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      paddingBottom: 6,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {toDate(v.fecha).toLocaleString("es-MX")}
                        </div>
                        <div style={{ fontWeight: 600 }}>
                          {currency(v.total || 0)}
                        </div>
                        <div style={{ fontSize: 11, color: "#4b5563" }}>
                          {Array.isArray(v.items)
                            ? v.items
                                .map(
                                  (it) => `${it.qty || 1}x ${it.nombre}`
                                )
                                .join(", ")
                            : ""}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", minWidth: 120 }}>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: colorBg,
                            color: colorText,
                            fontSize: 11,
                            marginBottom: 4,
                          }}
                        >
                          {estado === "pagado" ? "Pagado" : "Pendiente"}
                        </div>

                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            type="button"
                            onClick={() =>
                              updateSaleStatus(r.id, v.id, "pendiente")
                            }
                            style={{
                              ...BTN_OUTLINE,
                              fontSize: 10,
                              padding: "2px 6px",
                            }}
                          >
                            Pendiente
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSaleStatus(r.id, v.id, "pagado")
                            }
                            style={{
                              ...BTN,
                              fontSize: 10,
                              padding: "2px 6px",
                              background: "#22c55e",
                              borderColor: "#16a34a",
                              color: "white",
                            }}
                          >
                            Pagado
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>
    </Container>
  );
}

// ===============================
// AJUSTES DEL RESTAURANTE
// ===============================

function SettingsPanel({ r, store }) {
  const { updateRestaurant } = store;

  const [local, setLocal] = useState({
    nombre: r?.nombre || "",
    direccion: r?.direccion || "",
    whatsapp: r?.whatsapp || "",
    paymentLink: r?.paymentLink || "",
    transferenciaBanco: r?.transferenciaBanco || "",
    transferenciaCuenta: r?.transferenciaCuenta || "",
    transferenciaClabe: r?.transferenciaClabe || "",
    transferenciaTitular: r?.transferenciaTitular || "",
    logo: r?.logo || "",
    themePrimary: r?.theme?.primary || "#16a34a",
    themeSecondary: r?.theme?.secondary || "#065f46",
  });

  const [testimonios, setTestimonios] = useState(r?.testimonios || []);
  const [testNombre, setTestNombre] = useState("");
  const [testTexto, setTestTexto] = useState("");

  useEffect(() => {
    setLocal({
      nombre: r?.nombre || "",
      direccion: r?.direccion || "",
      whatsapp: r?.whatsapp || "",
      paymentLink: r?.paymentLink || "",
      transferenciaBanco: r?.transferenciaBanco || "",
      transferenciaCuenta: r?.transferenciaCuenta || "",
      transferenciaClabe: r?.transferenciaClabe || "",
      transferenciaTitular: r?.transferenciaTitular || "",
      logo: r?.logo || "",
      themePrimary: r?.theme?.primary || "#16a34a",
      themeSecondary: r?.theme?.secondary || "#065f46",
    });
    setTestimonios(r?.testimonios || []);
  }, [r]);

  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>
            Selecciona un restaurante para configurar sus datos.
          </p>
        </Card>
      </Container>
    );
  }

  const handleLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileToDataUrl(file, (dataUrl) => {
      setLocal((prev) => ({ ...prev, logo: dataUrl }));
    });
  };

  const handleGuardar = () => {
    updateRestaurant(r.id, {
      nombre: local.nombre,
      direccion: local.direccion,
      whatsapp: local.whatsapp,
      paymentLink: local.paymentLink,
      transferenciaBanco: local.transferenciaBanco,
      transferenciaCuenta: local.transferenciaCuenta,
      transferenciaClabe: local.transferenciaClabe,
      transferenciaTitular: local.transferenciaTitular,
      logo: local.logo,
      theme: {
        primary: local.themePrimary,
        secondary: local.themeSecondary,
      },
      testimonios,
    });
    alert("Datos guardados correctamente.");
  };

  const handleAddTestimonio = () => {
    if (!testNombre || !testTexto) {
      alert("Nombre y texto del testimonio son obligatorios.");
      return;
    }
    const nuevo = {
      id: crypto.randomUUID(),
      autor: testNombre,
      texto: testTexto,
    };
    setTestimonios((prev) => [...prev, nuevo]);
    setTestNombre("");
    setTestTexto("");
  };

  const handleDeleteTestimonio = (id) => {
    setTestimonios((prev) => prev.filter((t) => t.id !== id));
  };

  // 🔗 Construir link público SOLO de vista cliente
  const buildPublicMenuUrl = () => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin;
    return `${base}/?view=cliente&rest=${encodeURIComponent(r.id)}`;
  };

  // 🔗 COPIAR LINK DEL MENÚ
  const handleCopyMenuLink = () => {
    try {
      const url = buildPublicMenuUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
        alert(
          "Link del menú copiado. Pégalo en WhatsApp, redes sociales, etc."
        );
      } else {
        alert(
          "No se pudo copiar automáticamente. Copia el link desde la barra del navegador."
        );
      }
    } catch (e) {
      console.warn("No se pudo copiar el link:", e);
      alert(
        "No se pudo copiar automáticamente. Copia el link desde la barra del navegador."
      );
    }
  };

  // 📱 ABRIR QR DEMO CON ESE LINK
  const handleOpenQrDemo = () => {
    try {
      const url = buildPublicMenuUrl();
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        url
      )}`;
      window.open(qrUrl, "_blank");
    } catch (e) {
      console.warn("No se pudo abrir el QR:", e);
    }
  };

  return (
    <Container>
      {/* CARD 1: DATOS DEL RESTAURANTE + LINK/QR */}
      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0, marginBottom: 6 }}>
          Ajustes del restaurante
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Configura los datos básicos, el WhatsApp de pedidos, los colores,
          el logo, los datos de pago y testimonios que se mostrarán al cliente.
        </p>

        <Grid columns={2}>
          <div>
            <Label>Nombre del restaurante</Label>
            <Input
              value={local.nombre}
              onChange={(e) =>
                setLocal({ ...local, nombre: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Dirección (para referencia interna)</Label>
            <Input
              value={local.direccion}
              onChange={(e) =>
                setLocal({ ...local, direccion: e.target.value })
              }
            />
          </div>

          <div>
            <Label>WhatsApp para recibir pedidos</Label>
            <Input
              value={local.whatsapp}
              onChange={(e) =>
                setLocal({ ...local, whatsapp: e.target.value })
              }
              placeholder="Ej: 5244..."
            />
            <p
              style={{
                margin: 0,
                marginTop: 3,
                fontSize: 10,
                color: "#6b7280",
              }}
            >
              Usa formato internacional sin espacios ni guiones. Ejemplo:
              521234567890.
            </p>
          </div>

          <div>
            <Label>Link de pago (ej: tu link de banco / Stripe / etc.)</Label>
            <Input
              value={local.paymentLink}
              onChange={(e) =>
                setLocal({ ...local, paymentLink: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          {/* DATOS PARA TRANSFERENCIA BANCARIA */}
          <div>
            <Label>Banco / tipo de cuenta (para transferencia)</Label>
            <Input
              value={local.transferenciaBanco}
              onChange={(e) =>
                setLocal({
                  ...local,
                  transferenciaBanco: e.target.value,
                })
              }
              placeholder="Ej: BBVA - Cuenta débito"
            />
          </div>
          <div>
            <Label>Número de cuenta / tarjeta</Label>
            <Input
              value={local.transferenciaCuenta}
              onChange={(e) =>
                setLocal({
                  ...local,
                  transferenciaCuenta: e.target.value,
                })
              }
              placeholder="Ej: 1234 5678 9012 3456"
            />
          </div>
          <div>
            <Label>CLABE</Label>
            <Input
              value={local.transferenciaClabe}
              onChange={(e) =>
                setLocal({
                  ...local,
                  transferenciaClabe: e.target.value,
                })
              }
              placeholder="Ej: 012345678901234567"
            />
          </div>
          <div>
            <Label>Titular de la cuenta</Label>
            <Input
              value={local.transferenciaTitular}
              onChange={(e) =>
                setLocal({
                  ...local,
                  transferenciaTitular: e.target.value,
                })
              }
              placeholder="Nombre del titular"
            />
          </div>

          <div>
            <Label>Logo (desde archivo)</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="file" accept="image/*" onChange={handleLogoFile} />
              {local.logo && (
                <span style={{ fontSize: 11, color: "#15803d" }}>
                  ✅ Logo cargado
                </span>
              )}
            </div>
          </div>

          <div>
            <Label>Colores del tema</Label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    marginBottom: 2,
                  }}
                >
                  Primario
                </div>
                <input
                  type="color"
                  value={local.themePrimary}
                  onChange={(e) =>
                    setLocal({ ...local, themePrimary: e.target.value })
                  }
                  style={{
                    width: 36,
                    height: 24,
                    border: "none",
                    padding: 0,
                    background: "transparent",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    marginBottom: 2,
                  }}
                >
                  Secundario
                </div>
                <input
                  type="color"
                  value={local.themeSecondary}
                  onChange={(e) =>
                    setLocal({ ...local, themeSecondary: e.target.value })
                  }
                  style={{
                    width: 36,
                    height: 24,
                    border: "none",
                    padding: 0,
                    background: "transparent",
                  }}
                />
              </div>
            </div>
          </div>
        </Grid>

        {/* BOTÓN GUARDAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <button
            type="button"
            onClick={handleGuardar}
            style={{
              ...BTN,
              background: EMERALD,
              color: "#ffffff",
              borderColor: EMERALD_DARK,
              fontSize: 12,
            }}
          >
            Guardar cambios
          </button>
        </div>

        {/* 🔗 BOTONES PARA LINK Y QR */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={handleCopyMenuLink}
            style={{
              ...BTN_OUTLINE,
              fontSize: 11,
              padding: "6px 10px",
            }}
          >
            Compartir link del menú
          </button>
          <button
            type="button"
            onClick={handleOpenQrDemo}
            style={{
              ...BTN_OUTLINE,
              fontSize: 11,
              padding: "6px 10px",
            }}
          >
            Ver QR demo (rápido)
          </button>
        </div>
      </Card>

      {/* CARD 2: TESTIMONIOS */}
      <Card>
        <h4 style={{ marginTop: 0, marginBottom: 8 }}>
          Testimonios de clientes
        </h4>
        <Grid columns={2}>
          <div>
            <Label>Nombre del cliente</Label>
            <Input
              value={testNombre}
              onChange={(e) => setTestNombre(e.target.value)}
              placeholder="Ej: Ana, cliente frecuente"
            />
            <Label style={{ marginTop: 6 }}>Testimonio</Label>
            <TextArea
              value={testTexto}
              onChange={(e) => setTestTexto(e.target.value)}
              placeholder="Ej: Me encanta el servicio y la rapidez de este lugar..."
            />
            <button
              type="button"
              onClick={handleAddTestimonio}
              style={{
                ...BTN,
                marginTop: 8,
                background: "#0ea5e9",
                color: "#eff6ff",
                borderColor: "#0284c7",
                fontSize: 12,
              }}
            >
              Agregar testimonio
            </button>
          </div>
          <div>
            <Label>Testimonios actuales</Label>
            <div
              style={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                padding: 8,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {testimonios.length === 0 ? (
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  Aún no se han agregado testimonios.
                </p>
              ) : (
                testimonios.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      paddingBottom: 4,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {t.autor}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#4b5563",
                        marginBottom: 4,
                      }}
                    >
                      {t.texto}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonio(t.id)}
                      style={{
                        ...BTN_OUTLINE,
                        fontSize: 10,
                        padding: "3px 8px",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Grid>
      </Card>
    </Container>
  );
}

// 🔐 CONTRASEÑA MASTER (solo tú, Diana)
const MASTER_PASSWORD = "22110285Regina@";

// ===============================
// APP PRINCIPAL
// ===============================

function App() {
  const path = window.location.pathname;

  // Si la URL termina en /demo, mostramos SOLO la landing de demo
  if (path === "/demo") {
    return <DemoLanding />;
  }

  const store = useStore();
  const { restaurantes, activeRest, tab, setTab, setActiveRest, r } = store;

  const [cart, setCart] = useState([]);
  const [customItem, setCustomItem] = useState(null);
  const [checkoutCart, setCheckoutCart] = useState(null);
  const [masterOk, setMasterOk] = useState(false); // 🔐 NUEVO

  // Construye el link público de menú para un restaurante
  const getClientUrlForRestaurant = (restaurantId) => {
    const baseUrl = window.location.origin; // local o Vercel automáticamente
    return `${baseUrl}/?view=cliente&rest=${encodeURIComponent(restaurantId)}`;
  };

  // (Si luego quieres usar este botón, lo dejamos aquí por si acaso)
  const handleShareClientLink = () => {
    const selectedRestaurant = r;
    const restId = selectedRestaurant?.id;
    const restName = selectedRestaurant?.nombre || "mi restaurante";

    if (!restId) {
      alert("Primero selecciona un restaurante.");
      return;
    }

    const url = getClientUrlForRestaurant(restId);

    if (navigator.share) {
      navigator
        .share({
          title: `Menú de ${restName}`,
          text: "Te comparto el menú de mi restaurante",
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => alert("Link del menú copiado:\n" + url))
        .catch(() => alert("Copia este link:\n" + url));
    }
  };

  // ======================
  // FLAGS DE LA URL
  // ======================
  let isPublicClient = false;
  let publicRestId = null;
  let isDemo = false;
  let adminParam = null;

  if (typeof window !== "undefined") {
    const sp = new URLSearchParams(window.location.search);
    const view = sp.get("view");
    publicRestId = sp.get("rest");
    adminParam = sp.get("admin");

    // Vista cliente (cuando mandas el link al comensal)
    isPublicClient = view === "cliente" || !!publicRestId;

    // Ruta demo
    isDemo =
      window.location.pathname === "/demo" || view === "demo";
  }

  const hasAdminParam = !!adminParam;                 // ?admin=rest-id
  const isAdminArea = !isPublicClient && !isDemo;     // zona de administración
  const needsMasterPassword = isAdminArea && !hasAdminParam;
  // ======================
  // RESTAURANTE ACTUAL & VISTA PÚBLICA
  // ======================
  const currentRestaurant =
    restaurantes.find((rest) => rest.id === activeRest) || null;

  let rPublic = null;
  if (isPublicClient) {
    const targetId = publicRestId || activeRest;
    rPublic =
      restaurantes.find((rest) => rest.id === targetId) || currentRestaurant;
  }

  // 👉 needsMasterPassword SOLO es true cuando:
  //    - NO es vista cliente
  //    - NO es demo
  //    - NO viene ?admin= (o sea: tu panel general)

  // ================
  // HANDLERS CARRITO
  // ================

  const handleStartOrder = (item, wantCustomize = false) => {
    if (!item) return;
    if (wantCustomize) {
      setCustomItem(item);
    } else {
      const basePrecio = item.precio || 0;
      const line = {
        ...item,
        qty: 1,
        seleccionIngredientes: [],
        seleccionExtras: [],
        total: basePrecio,
      };
      setCart((prev) => [...prev, line]);
    }
  };

  const handleAddFromModal = (linea) => {
    if (!linea) return;
    setCart((prev) => [...prev, linea]);
    setCustomItem(null);
  };

  const handleRemoveCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenCheckout = () => {
    if (!cart.length) {
      alert("Agrega al menos un platillo al pedido antes de confirmar.");
      return;
    }
    setCheckoutCart(cart);
  };

  const handleCloseCheckout = () => {
    setCheckoutCart(null);
  };

  const handleSaleRegistered = (items, metodoPago) => {
    if (!currentRestaurant) return;
    store.closeSale(currentRestaurant.id, items, metodoPago);
    setCart([]);
    setCheckoutCart(null);
  };

  // 🔐 LOGIN MASTER (solo para Diana, en panel general)
  if (needsMasterPassword && !masterOk) {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("master-auth");

      if (saved === MASTER_PASSWORD) {
        setMasterOk(true);
      } else {
        const pass = window.prompt("Contraseña master:");
        if (pass === MASTER_PASSWORD) {
          window.localStorage.setItem("master-auth", MASTER_PASSWORD);
          setMasterOk(true);
        } else {
          alert("Contraseña incorrecta");
          return (
            <div
              style={{
                padding: 24,
                minHeight: "100vh",
                background: "#020617",
                color: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              Acceso denegado. Recarga la página para intentar de nuevo.
            </div>
          );
        }
      }
    }

    // mientras resuelve el login, no pintamos nada
    return null;
  }

  // ======================
  // MODO DEMO (SOLO CLIENTE)
  // ======================
  if (isDemo) {
    const demoRestaurant = {
      id: "demo-rest",
      nombre: "Demo Burgers & Snacks",
      logo: "",
      theme: {
        primary: EMERALD,
        secondary: EMERALD_DARK,
      },
      mensajeBienvenida:
        "🍔 ¡Ordena en 2 clics y recibe en minutos!\nSin llamadas, sin filas — solo toca y disfruta.\n📍 Restaurante local favorito en tu ciudad.",
      categoryIcons: {
        Comidas: "🍔",
        Bebidas: "🥤",
        Postres: "🍰",
      },
      menu: [
        {
          id: "demo-1",
          nombre: "Hamburguesa clásica",
          categoria: "Comidas",
          precio: 89,
          activo: true,
          ingredientesBase: ["Pan brioche", "Carne 100g", "Queso", "Lechuga"],
          extras: [
            { nombre: "Queso extra", costo: 10 },
            { nombre: "Tocino", costo: 18 },
            { nombre: "Carne doble", costo: 35 },
          ],
        },
        {
          id: "demo-2",
          nombre: "Papas a la francesa",
          categoria: "Comidas",
          precio: 49,
          activo: true,
          ingredientesBase: ["Papas fritas", "Sal de casa"],
          extras: [
            { nombre: "Queso cheddar", costo: 12 },
            { nombre: "Salsa extra", costo: 5 },
          ],
        },
        {
          id: "demo-3",
          nombre: "Refresco 600ml",
          categoria: "Bebidas",
          precio: 25,
          activo: true,
          ingredientesBase: ["Bebida fría"],
          extras: [],
        },
        {
          id: "demo-4",
          nombre: "Malteada de fresa",
          categoria: "Postres",
          precio: 69,
          activo: true,
          ingredientesBase: ["Leche", "Helado de fresa", "Crema batida"],
          extras: [{ nombre: "Topping extra", costo: 10 }],
        },
      ],
    };

    return (
      <>
        <HeaderBar titulo="Demo menú digital" />
        <Container>
          <Card>
            <PublicMenu
              r={demoRestaurant}
              cart={cart}
              onStartOrder={handleStartOrder}
              onOpenCheckout={handleOpenCheckout}
              onRemoveItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
            />
          </Card>
        </Container>

        {customItem && (
          <CustomizeModal
            item={customItem}
            onClose={() => setCustomItem(null)}
            onAdd={handleAddFromModal}
          />
        )}

        {checkoutCart && (
          <CheckoutModal
            r={demoRestaurant}
            cart={checkoutCart}
            onClose={handleCloseCheckout}
            onSaleRegistered={() => {
              // En DEMO no guardamos la venta en Supabase
              setCart([]);
              setCheckoutCart(null);
            }}
          />
        )}
      </>
    );
  }

  // ======================
  // MODO SOLO CLIENTE (link público real)
  // ======================
  if (isPublicClient) {
    if (!rPublic) {
      return (
        <>
          <HeaderBar titulo="Menú del restaurante" />
          <Container>
            <Card>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#9ca3af",
                }}
              >
                No se encontró información del restaurante.
              </p>
            </Card>
          </Container>
        </>
      );
    }

    return (
      <>
        <HeaderBar titulo={rPublic.nombre || "Menú del restaurante"} />
        <Container>
          <Card>
            <PublicMenu
              r={rPublic}
              cart={cart}
              onStartOrder={handleStartOrder}
              onOpenCheckout={handleOpenCheckout}
              onRemoveItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
            />
          </Card>
        </Container>

        {customItem && (
          <CustomizeModal
            item={customItem}
            onClose={() => setCustomItem(null)}
            onAdd={handleAddFromModal}
          />
        )}

        {checkoutCart && (
          <CheckoutModal
            r={rPublic}
            cart={checkoutCart}
            onClose={handleCloseCheckout}
            onSaleRegistered={(items, metodoPago) => {
              try {
                if (!rPublic) return;
                // 🔹 Aquí sí registramos la venta en el restaurante correcto
                store.closeSale(rPublic.id, items, metodoPago);
              } catch (e) {
                console.error(
                  "Error registrando venta (vista cliente pública):",
                  e
                );
              } finally {
                setCart([]);
                setCheckoutCart(null);
              }
            }}
          />
        )}
      </>
    );
  }


  // ======================
  // MODO ADMIN / PANEL COMPLETO
  // ======================
  return (
    <>
      <HeaderBar titulo="Panel multi-restaurante" />

      <RestaurantSelector
        restaurantes={restaurantes}
        activeRest={activeRest}
        setActiveRest={setActiveRest}
        addRestaurant={store.addRestaurant}
      />

      <TabsBar tab={tab} setTab={setTab} />

      {!currentRestaurant ? (
        <Container>
          <Card>
            <p style={{ margin: 0 }}>
              Agrega un restaurante o selecciona uno existente para comenzar.
            </p>
          </Card>
        </Container>
      ) : (
        <>
          {tab === "menu" && (
            <MenuEditor r={currentRestaurant} store={store} />
          )}

          {tab === "public" && (
            <>
              <Container>
                <Card>
                  <p
                    style={{
                      marginTop: 0,
                      marginBottom: 8,
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    Así verá el cliente tu menú cuando compartas el link desde
                    Ajustes.
                  </p>
                  <PublicMenu
                    r={currentRestaurant}
                    cart={cart}
                    onStartOrder={handleStartOrder}
                    onOpenCheckout={handleOpenCheckout}
                    onRemoveItem={handleRemoveCartItem}
                    onClearCart={handleClearCart}
                  />
                </Card>
              </Container>

              {customItem && (
                <CustomizeModal
                  item={customItem}
                  onClose={() => setCustomItem(null)}
                  onAdd={handleAddFromModal}
                />
              )}

              {checkoutCart && (
                <CheckoutModal
                  r={currentRestaurant}
                  cart={checkoutCart}
                  onClose={handleCloseCheckout}
                  onSaleRegistered={handleSaleRegistered}
                />
              )}
            </>
          )}

          {tab === "settings" && (
            <SettingsPanel r={currentRestaurant} store={store} />
          )}

          {tab === "reports" && (
            <ReportsPanel r={currentRestaurant} store={store} />
          )}
        </>
      )}
    </>
  );
}

export default App;


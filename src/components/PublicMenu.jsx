<<<<<<< HEAD
// =============================================
// PublicMenu.jsx (Modularizado, miso diseño)
// =============================================

import React from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Grid from "./ui/Grid";

// =============================================
// MENÚ PÚBLICO QUE VE EL CLIENTE
// (Diseño 100% idéntico al original)
// =============================================

function PublicMenu({ r, cart, onStartOrder, onOpenCheckout, onRemoveItem, onClearCart }) {
  if (!r) {
    return <p style={{ padding: 20 }}>No hay restaurante seleccionado.</p>;
  }

  return (
    <div>
      {/* ============================= */}
      {/* SECCIÓN MENÚ PÚBLICO */}
      {/* ============================= */}

      {r.menu.map((cat) => (
        <div key={cat.id} style={{ marginBottom: 25 }}>
          <h3 style={{ margin: "8px 0" }}>{cat.nombre}</h3>

          {/* LISTA DE PLATILLOS */}
          <Grid columns={2} style={{ gap: 12 }}>
            {cat.platillos.map((p) => (
              <Card key={p.id} style={{ padding: 10 }}>
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{ width: "100%", borderRadius: 8, marginBottom: 6 }}
                  />
                )}

                <strong>{p.nombre}</strong>
                <p style={{ margin: "4px 0", fontSize: 12 }}>{p.descripcion}</p>
                <p style={{ margin: 0, fontWeight: "bold" }}>${p.precio}</p>

                <Button
                  style={{ marginTop: 6 }}
                  onClick={() => onStartOrder(p, true)}
                >
                  Personalizar
                </Button>

                <Button
                  style={{ marginTop: 6, background: "#0ea5e9" }}
                  onClick={() => onStartOrder(p, false)}
                >
                  Agregar rápido
                </Button>
              </Card>
            ))}
          </Grid>
        </div>
      ))}

      {/* ============================= */}
      {/* CARRITO DEL CLIENTE */}
      {/* ============================= */}

      <Card style={{ marginTop: 30, background: "#f1f5f9" }}>
        <h3 style={{ marginTop: 0 }}>Mi pedido</h3>

        {cart.length === 0 && <p>Aún no has agregado platillos.</p>}

        {cart.map((item, index) => (
          <Card
            key={index}
            style={{ background: "white", marginBottom: 8, padding: 10 }}
          >
            <strong>{item.nombre}</strong>

            {/* INGREDIENTES */}
            {item.seleccionIngredientes?.length > 0 && (
              <p style={{ fontSize: 12, margin: 0 }}>
                Sin: {item.seleccionIngredientes.join(", ")}
              </p>
            )}

            {/* EXTRAS */}
            {item.seleccionExtras?.length > 0 && (
              <p style={{ fontSize: 12, margin: 0 }}>
                Extras: {item.seleccionExtras.join(", ")}
              </p>
            )}

            <p style={{ margin: "4px 0", fontWeight: "bold" }}>
              Total: ${item.total}
            </p>

            <Button
              style={{ background: "#dc2626" }}
              onClick={() => onRemoveItem(index)}
            >
              Eliminar
            </Button>
          </Card>
        ))}

        {cart.length > 0 && (
          <>
            <Button
              style={{ background: "#34d399", marginBottom: 10 }}
              onClick={onOpenCheckout}
            >
              Confirmar pedido
            </Button>

            <Button
              style={{ background: "#6b7280" }}
              onClick={onClearCart}
            >
              Vaciar carrito
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

=======
// =============================================
// PublicMenu.jsx (Modularizado, miso diseño)
// =============================================

import React from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Grid from "./ui/Grid";

// =============================================
// MENÚ PÚBLICO QUE VE EL CLIENTE
// (Diseño 100% idéntico al original)
// =============================================

function PublicMenu({ r, cart, onStartOrder, onOpenCheckout, onRemoveItem, onClearCart }) {
  if (!r) {
    return <p style={{ padding: 20 }}>No hay restaurante seleccionado.</p>;
  }

  return (
    <div>
      {/* ============================= */}
      {/* SECCIÓN MENÚ PÚBLICO */}
      {/* ============================= */}

      {r.menu.map((cat) => (
        <div key={cat.id} style={{ marginBottom: 25 }}>
          <h3 style={{ margin: "8px 0" }}>{cat.nombre}</h3>

          {/* LISTA DE PLATILLOS */}
          <Grid columns={2} style={{ gap: 12 }}>
            {cat.platillos.map((p) => (
              <Card key={p.id} style={{ padding: 10 }}>
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{ width: "100%", borderRadius: 8, marginBottom: 6 }}
                  />
                )}

                <strong>{p.nombre}</strong>
                <p style={{ margin: "4px 0", fontSize: 12 }}>{p.descripcion}</p>
                <p style={{ margin: 0, fontWeight: "bold" }}>${p.precio}</p>

                <Button
                  style={{ marginTop: 6 }}
                  onClick={() => onStartOrder(p, true)}
                >
                  Personalizar
                </Button>

                <Button
                  style={{ marginTop: 6, background: "#0ea5e9" }}
                  onClick={() => onStartOrder(p, false)}
                >
                  Agregar rápido
                </Button>
              </Card>
            ))}
          </Grid>
        </div>
      ))}

      {/* ============================= */}
      {/* CARRITO DEL CLIENTE */}
      {/* ============================= */}

      <Card style={{ marginTop: 30, background: "#f1f5f9" }}>
        <h3 style={{ marginTop: 0 }}>Mi pedido</h3>

        {cart.length === 0 && <p>Aún no has agregado platillos.</p>}

        {cart.map((item, index) => (
          <Card
            key={index}
            style={{ background: "white", marginBottom: 8, padding: 10 }}
          >
            <strong>{item.nombre}</strong>

            {/* INGREDIENTES */}
            {item.seleccionIngredientes?.length > 0 && (
              <p style={{ fontSize: 12, margin: 0 }}>
                Sin: {item.seleccionIngredientes.join(", ")}
              </p>
            )}

            {/* EXTRAS */}
            {item.seleccionExtras?.length > 0 && (
              <p style={{ fontSize: 12, margin: 0 }}>
                Extras: {item.seleccionExtras.join(", ")}
              </p>
            )}

            <p style={{ margin: "4px 0", fontWeight: "bold" }}>
              Total: ${item.total}
            </p>

            <Button
              style={{ background: "#dc2626" }}
              onClick={() => onRemoveItem(index)}
            >
              Eliminar
            </Button>
          </Card>
        ))}

        {cart.length > 0 && (
          <>
            <Button
              style={{ background: "#34d399", marginBottom: 10 }}
              onClick={onOpenCheckout}
            >
              Confirmar pedido
            </Button>

            <Button
              style={{ background: "#6b7280" }}
              onClick={onClearCart}
            >
              Vaciar carrito
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8
export default PublicMenu;
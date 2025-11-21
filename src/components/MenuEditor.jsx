<<<<<<< HEAD
// =============================================
// MenuEditor.jsx (Modularizado, Mantiene diseño actual)
// =============================================

import React, { useState } from "react";
import Container from "./ui/Container";
import Card from "./ui/Card";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";
import Grid from "./ui/Grid";
import Button from "./ui/Button";

// =============================================
// EDITOR DE MENÚ
// =============================================
// Mantiene EXACTAMENTE el diseño que tenías
// Solo se separa en este archivo para modularizar
// =============================================

function MenuEditor({ r, store }) {
  const { updateRestaurant } = store;

  const [categoria, setCategoria] = useState("");
  const [nuevoPlatillo, setNuevoPlatillo] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    ingredientesBase: "",
    extras: "",
    imagen: "",
  });

  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>No hay restaurante activo.</p>
        </Card>
      </Container>
    );
  }

  // =============================================
  // Agregar Categoría
  // =============================================
  const handleAgregarCategoria = () => {
    if (!categoria.trim()) return;

    updateRestaurant(r.id, {
      menu: [
        ...r.menu,
        {
          id: "cat-" + Date.now(),
          nombre: categoria,
          platillos: [],
        },
      ],
    });

    setCategoria("");
  };

  // =============================================
  // Agregar Platillo
  // =============================================
  const handleAgregarPlatillo = (catId) => {
    if (!nuevoPlatillo.nombre.trim()) return;

    updateRestaurant(r.id, {
      menu: r.menu.map((c) =>
        c.id === catId
          ? {
              ...c,
              platillos: [
                ...c.platillos,
                {
                  id: "plt-" + Date.now(),
                  nombre: nuevoPlatillo.nombre,
                  descripcion: nuevoPlatillo.descripcion,
                  precio: Number(nuevoPlatillo.precio || 0),
                  ingredientesBase: nuevoPlatillo.ingredientesBase
                    ? nuevoPlatillo.ingredientesBase.split(",")
                    : [],
                  extras: nuevoPlatillo.extras
                    ? nuevoPlatillo.extras.split(",")
                    : [],
                  imagen: nuevoPlatillo.imagen,
                },
              ],
            }
          : c
      ),
    });

    setNuevoPlatillo({
      nombre: "",
      descripcion: "",
      precio: "",
      ingredientesBase: "",
      extras: "",
      imagen: "",
    });
  };

  return (
    <Container>
      <Card>
        <h3 style={{ marginTop: 0 }}>Categorías del Menú</h3>

        {/* AGREGAR CATEGORÍA */}
        <Grid columns={2} style={{ marginBottom: 12 }}>
          <Input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Nueva categoría"
          />
          <Button onClick={handleAgregarCategoria}>Agregar</Button>
        </Grid>

        {/* LISTA DE CATEGORÍAS */}
        {r.menu.map((cat) => (
          <Card key={cat.id} style={{ marginTop: 10 }}>
            <h4 style={{ marginTop: 0 }}>{cat.nombre}</h4>

            {/* FORM NUEVO PLATILLO */}
            <Grid columns={2} style={{ gap: 8 }}>
              <Input
                placeholder="Nombre del platillo"
                value={nuevoPlatillo.nombre}
                onChange={(e) =>
                  setNuevoPlatillo({ ...nuevoPlatillo, nombre: e.target.value })
                }
              />
              <Input
                placeholder="Precio"
                value={nuevoPlatillo.precio}
                onChange={(e) =>
                  setNuevoPlatillo({ ...nuevoPlatillo, precio: e.target.value })
                }
              />
            </Grid>

            <TextArea
              placeholder="Descripción"
              value={nuevoPlatillo.descripcion}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  descripcion: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Input
              placeholder="Ingredientes base (separados por coma)"
              value={nuevoPlatillo.ingredientesBase}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  ingredientesBase: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Input
              placeholder="Extras opcionales (separados por coma)"
              value={nuevoPlatillo.extras}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  extras: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Input
              placeholder="URL de la imagen"
              value={nuevoPlatillo.imagen}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  imagen: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Button
              style={{ marginTop: 10 }}
              onClick={() => handleAgregarPlatillo(cat.id)}
            >
              Agregar platillo
            </Button>

            {/* LISTA DE PLATILLOS */}
            {cat.platillos.map((p) => (
              <Card key={p.id} style={{ marginTop: 10, background: "#f8fafc" }}>
                <strong>{p.nombre}</strong>
                <p style={{ fontSize: 12, margin: 0 }}>{p.descripcion}</p>
                <p style={{ fontSize: 12, margin: 0 }}>
                  <strong>Precio:</strong> ${p.precio}
                </p>
                {p.ingredientesBase?.length > 0 && (
                  <p style={{ fontSize: 12, margin: 0 }}>
                    Ingredientes: {p.ingredientesBase.join(", ")}
                  </p>
                )}
                {p.extras?.length > 0 && (
                  <p style={{ fontSize: 12, margin: 0 }}>
                    Extras: {p.extras.join(", ")}
                  </p>
                )}
              </Card>
            ))}
          </Card>
        ))}
      </Card>
    </Container>
  );
}

export default MenuEditor;
=======
// =============================================
// MenuEditor.jsx (Modularizado, Mantiene diseño actual)
// =============================================

import React, { useState } from "react";
import Container from "./ui/Container";
import Card from "./ui/Card";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";
import Grid from "./ui/Grid";
import Button from "./ui/Button";

// =============================================
// EDITOR DE MENÚ
// =============================================
// Mantiene EXACTAMENTE el diseño que tenías
// Solo se separa en este archivo para modularizar
// =============================================

function MenuEditor({ r, store }) {
  const { updateRestaurant } = store;

  const [categoria, setCategoria] = useState("");
  const [nuevoPlatillo, setNuevoPlatillo] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    ingredientesBase: "",
    extras: "",
    imagen: "",
  });

  if (!r) {
    return (
      <Container>
        <Card>
          <p style={{ margin: 0 }}>No hay restaurante activo.</p>
        </Card>
      </Container>
    );
  }

  // =============================================
  // Agregar Categoría
  // =============================================
  const handleAgregarCategoria = () => {
    if (!categoria.trim()) return;

    updateRestaurant(r.id, {
      menu: [
        ...r.menu,
        {
          id: "cat-" + Date.now(),
          nombre: categoria,
          platillos: [],
        },
      ],
    });

    setCategoria("");
  };

  // =============================================
  // Agregar Platillo
  // =============================================
  const handleAgregarPlatillo = (catId) => {
    if (!nuevoPlatillo.nombre.trim()) return;

    updateRestaurant(r.id, {
      menu: r.menu.map((c) =>
        c.id === catId
          ? {
              ...c,
              platillos: [
                ...c.platillos,
                {
                  id: "plt-" + Date.now(),
                  nombre: nuevoPlatillo.nombre,
                  descripcion: nuevoPlatillo.descripcion,
                  precio: Number(nuevoPlatillo.precio || 0),
                  ingredientesBase: nuevoPlatillo.ingredientesBase
                    ? nuevoPlatillo.ingredientesBase.split(",")
                    : [],
                  extras: nuevoPlatillo.extras
                    ? nuevoPlatillo.extras.split(",")
                    : [],
                  imagen: nuevoPlatillo.imagen,
                },
              ],
            }
          : c
      ),
    });

    setNuevoPlatillo({
      nombre: "",
      descripcion: "",
      precio: "",
      ingredientesBase: "",
      extras: "",
      imagen: "",
    });
  };

  return (
    <Container>
      <Card>
        <h3 style={{ marginTop: 0 }}>Categorías del Menú</h3>

        {/* AGREGAR CATEGORÍA */}
        <Grid columns={2} style={{ marginBottom: 12 }}>
          <Input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Nueva categoría"
          />
          <Button onClick={handleAgregarCategoria}>Agregar</Button>
        </Grid>

        {/* LISTA DE CATEGORÍAS */}
        {r.menu.map((cat) => (
          <Card key={cat.id} style={{ marginTop: 10 }}>
            <h4 style={{ marginTop: 0 }}>{cat.nombre}</h4>

            {/* FORM NUEVO PLATILLO */}
            <Grid columns={2} style={{ gap: 8 }}>
              <Input
                placeholder="Nombre del platillo"
                value={nuevoPlatillo.nombre}
                onChange={(e) =>
                  setNuevoPlatillo({ ...nuevoPlatillo, nombre: e.target.value })
                }
              />
              <Input
                placeholder="Precio"
                value={nuevoPlatillo.precio}
                onChange={(e) =>
                  setNuevoPlatillo({ ...nuevoPlatillo, precio: e.target.value })
                }
              />
            </Grid>

            <TextArea
              placeholder="Descripción"
              value={nuevoPlatillo.descripcion}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  descripcion: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Input
              placeholder="Ingredientes base (separados por coma)"
              value={nuevoPlatillo.ingredientesBase}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  ingredientesBase: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Input
              placeholder="Extras opcionales (separados por coma)"
              value={nuevoPlatillo.extras}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  extras: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Input
              placeholder="URL de la imagen"
              value={nuevoPlatillo.imagen}
              onChange={(e) =>
                setNuevoPlatillo({
                  ...nuevoPlatillo,
                  imagen: e.target.value,
                })
              }
              style={{ marginTop: 6 }}
            />

            <Button
              style={{ marginTop: 10 }}
              onClick={() => handleAgregarPlatillo(cat.id)}
            >
              Agregar platillo
            </Button>

            {/* LISTA DE PLATILLOS */}
            {cat.platillos.map((p) => (
              <Card key={p.id} style={{ marginTop: 10, background: "#f8fafc" }}>
                <strong>{p.nombre}</strong>
                <p style={{ fontSize: 12, margin: 0 }}>{p.descripcion}</p>
                <p style={{ fontSize: 12, margin: 0 }}>
                  <strong>Precio:</strong> ${p.precio}
                </p>
                {p.ingredientesBase?.length > 0 && (
                  <p style={{ fontSize: 12, margin: 0 }}>
                    Ingredientes: {p.ingredientesBase.join(", ")}
                  </p>
                )}
                {p.extras?.length > 0 && (
                  <p style={{ fontSize: 12, margin: 0 }}>
                    Extras: {p.extras.join(", ")}
                  </p>
                )}
              </Card>
            ))}
          </Card>
        ))}
      </Card>
    </Container>
  );
}

export default MenuEditor;
>>>>>>> 72214db204f44cb80a07559385bad53ec069f1d8

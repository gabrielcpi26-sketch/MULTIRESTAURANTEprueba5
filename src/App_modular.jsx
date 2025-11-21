// =============================================
// App.jsx (Modularizado, Limpio, Sin Cambiar Diseño)
// =============================================

import React, { useState } from "react";
import { useStore } from "./store/useStore";

// Componentes principales
import MenuEditor from "./components/MenuEditor";
import PublicMenu from "./components/PublicMenu";
import CustomizeModal from "./components/CustomizeModal";
import CheckoutModal from "./components/CheckoutModal";
import SettingsPanel from "./components/SettingsPanel";
import ReportsPanel from "./components/ReportsPanel";

// UI
import Container from "./components/ui/Container";
import HeaderBar from "./components/ui/HeaderBar";
import TabsBar from "./components/ui/TabsBar";
import RestaurantSelector from "./components/ui/RestaurantSelector";

// =============================================
// APP PRINCIPAL (Mantiene diseño original)
// =============================================

function App() {
  const store = useStore();
  const { r, tab, setTab } = store;

  const [cart, setCart] = useState([]);
  const [showCustomize, setShowCustomize] = useState(false);
  const [itemToCustomize, setItemToCustomize] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const handleStartOrder = (item, wantCustomize) => {
    if (
      wantCustomize &&
      ((item.ingredientesBase && item.ingredientesBase.length) ||
        (item.extras && item.extras.length))
    ) {
      setItemToCustomize(item);
      setShowCustomize(true);
      return;
    }

    const basePrecio = item.precio || 0;
    handleAddToCart({
      ...item,
      qty: 1,
      seleccionIngredientes: item.ingredientesBase || [],
      seleccionExtras: [],
      total: basePrecio,
    });
  };

  const handleAddCustomized = (configurado) => {
    handleAddToCart(configurado);
  };

  const handleRemoveCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSaleRegistered = (items, metodoPago) => {
    if (!r) return;
    store.closeSale(r.id, items, metodoPago);
    setCart([]);
  };

  return (
    <div>
      <HeaderBar />

      <RestaurantSelector
        restaurantes={store.restaurantes}
        activeRest={store.activeRest}
        setActiveRest={store.setActiveRest}
        addRestaurant={store.addRestaurant}
      />

      <TabsBar tab={tab} setTab={setTab} />

      {tab === "menu" && <MenuEditor r={r} store={store} />}

      {tab === "public" && (
        <Container style={{ paddingTop: 10, paddingBottom: 30 }}>
          <PublicMenu
            r={r}
            cart={cart}
            onStartOrder={handleStartOrder}
            onOpenCheckout={() => setShowCheckout(true)}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
          />
        </Container>
      )}

      {tab === "settings" && <SettingsPanel r={r} store={store} />}

      {tab === "reports" && <ReportsPanel r={r} />}

      {showCustomize && itemToCustomize && (
        <CustomizeModal
          item={itemToCustomize}
          onClose={() => {
            setShowCustomize(false);
            setItemToCustomize(null);
          }}
          onAdd={handleAddCustomized}
        />
      )}

      {showCheckout && r && (
        <CheckoutModal
          r={r}
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSaleRegistered={handleSaleRegistered}
        />
      )}
    </div>
  );
}

export default App;


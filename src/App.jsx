import React from 'react';
import './App.css';

import store from "./images/store.png"
import ProductsGallery from "./components/ProductsGallery";
import ShoppingCart from "./components/ShoppingCart";

function App() {
  return (
    <div className="app">
      <div className="app__header">
        <img src={store} alt="store" width={128}/>
        <h1>MiniMarket App</h1>
      </div>

      <div className="app__content">
        <ProductsGallery/>
        <ShoppingCart/>
      </div>
    </div>
  );
}

export default App;

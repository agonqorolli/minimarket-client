import React from 'react';
import './App.css';

import store from "./images/store.png"
import ProductsGallery from "./components/ProductsGallery";
import ShoppingCart from "./components/ShoppingCart";
import Panel from "./components/Panel";

function App() {
  return (
    <div className="app">
      <Panel className="app__header">
          <img src={store} alt="store" width={192}/>
          <h1>MiniMarket App</h1>
      </Panel>


      <div className="app__content">
        <ProductsGallery/>
        <ShoppingCart/>
      </div>
    </div>
  );
}

export default App;

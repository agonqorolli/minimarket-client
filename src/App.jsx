import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';

import store from "./images/store.png"
import ProductsGallery from "./components/ProductsGallery";
import ShoppingCart from "./components/ShoppingCart";
import Panel from "./components/Panel";

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/success">
            <div>Your order was placed successfully!</div>
          </Route>

          <Route path="/">
            <Panel className="app__header">
              <img src={store} alt="store" width={192}/>
              <h1>MiniMarket App</h1>
            </Panel>

            <div className="app__content">
              <ProductsGallery/>
              <ShoppingCart/>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

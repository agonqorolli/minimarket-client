import React from 'react';
import {useQuery, gql} from "@apollo/client";
import './App.css';

import store from "./images/store.png"

const APP_PRODUCTS = gql`
    query AppProducts {
        products {
            id
            name
            price
        }
    }
`;

function App() {
  // Queries
  const {data: {products} = {}, loading, error} = useQuery(APP_PRODUCTS);

  console.log('products', products);
  console.log('loading', loading, 'error', error);

  return (
    <div className="app">
      <div className="app__header">
        <img src={store} alt="store" width={128}/>
        <h1>MiniMarket App</h1>
      </div>
    </div>
  );
}

export default App;

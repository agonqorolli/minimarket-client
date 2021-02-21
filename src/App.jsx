import React from 'react';
import {useQuery, gql} from "@apollo/client";
import './App.css';

const APP_PRODUCTS_QUERY = gql`
    query Products {
        products {
            id
            name
            price
        }
    }
`;

function App() {
  // Queries
  const {data: {products} = {}, loading, error} = useQuery(APP_PRODUCTS_QUERY);

  console.log('products', products);
  console.log('loading', loading, 'error', error);

  return (
    <div className="app">
      MiniMarket App
    </div>
  );
}

export default App;

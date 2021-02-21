import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from "@apollo/client";
import App from './App';
import getApolloClient from "./utils/getApolloClient";
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={getApolloClient()}>
      <App/>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

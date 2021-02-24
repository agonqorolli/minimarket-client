import React, {useEffect} from 'react';
import {gql, useReactiveVar, useQuery} from "@apollo/client";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import './shopping-cart.css';
import Panel from "../Panel";
import ItemThumbnail from "../ItemThumbnail";
import {createdOrderVar} from "../../utils/cache";
import Button from "../Button";

export const SHOPPING_GALLERY = gql`
    query ShoppingCart($id: ID!) {
        order(id: $id) {
            id
            items {
                id
                order_id
                product {
                    id
                    name
                    price
                    image
                    stripe_price
                }
                unit_price
                quantity
                total
            }
            total
        }
    }
`;

let stripePromise;

function getStripe(publishableKey) {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

function ShoppingCart() {
  // Reactive Variables
  const createdOrder = useReactiveVar(createdOrderVar);

  // Queries
  const {data: {order} = {}, loading, error} = useQuery(SHOPPING_GALLERY, {
    skip: !createdOrder,
    variables: {
      id: createdOrder && createdOrder.id
    }
  });

  // Functions
  async function handleOnBuyClick(event) {
    event.preventDefault();

    const BASE_PATH = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'something else'

    getStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_TEST_KEY).then(stripe => {
      stripe.redirectToCheckout({
        mode: "payment",
        lineItems: order ? order.items.map(item => {
          return {
            price: item.product.stripe_price,
            quantity: item.quantity
          };
        }) : [],
        successUrl: `${BASE_PATH}/success`,
        cancelUrl: BASE_PATH,
      }).then(result => {
        console.log('result', result)
      }).catch(error => {
        console.log('error', error)
      });
    });
  }

  return (
    <Panel className="shopping-cart">
      <div className="shopping-cart__title">
        <h2>Shopping Cart</h2>
        {(!order || (order && !order.items.length)) && <small>No Items Added in the Cart!</small>}
      </div>

      <div className="shopping-cart__masonry">
        {order && order.items.map(item => <ItemThumbnail key={item.id} item={item}/>)}
      </div>

      {order && !!order.items.length && (
        <Panel className="shopping-cart__buy">
          <h3>{`Total: ${order.total}€`}</h3>
          <Button label="Buy" onClick={handleOnBuyClick}/>
        </Panel>
      )}
    </Panel>
  );
}

export default ShoppingCart;

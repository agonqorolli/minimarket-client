import React, {useEffect} from 'react';
import {gql, useReactiveVar, useQuery} from "@apollo/client";
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
                }
                unit_price
                quantity
                total
            }
            total
        }
    }
`;

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
  function handleOnBuyClick() {
  }

  return (
    <Panel loading={loading} className="shopping-cart">
      <div className="shopping-cart__title">
        <h2>Shopping Cart</h2>
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

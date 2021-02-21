import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";
import './product-thumbnail.css';
import Panel from "../Panel";

const PRODUCT_THUMBNAIL_CREATE_ORDER = gql`
    mutation ProductThumbnailCreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            id
            customer_id
            # customer: Customer
            # items: [Item]
            total
            completed
        }
    }
`;

const PRODUCT_THUMBNAIL_CREATE_ITEM = gql`
    mutation ProductThumbnailCreateItem($input: CreateItemInput!) {
        createItem(input: $input) {
            id
            order_id
            product_id
            # product: Product
            quantity
            unit_price
            total
        }
    }
`;

// Authenticating customer is out of the scope of this task
const CUSTOMER_ID = 1;

function ProductThumbnail({product}) {
  // States
  const [quantity, setQuantity] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Mutations
  const [createOrderMutation] = useMutation(PRODUCT_THUMBNAIL_CREATE_ORDER);
  const [createItemMutation] = useMutation(PRODUCT_THUMBNAIL_CREATE_ITEM);

  // Functions
  function handleQuantityChange({target}) {
    setQuantity(parseInt(target.value, 10));
  }

  function createOrder() {
    return createOrderMutation({
      variables: {
        input: {
          customer_id: CUSTOMER_ID,
          total: quantity * product.price,
        }
      }
    })
  }

  function createItem(order) {
    return createItemMutation({
      variables: {
        input: {
          order_id: order.id,
          product_id: product.id,
          quantity,
          unit_price: product.price,
          total: quantity * product.price,
        }
      }
    })
  }

  function onAddToCartClick() {
    createOrder().then(({data}) => {
      const {createOrder: createdOrder} = data;
      setCurrentOrder(createdOrder);
      createItem(createdOrder);
    })
  }

  return (
    <Panel className="product-thumbnail">
      <span>{`Name: ${product.name}`}</span>
      <span>{`Price: ${product.price}€`}</span>
      <label htmlFor="quantity">Quantity:</label>
      <input type="number" value={quantity} onChange={handleQuantityChange} min={0}/>
      <button type="button" onClick={onAddToCartClick}>Add to cart</button>
    </Panel>

  );
}

export default ProductThumbnail;

import React, {useState} from 'react';
import {gql, useMutation, useReactiveVar, useApolloClient} from "@apollo/client";
import './product-thumbnail.css';
import Panel from "../Panel";
import {createdOrderVar} from "../../utils/cache";
import {SHOPPING_GALLERY} from "../ShoppingCart";
import Button from "../Button";

const PRODUCT_THUMBNAIL_CREATE_ORDER = gql`
    mutation ProductThumbnailCreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            id
            customer_id
            items {
                id
            }
            total
        }
    }
`;

const PRODUCT_THUMBNAIL_UPDATE_ORDER = gql`
    mutation ProductThumbnailUpdateOrder($input: UpdateOrderInput!) {
        updateOrder(input: $input) {
            id
            total
        }
    }
`;

const PRODUCT_THUMBNAIL_CREATE_ITEM = gql`
    mutation ProductThumbnailCreateItem($input: CreateItemInput!) {
        createItem(input: $input) {
            id
            order_id
            product_id
            quantity
            unit_price
            total
        }
    }
`;

// Authenticating customers is out of the scope of this task
const CUSTOMER_ID = 1;

function ProductThumbnail({product}) {
  // Reactive Variables
  const createdOrder = useReactiveVar(createdOrderVar);

  // Apollo Client
  const client = useApolloClient();

  // States
  const [quantity, setQuantity] = useState(0);

  // Mutations
  const [createOrderMutation] = useMutation(PRODUCT_THUMBNAIL_CREATE_ORDER);
  const [updateOrderMutation] = useMutation(PRODUCT_THUMBNAIL_UPDATE_ORDER);
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

  function updateOrder(order) {
    return updateOrderMutation({
      variables: {
        input: {
          id: order.id,
          total: order.total + (quantity * product.price),
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
    }).then(({data}) => {
      const {createItem: newItem} = data;

      const query = client.readQuery({
        query: SHOPPING_GALLERY,
        variables: {
          id: order.id,
        },
      })

      client.writeQuery({
        query: SHOPPING_GALLERY,
        variables: {
          id: order.id,
        },
        data: {
          order: {
            ...query.order,
            items: [...query.order.items, newItem],
          },
        },
      });

      setQuantity(0);
    })
  }

  function onAddToCartClick() {
    if (createdOrder) {
      updateOrder(createdOrder)
        .then(() => {
          createItem(createdOrder)
        })
    } else {
      createOrder()
        .then(({data}) => {
          const {createOrder: newOrder} = data;
          createdOrderVar(newOrder);
          createItem(newOrder)
        })
    }
  }

  return (
    <Panel className="product-thumbnail">
      <div className="product-thumbnail__row">
        <img src={product.image} alt={product.name} height={100}/>
      </div>

      <div className="product-thumbnail__row">
        <span>Name:</span>
        <span>{product.name}</span>
      </div>

      <div className="product-thumbnail__row">
        <span>Price:</span>
        <span>{product.price}€</span>
      </div>

      <div className="product-thumbnail__row">
        <label htmlFor="quantity">Quantity:</label>
        <input type="number" value={quantity} onChange={handleQuantityChange} min={0}/>
      </div>

      <div className="product-thumbnail__cta">
        <Button label="Add to Cart" disabled={!quantity} onClick={onAddToCartClick}/>
      </div>
    </Panel>
  );
}

export default ProductThumbnail;

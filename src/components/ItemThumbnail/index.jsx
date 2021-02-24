import React, {useState} from 'react';
import {gql, useApolloClient, useMutation} from "@apollo/client";
import './item-thumbnail.css';
import Panel from "../Panel";
import {SHOPPING_GALLERY} from "../ShoppingCart";
import Button from "../Button";
import {createdOrderVar} from "../../utils/cache";

const ITEM_THUMBNAIL_UPDATE_ORDER = gql`
    mutation ItemThumbnailUpdateOrder($input: UpdateOrderInput!) {
        updateOrder(input: $input) {
            id
            total
        }
    }
`;

const ITEM_THUMBNAIL_DELETE_ITEM = gql`
    mutation ItemThumbnailDeleteItem($id: ID!) {
        deleteItem(id: $id)
    }
`;

function ItemThumbnail({item}) {
  // Apollo Client
  const client = useApolloClient();

  // Mutations
  const [updateOrderMutation] = useMutation(ITEM_THUMBNAIL_UPDATE_ORDER);
  const [deleteItemMutation] = useMutation(ITEM_THUMBNAIL_DELETE_ITEM);

  // Functions
  function updateOrder(order) {
    return updateOrderMutation({
      variables: {
        input: {
          id: order.id,
          total: order.total - item.total,
        }
      }
    })
  }

  function onRemoveFromCartClick() {
    deleteItemMutation({
      variables: {
        id: item.id,
      }
    }).then((result) => {
      if (result) {
        const query = client.readQuery({
          query: SHOPPING_GALLERY,
          variables: {
            id: item.order_id,
          },
        })

        client.writeQuery({
          query: SHOPPING_GALLERY,
          variables: {
            id: item.order_id,
          },
          data: {
            order: {
              ...query.order,
              items: [...query.order.items.filter((i => i.id !== item.id))],
            },
          },
        });

        updateOrder(query.order)
          .then(({data}) => {
            const {updateOrder: updatedOrder} = data;
            createdOrderVar(updatedOrder);
          });
      }
    });
  }

  return (
    <Panel className="item-thumbnail">
      <div className="item-thumbnail__row">
        <span>Name:</span>
        <span>{item.product.name}</span>
      </div>
      <div className="item-thumbnail__row">
        <span>Unit Price:</span>
        <span>{item.unit_price}€</span>
      </div>
      <div className="item-thumbnail__row">
        <span>Quantity:</span>
        <span>{item.quantity}</span>
      </div>
      <div className="item-thumbnail__row">
        <span>Total:</span>
        <span>{item.total}€</span>
      </div>

      <div className="item-thumbnail__cta">
        <Button label="Remove from Cart" onClick={onRemoveFromCartClick}/>
      </div>
    </Panel>
  );
}

export default ItemThumbnail;

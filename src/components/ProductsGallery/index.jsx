import React from 'react';
import {gql, useQuery} from "@apollo/client";
import './products-gallery.css';
import Panel from "../Panel";
import ProductThumbnail from "../ProductThumbnail";

const PRODUCTS_GALLERY = gql`
    query ProductsGallery {
        products {
            id
            name
            price
        }
    }
`;

function ProductsGallery() {
  // Queries
  const {data: {products} = {}, loading, error} = useQuery(PRODUCTS_GALLERY);

  return (
    <Panel loading={loading} className="products-gallery">
      <div className="products-gallery__title">
        <h2>Products Gallery</h2>
      </div>

      <div className="products-gallery__masonry">
        {products && products.map(product => <ProductThumbnail key={product.id} product={product}/>)}
      </div>
    </Panel>

  );
}

export default ProductsGallery;

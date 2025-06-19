import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCart from "../components/ProductCart";

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [fillterProducts, setFillterProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFillterProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFillterProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col w-max items-end">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primery rounded-full "></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6  lg:grid-cols-5 mt-6">
        {fillterProducts
          .filter((product) => product.inStock)
          .map((product, index) => (
            <ProductCart key={index} product={product}/>
          ))}
      </div>
    </div>
  );
};

export default AllProducts;

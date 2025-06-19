import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { categories } from "../assets/assets";
import ProductCart from "../components/ProductCart";

const ProductCategory = () => {
  const { category } = useParams();
  const { products } = useAppContext();
  const searchCaregory = categories.find(
    (item) => item.path.toLowerCase() === category
  );
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );
  return (
    <div className="mt-16">
      {searchCaregory && (
        <div className="flex flex-col w-max items-end">
          <p className="text-2xl font-medium">
            {searchCaregory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primery rounded-full"></div>
        </div>
      )}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 ">
          {filteredProducts.map((product) => (
            <ProductCart key={product._id} product={product} />
          ))}
        </div>
      ) : (
        (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <p className="text-primery text-2xl font-medium">no products found in this categories</p>
          </div>
        )
      )}
    </div>
  );
};

export default ProductCategory;

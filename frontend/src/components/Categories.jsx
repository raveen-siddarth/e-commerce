import React from "react";
import { assets, categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-16 ">
      <p className="text-2xl md:text-3xl font-medium">Categoties</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6 mt-6">
        {categories.map((category, index) => (
          <div
            key={index}
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
                navigate(`/products/${category.path.toLocaleLowerCase()}`);
                scrollTo(0,0);
            }}
            className="group cursor-pointer gap-2 py-5 px-3 flex flex-col items-center justify-center"
          >
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-108 max-w-28 transition"
            />
            <p className="text-sm font-medium">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyOrders } from "../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const {currency, axios, user} = useAppContext()

  const fetchMyOrders = async () => {
    try {
      const {data} = await axios.get('/api/order/user')
      if (data.success) {
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
    
  }, [user]);

  return (
    <div className="mt-16 pb-16">

      <div className="flex flex-col w-max mb-8 items-end">
        <p className=" text-2xl uppercase font-medium">My orders</p>
        <div className="h-0.5 w-16 bg-primery rounded "></div>
      </div>

      {myOrders.map((order, index) => (
        <div
          key={index}
          className=" border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex  justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId : {order._id}</span>
            <span>Payment : {order.paymentType}</span>
            <span>Amount : ₹{order.amount}</span>
            </p>
            {order.items.map((item, index) => (
              <div
                key={index}
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== index + 1 && "border-b"
                }border-gray-300 flex flex-col md:flex-row md:items-center justify-center
                 p-4 py-5 md:gap-16 w-full max-w-4xl`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-primery/10 p-4 rounded-lg">
                    <img
                      src={item.product.image[0]}
                      alt=""
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {item.product.name}
                    </h2>
                    <p>{item.product.category}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                  <p>Quantity : {item.quantity || "1"}</p>
                  <p>Status : {order.status}</p>
                  <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-primery text-lg font-medium">
                  Amount : ₹{item.product.offerPrice * item.quantity}
                </p>
              </div>
            ))}
          
        </div>
      ))}
    </div>
  );
};

export default MyOrders;

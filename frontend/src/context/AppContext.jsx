import { createContext, useContext, useRef, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(Boolean);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const isInitialCartLoad = useRef(true);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [sellerToken, setSellerToken] = useState(localStorage.getItem("sellerToken") || "");

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Sync sellerToken with localStorage
  useEffect(() => {
    if (sellerToken) {
      localStorage.setItem("sellerToken", sellerToken);
    } else {
      localStorage.removeItem("sellerToken");
    }
  }, [sellerToken]);

  // Request interceptor to automatically set headers
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        if (sellerToken) {
          config.headers["x-seller-token"] = sellerToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token, sellerToken]);

  ///featch seller status
  const featchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
      console.log(error.message);
    }
  };

  //featch userauth statues ,User data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (error) {
      setUser(null);
    }
  };

  // fetch all Product
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.product(data.message);
      }
    } catch (error) {
      toast.product(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    featchSeller();
    fetchProducts();
  }, []);

  //update database cart items

  useEffect(() => {
    if (isInitialCartLoad.current) {
      isInitialCartLoad.current = false;
      return; //  Skip first update
    }

    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (data.success) {
          toast.success(data.message);
          // console.log("Sending cartItems to DB:", cartItems);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);
  // add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    try {
      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }
      setCartItems(cartData);
      toast.success("added to cart");
      // console.log(cartItems);
    } catch (error) {
      console.log(error.message);
    }
  };
  //update cart item qualuty
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("cart Updated");
  };
  //remove products from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("removed from cart");
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    updateCartItem,
    setShowUserLogin,
    addToCart,
    products,
    currency,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems,
    token,
    setToken,
    sellerToken,
    setSellerToken,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

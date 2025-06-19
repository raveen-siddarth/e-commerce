import react, { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/assets";
import toast from "react-hot-toast";


const Cart = () => {
    
    const {products, cartItems,getCartAmount, axios ,user ,setCartItems , removeFromCart, getCartCount,updateCartItem, navigate} = useAppContext();

    const [cartArray, setCartArray] = useState([])
    
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAdress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

    const placeOrder = async () =>{
        try {
            if (!selectedAddress) {
                return toast.error("please select an address")
            }

            //placeOrder with cod
            if(paymentOption ==="COD"){
                const {data} = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id
                })

                if (data.success) {
                    toast.success(data.message)
                    setCartItems({})
                    navigate('/my-orders')
                }else{
                    toast.error(data.message)
                }
            }else{

                // if (isPlacingOrder) return; // prevent double submission
                // setIsPlacingOrder(true);
              
                

                //     const { data: keyData } = await axios.get("/api/order/getKey");
                //     const { key } = keyData;
                //   const res = await axios.post("/api/order/stripe", {
                //     userId: user._id,
                //     items: cartItems,
                //     address: selectedAddress,
                //   });
              
                //   console.log("Stripe API Response:", res.data);
              
                //   if (res.data.success) {
                //     const order = res.data.order;
              
                //     const options = {
                //       key,
                //       amount: order.amount,
                //       currency: "INR",
                //       name: "VijiFancy",
                //       order_id: order.id,
                //       handler: function (response) {
                //         toast.success("Payment successful!");
                //         navigate("/my-orders");
                //       },
                //       prefill: {
                //         name: user.name,
                //         email: user.email,
                //       },
                //     };
              
                //     const razorpay = new window.Razorpay(options);
                //     razorpay.open();
                //   } else {
                //     toast.error("Failed to place order: " + res.data.message);
                //   }
           

            } 
           
        } catch (error) {
            toast.error(error.message)
            console.log(error.message);
            
        }
    }

    const getCart = ()=>{
        let tempArray= []
        for( const key in cartItems){
            const product = products.find((item)=>item._id===key);
            product.quantity = cartItems[key]
            tempArray.push(product);
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async () => {
        try {
            const {data} = await axios.get('/api/address/get');
            if (data.success) {
                 
                
                setAddresses(data.addresses)
               
                if (data.addresses.length > 0) {
                    setSelectedAdress(data.addresses[0])
                }
            }else{
                toast.error(data?.message || "Failed to fetch addresses");
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(products.length> 0 && cartItems){
            getCart()
        }
    },[products, cartItems])

    useEffect(()=>{
        if(user){
            getUserAddress()
            
        }
        
    }, [user])

   

    return products.length> 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primery">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=>{navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.Weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select onChange={e => updateCartItem(product._id, Number(e.target.value))} value={cartItems[product._id]} className='outline-none'>
                                            {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">₹{product.offerPrice * product.quantity}</p>
                        <button onClick={()=>removeFromCart(product._id)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="" className="inline-block w-6 h-6"/>
                        </button>
                    </div>)
                )}

                <button onClick={()=>{navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primery font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="" className="group-Hover:-translate-x-1 transition"/>
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, 
                        ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                        <button onClick={() => {setShowAddress(!showAddress);
                            console.log("Show Address:", !showAddress);
                        }} className="text-primery hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address)=>(
                                    <p  key={address._id} onClick={() => {setSelectedAdress(address);setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                   {`${address.street} ${address.city}, ${address.state}, ${address.country}`} 
                                </p>)) }


                                <p onClick={() => navigate("/add-address")} className="text-primery text-center cursor-pointer p-2 hover:bg-primery/10">
                                    Add address
                                </p>
                            </div>
                        )}
   
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e=> setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>₹{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>₹{getCartAmount()*2/100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>₹{getCartAmount()+getCartAmount()*2/100}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primery text-white font-medium hover:bg-primery-dull transition">
                    {paymentOption==="COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null;
}

export default Cart;
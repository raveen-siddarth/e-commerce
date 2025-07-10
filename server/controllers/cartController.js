import User from "../models/user.js"


export const updateCart = async (req, res) => {
    try {
      const { cartItems } = req.body;
      const userId = req.userId;
  

  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { cartItems },
        { new: true }
      );
  
      console.log("📦 [Backend] DB cart after update:", updatedUser.cartItems);
  
      res.json({ success: true, message: "cart updated" });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  


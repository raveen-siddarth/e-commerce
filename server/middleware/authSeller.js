import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
    let token = req.cookies.sellerToken;
    
    if (!token && req.headers["x-seller-token"]) {
        token = req.headers["x-seller-token"];
    }
    
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            token = authHeader;
        }
    }
    
    if(!token){
        return res.json({success: false, message: "not Authorized"})
    }
    try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
             
            req.body = req.body || {};
    
            if(tokenDecode.email === process.env.SELLER_EMAIL){
                next();
            }else{
                return res.json({success: false, message: "Not authorized"})
            }
            
        } catch (error) {
            console.log("error", error.message);
            
            return res.json({success: false, message: error.message})
        }
}

export default authSeller;
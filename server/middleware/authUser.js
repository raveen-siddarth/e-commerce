import jwt from "jsonwebtoken"

// const authUser = async (req, res, next)=>{
//     const {token} = req.cookies;

//     if(!token){
//         return res.json({success: false, message: "Not authorized: no token"})
//     }

//     try {
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
         
//         req.body = req.body || {};

//         if(tokenDecode.id){
//             req.body.userId = tokenDecode.id;
//         }else{
//             return res.json({success: false, message: "Not authorized"})
//         }
//         next();
//     } catch (error) {
//         console.log(error.message);
        
//         return res.json({success: false, message: error.message})
//     }
// }


const authUser = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  }

  if (!token) {
    return res.json({ success: false, message: "Not authorized: no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.json({ success: false, message: "Invalid token" });
    }

    req.userId = decoded.id; // works with all routes: GET, POST etc.
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.json({ success: false, message: "Token verification failed" });
  }
};

export default authUser;



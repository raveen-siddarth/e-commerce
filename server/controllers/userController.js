
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

        //register user :  api/
        
    export const register = async (req, res)=>{
        try {
          const {name, email, password} = req.body;

          if(!name || !email || !password){
            return res.json({success: false, message: "missing details"})
          }

          const existingDetails = await User.findOne({email});

          if(existingDetails){
            return res.json({success: false, message: "user already registered "})
          }

          //password encription
          const hashedPassword = await bcrypt.hash(password, 10)

          const user = await User.create({name, email, password: hashedPassword})

          //CREATING TOCKEN
          const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

          res.cookie('token', token, {
            httpOnly: true, //prevent js to access the cookie
            secure: true, //use secure cookie in production
            sameSite:  "none", //CSRF protection
            maxAge: 7 *24 *60 *60 *1000,

          })

          return res.json({success: true, user: {email: user.email, name: user.name} })
        } catch (error) {
            console.log(error.message);
            
            res.json({success: false, message: error.message });
        }
    }

    // login user : /api/user/login

export const login = async (req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({success: false , message: "email and password are reqired"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.json({success: false , message: "invalid email and password"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false , message: "invalid email and password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie('token', token, {
            httpOnly: true, //prevent js to access the cookie
            secure: true, //use secure cookie in production
            sameSite:  "none", //CSRF protection
          maxAge: 7 *24 *60 *60 *1000,

        })

        return res.json({success: true, user: {email: user.email, name: user.name} })
    } catch (error) {
        
        console.log(error.message);    
        res.json({success: false, message: error.message });

    }
} 

//check autherization : /api/user/is-auth

export const isAuth = async (req,res)=>{
    try {
        const {userId} = req.body;

        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
        
    }
}

//check autherization : /api/user/logout

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true, //prevent js to access the cookie
            secure: true, //use secure cookie in production
            sameSite:  "none", //CSRF protection
        })

        return res.json({success: true, message:"logged out"})

    } catch (error) {
        console.log(error.message);
        res.json({success: true, message: error.message});
        
    }
}
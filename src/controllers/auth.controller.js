import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.js";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */
/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Server error
 */
const register=async(req,res)=>{
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Missing fields are required" });
    }
        const {userName,email,password}=req.body
        if(!userName || !email || !password){
            return res.status(400).json({message:"Missing fileds are required"})
        }
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
     if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
         const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }
         const newUser = await User.create({ userName, email, password });
const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles,
      createdAt: newUser.createdAt,
    };
        return res.status(201).json({message:"User register successfully",user:userResponse})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
}
/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Server error
 */
const login=async(req,res)=>{
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Missing fields are required" });
    }
        const {email,password}=req.body
        if(!email || !password){
            return res.status(404).json({message:"missing fields are required"})
        }
          const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }
       const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }
    const token=generateToken(user)
   const userResponse={
    id: user._id,
    userName: user.userName,
    email: user.email,
    role: user.roles
}

     res.cookie("token", token, {
      httpOnly: true,       
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",  
      maxAge: 24 * 60 * 60 * 1000 
    });
 return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: userResponse
    });
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message });
    }
}
/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */

const logout=async(req,res)=>{
    try {
         res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({ success: true, message: "Logout successful." });
    } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
    }
}
/**
 * @swagger
 * /api/v1/currentUser:
 *   get:
 *     summary: Get the currently logged in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user info fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const currentUser=async(req,res)=>{
    try {
        console.log(req.user)
        const user=await User.findById(req.user.id).select("-password")
        if(!user){
               return res.status(404).json({ success: false, message: "User not found" });
        }
          res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}
export{
    register,
    login,
    logout,
    currentUser
}
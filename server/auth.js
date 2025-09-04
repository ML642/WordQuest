const express = require("express");
const router = express.Router();
const User = require("./models/User");
const connectDB = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require('dotenv').config();
connectDB();

router.post("/api/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            console.log(username, password, email);
            console.log("All fields are required");
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(username, password, email);
            console.log("Email already registered");
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        console.log(newUser);
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: `Error registering user  ${error}` });
    }
});

router.post ("/api/login" ,  async ( req , res ) => 
{
    try {
       const {email, password } = req.body  ; 
       if(!email || !password) {
        return res.status(400).json ({message : "Email and password are required"}) ;
       }
       const user = await User.findOne({email})
       if(!user) {
        return res.status(400).json ({message : "Ivalid email or password"}) ;
       }
       const hashedPassword = await bcrypt.hash(password, 10);
       console.log(hashedPassword)

       const isMatch = await bcrypt.compare(password , user.password ) ;  
       console.log( password , user.password )
       if (!isMatch ){
        return res.status(400).json ({message : "Invalid email or pasword"}) ;
       }
       const token = jwt.sign (
        {userId : user._id , username : user.username} ,
        process.env.JWT_SECRET  || "secret_key " ,
        {expiresIn : "1h"}
       )
       
       res.status(201).json ({
        success:true ,
        message : "Login successful" , 
        token  , 
        user : {id : user._id , username : user.username , email : user.email }
     }) ;
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in user" });
    }

})

router.get("/api/userInfo" , async  ( req, res )=> 
{
    const authHeader = req.headers.authorization ;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json ({message : "Authorization header missing or malformed"}) ;
    }
    const token = authHeader.split(" ")[1] ; 
    try {
        const decoded = jwt.verify (token , process.env.JWT_SECRET || "secret_key") ;
        const user = await User.findById (decoded.userId).select ("-password") ;
        if(!user) {
            return res.status(404).json ({message : "User not found"}) ;
        }
        res.json ({user}) ;
    }
    catch (error) {
        console.error("Error fetching user info:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }

}
)










module.exports = router ;
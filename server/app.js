require('dotenv').config();
const express = require ("express") ;
const jwt = require ("jsonwebtoken") ;
const cors = require ("cors") ;
const connectDB = require ("./database") ;
const Word = require ("./models/words") ;
const allowedOrigins =  ['http://localhost:3000', 'http://localhost:5000'];
const Auth = require ("./auth") ;
const Oauth = require ("./Oauth") ;

const PORT  = 5000 ; 

const app =  express() ; 


const listEndpoints = require('express-list-endpoints');
app.use ((req,res,next )=>{
    console.log("incoming request : " + req.method + " " + req.url )
    next(); 
})

app.get("/" , (req , res ) => {
    res.send("API is running")
})

connectDB() ; 

const corsOptions = { 
    origin : (origin , callback )=>{
        if(!origin )return callback (null , true ) ;
        if(allowedOrigins.includes(origin)){
             callback (null , true ) ; 
        }
        else {
            callback ( new Error ("Origin not allowed by CORS")) ;
        }

    },
    methods : ["GET" , "POST" , "PUT" , "DELETE"] ,
    credentials : true ,
    
}


app.use (cors(corsOptions ))

app.use (express.json()) ;
app.get('/api/words', async (req, res) => {
  const words = await Word.find();
  res.json(words);
});
app.use (Auth) ;
app.use (Oauth) ;


app.post('/api/words', async (req, res) => {
  const newWord = new Word(req.body);
  await newWord.save();
  res.json(newWord);
});








app.listen(PORT  , ()=>{
    console.log("available enpoints :" ,  listEndpoints(app) )
    console.log("server is running on port " + PORT )
})
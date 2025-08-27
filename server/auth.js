const express = require ("express") ; 
const router = express.Router () ; 
const connectDB = require ("./database") ;

connectDB() ; 


router.post ("/api/register" , (req , res ) => 
{
    const {username ,password , email } =  req.body ;

    if( !username || !password || !email )
    {
        return res.status (400).json ({ message : "All fields are required "}) ;
    }
    
    
    
}
)













module.exports = router ;
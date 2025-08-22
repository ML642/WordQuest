

const app =  require ("express")() ; 


app.get("/" , (req , res ) => {
    res.send("API is running")
})


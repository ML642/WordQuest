import {useState} from "react"
import styles from "./header.module.css"
import  {Link}  from "react-router"
const Header = () => {
    return (

        <header className= {styles.container}>
            <div className = {styles.logo}> STOP  </div>
            <navigator>
                     <Link to ="/" >Home </Link>
                     <Link to ="/WordArch" >Word Archive </Link>
                     <Link to ="/About" >About </Link>
                
            </navigator> 
    
        </header>
    )
}


export default Header ; 

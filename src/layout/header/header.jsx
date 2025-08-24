import {useState} from "react"
import styles from "./header.module.css"
import  {Link}  from "react-router"
import {motion} from "framer-motion"




const Header = () => {
    return (

        <header className= {styles.container}>
            <motion.div  
            initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }} > 
            <div className = {styles.logo}> Voc&M  </div>
            </motion.div>
            <navigator className ={styles.navigator}>
                   <motion.div       
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0, duration: 0.4 }}>
                        <Link className={styles.Link} to ="/" >Home </Link>
                    </motion.div>      
                  <motion.div       
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.2 }}>
                        <Link className={styles.Link} to ="/WordArch" >Word Archive </Link>
                    </motion.div>      
                      <motion.div       
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}>
   <Link className={styles.Link} to ="/About" >About </Link>           
            </motion.div>   
                    
            </navigator> 
            <motion.div 
            initial={{ x : 50 , opacity : 0 }}
                animate={{ x : 0 , opacity : 1 }}
                transition={{ delay : 0.6 , duration : 0.4 }}> 
                <div className = {styles.loginButton}>  LOGIN   </div> 
            </motion.div>
           
            
        </header>
    )
}


export default Header ; 

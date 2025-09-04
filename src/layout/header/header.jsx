import {useState} from "react"
import styles from "./header.module.css"
import  {Link}  from "react-router"
import {motion} from "framer-motion"
import {jwtDecode} from "jwt-decode"

const LoggedIn = () => {
    const token = localStorage.getItem("token") ; 
    const [dropdown , setDropdown] = useState(false)

    const decoded = jwtDecode(token) ;
    console.log(decoded) ; 
    return (
        <div className={ styles.isLoggedIn} onClick = {() => {setDropdown(true)}} >
           <div className = {styles.userIcon}>  </div>    
           <div className = {styles.userName}> {decoded.userName} </div> 
               {dropdown && <div className={styles.dropdown} onClick={() => {setDropdown(false)}} >
               
               <motion.div className={styles.dropdownItem} initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }} >  
                <Link  to ="/Profile" > Profile </Link>
                </motion.div>
                 
                 <motion.div className={styles.dropdownItem} 
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}  >    
                          <Link to ="/Settings" > Settings </Link> 
                 </motion.div>
                 
                
                 <div className={styles.dropdownItem} onClick={() => {
                localStorage.removeItem("token") ; 
                window.location.reload() ; 
               }}> Logout </div>
             </div>
             }
        </div>
    )
}




const Header = () => {
    const [isLoggedIn ,  setIsLoggedIn] = useState(false) ; 

    const token = localStorage.getItem("token") ; 

    if(token && !isLoggedIn ) {
        setIsLoggedIn(true) ;
    }
    

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
               { !isLoggedIn ? <Link to="/Login" > <div className = {styles.loginButton}>  LOGIN   </div>  </Link>:
               <LoggedIn />
               }
            </motion.div>
           
            
        </header>
    )
 }


export default Header ; 

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
        <div className={ styles.isLoggedIn} onClick = {() => {setDropdown((prev)=>!prev)}} >
           <div className = {styles.userIcon}>  </div>    
           <div className = {styles.userName}> {decoded.userName} </div> 
               {dropdown && <div className={styles.dropdown} onClick={() => {setDropdown(false)}} >
               
               <motion.div className={styles.dropdownItem} initial={{ x: -40, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0, duration: 0.3 }} >  
                <Link  to ="/Profile" > Profile </Link>
                </motion.div>
                 
                 <motion.div className={styles.dropdownItem} 
                    initial={{ x: 40, opacity: 1  }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}  >    
                          <Link to ="/Settings" > Settings </Link> 
                 </motion.div>
                 
                
                 <div className={styles.dropdownItem} onClick={() => {
                localStorage.removeItem("token") ; 
                window.location.reload() ; 
               }}> Logout </div>

                                        <div
                        style={{ position : "relative" , bottom : "30px" , right:"-5px"}}
                        onClick = {(e) => {e.stopPropagation() ; setDropdown((prev)=>!prev) ; }}
                        className={`w-full py px-4 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors duration-150 border-t border-gray-200`}
                        aria-label="Close dropdown"
                        >
                        <svg
                            width="120"
                            height="38"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M7 14L12 9L17 14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            />
                        </svg> 
                        </div>
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

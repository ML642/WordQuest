import { useState , useEffect , useRef } from 'react';
import styles from './Login.module.css';
import { Link } from "react-router"
import axios from "axios"
import GoogleOauth from './Oauth';

 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] =  useState(false) ; 
  const errorRef =  useRef(null) ;

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
    const Response  =  await axios.post("http://localhost:5000/api/login", 
        {
            email : formData.email , 
            password : formData.password
        }
        , {
            headers : {
                "Content-Type" : "application/json"
            }
        }
    ) 
    if (Response.status === 201 ) {
        localStorage.setItem ("token" , Response.data.token ) ;
        localStorage.setItem ("user" , JSON.stringify (Response.data.user)) ;
    }
 }
    catch (error) {
        if (error.status === 400 ) {
            setError(false);          // reset first
            setTimeout(() => setError(true), 0);
            console.log(error) ;
           // alert ( error.response.data.message ) ;
        }
        console.log('Login error:', error);
    }
     await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Login:', formData);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <div className={styles.inputHighlight}></div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <div className={styles.inputHighlight}></div>
            </div>
          </div>
        {error && <div style={{fontSize:"1.1rem" , color:"red",marginBottom:"20px" , position:"relative" } }className = {styles.shake} ref={errorRef}>   Invalid password or email </div>}

          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className={styles.forgotPassword}>
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className={`${styles.button} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
            onClick={()=>{ if (errorRef.current){errorRef.current.classList.remove(styles.shake);
      void errorRef.current.offsetWidth; // force reflow
      errorRef.current.classList.add(styles.shake);}}}
          >
            <span className={styles.buttonText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </span>
            <div className={styles.buttonHighlight}></div>
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account? 
            <Link to="/Registration" className={styles.link}> Create one now</Link>
          </p>
        </div>
         
        <div className={styles.socialLogin}>
          <p className={styles.socialText}>Or continue with</p>
          <div className={styles.socialButtons}>
             <GoogleOauth/>
         
            <button className={`${styles.socialButton} ${styles.github}`}>
              <svg viewBox="0 0 25 24">
                <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.5-1.26-1.21-1.6-1.21-1.6-.98-.67.08-.66.08-.66 1.09.08 1.67 1.12 1.67 1.12.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.69-1.45-2.42-.27-4.96-1.21-4.96-5.4 0-1.19.42-2.17 1.12-2.93-.11-.28-.49-1.38.11-2.87 0 0 .92-.29 3 1.12.87-.24 1.8-.36 2.73-.37.93 0 1.86.13 2.73.37 2.08-1.41 3-.12 3-.12.6 1.49.22 2.59.11 2.87.7.76 1.12 1.74 1.12 2.93 0 4.2-2.55 5.13-4.98 5.4.39.34.74 1.01.74 2.03v3.01c0 .29.19.63.74.53A11 11 0 0012 1.27" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
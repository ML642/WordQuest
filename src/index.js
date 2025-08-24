import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter ,RouterProvider } from 'react-router';
import Home from "./pages/Home/home.jsx"
import WordArch from './pages/Word_Arch/wordArch.jsx';
import Header from './layout/header/header.jsx';
import Footer from './layout/footer/footer.jsx';


const AppLayout = (props) => {
   return (
      <div>
         <Header/>
          {props.component}
         <Footer/>
      </div>
   )
    
}
const Login = () => {
    return (
        <div>Login Page</div>
    )
}


const route = createBrowserRouter([
   {path : "/" , element :<AppLayout component={<Home/>} />} , 
   {path : "/WordArch" , element : <AppLayout component={<WordArch/>}/>},
   {path : "/Login" , element : <AppLayout component={<Login/>}/>}

])



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

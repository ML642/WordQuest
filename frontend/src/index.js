import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './pages/Home/homeScrollbar.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter ,RouterProvider, useLocation } from 'react-router';
import Home from "./pages/Home/home.jsx"
import WordArch from './pages/Word_Arch/wordArch.jsx';
import Collocations from './pages/Collocations/collocations.jsx';
import Testing from './pages/Testing/testing.jsx';
import Header from './layout/header/header.jsx';
import Footer from './layout/footer/footer.jsx';
import Login from './pages/Login/Login.jsx';
import Registration from "./pages/registration/registration.jsx"
import MyStats from "./pages/MyStats/myStats.jsx"


const AppLayout = (props) => {
   const { pathname } = useLocation();

   useEffect(() => {
      window.scrollTo({
         top: 0,
         left: 0,
         behavior: "auto"
      });
   }, [pathname]);

   return (
      <div>
         <Header/>
          {props.component}
         <Footer/>
      </div>
   )
    
}



const route = createBrowserRouter([
   {path : "/" , element :<AppLayout component={<Home/>} />} , 
   {path : "/WordArch" , element : <AppLayout component={<WordArch/>}/>},
   {path : "/collocations" , element : <AppLayout component={<Collocations/>}/>},
   {path : "/Testing" , element : <AppLayout component={<Testing/>}/>},
   {path : "/Login" , element : <AppLayout component={<Login/>}/>}, 
   {path: "/Registration" , element: <AppLayout component={<Registration/>}/>},
   {path: "/MyStats" , element: <AppLayout component={<MyStats/>}/>}
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

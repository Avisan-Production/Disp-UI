import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import ErrorPage from './Component/General/ErrorPage'
import LMDDashboard from './Component/General/LMD/LMDDashboard'
import Login from './Component/General/Login'
import axios from 'axios';
import appsettings from './appsettings.json'
import Station from './Component/General/LMD/Station';
import Users from './Component/General/LMD/Users';
import Devices from './Component/General/LMD/Devices';
import Device from './Component/General/LMD/Device';
import Report from './Component/General/LMD/report';
import Groups from './Component/General/LMD/Groups';
import Group from './Component/General/LMD/Group';
import ReportGroup from './Component/General/LMD/ReportGroup';
import Forget from './Component/General/LMD/Forget';
import ReportDeviceCoop from './Component/General/LMD/ReportDeviceCoop';
import Profile from './Component/General/Profile';
import GroupCoopReport from './Component/General/LMD/GroupCoopReport';
import SMSReport from './Component/General/LMD/SMSReport';

const root = ReactDOM.createRoot(document.getElementById('root'));



axios.interceptors.request.use(request => {
  // console.log(request);
  // Edit request config
  var token=localStorage.token;
  if(token){
    request.headers.Authorization = `Bearer ${token}`

    request.headers.set("Access-Control-Allow-Origin","*")
    request.headers.set("Access-Control-Allow-Methods","*")
  }
  
  return request;
}, error => {
  // console.log(error);
  return Promise.reject(error);
});
var errCount=0;
axios.interceptors.response.use(response => {
  // console.log(response);
  // Edit response config
  return response;
}, error => {
  console.log("errr=>",error.config);
  if(error.response.status===401)
  {
    var rt=localStorage.getItem("refreshtoken")
    if(rt!==null || rt!==undefined){
      axios.post(`${appsettings.BaseApiUrl}/api/user/refresh`,{token:rt})
      .then(res=>{
          localStorage.setItem("token",res.data.token);
          localStorage.setItem("refreshtoken",res.data.refreshToken);
          error.config.headers.Authorization = `Bearer ${res.data.token}`
          return axios.request(error.config)
      })
      
    }
    
  }
  // console.log("err=>",error);
  return Promise.reject(error);
});



const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    errorElement:<ErrorPage/>,
    children:[
      {index:true,element:<Login/>},
      {path:"/dashboard",element:<LMDDashboard />},
      {path:"/station/:serial",element:<Station />},
      {path:"/users",element:<Users />},
      {path:"/Devices",element:<Devices />},
      {path:"/Device/:serial",element:<Device />},
      {path:"/report/station",element:<Report />},
      {path:"/report/group",element:<ReportGroup />},
      {path:"/report/coop/station",element:<ReportDeviceCoop />},
      {path:"/report/coop/group",element:<GroupCoopReport />},
      {path:"/report/sms",element:<SMSReport />},
      {path:"/groups",element:<Groups />},
      {path:"/group/:id",element:<Group />},
      {path:"/forget",element:<Forget />},
      {path:"/profile",element:<Profile />},
    ]
  }
  
  ])
root.render(

    <RouterProvider router={router}/>

);
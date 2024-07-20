import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import ErrorPage from './Component/General/ErrorPage'
import LMDDashboard from './Component/General/LMD/LMDDashboard'
import Login from './Component/General/Login'
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
import MapPage from './Component/General/LMD/MapPage';
import Setting from './Component/General/Setting';
import Management from './Component/General/LMD/Management';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store,persistor } from './redux/store';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById('root'));

let theme=localStorage.getItem('theme')
if(theme)
  document.documentElement.setAttribute('data-bs-theme', theme)



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
      {path:"/map",element:<MapPage />},
      {path:"/setting",element:<Setting />},
      {path:"/managment",element:<Management />},
    ]
  }
  
  ])
root.render(
  <Provider store={store}>
  <PersistGate persistor={persistor}>
    <RouterProvider router={router} />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={true}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </PersistGate>
</Provider>

);
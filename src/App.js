import "./Assets/fonts/Iransans/Iransans.css";
import "./Assets/css/App.css";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LMDAside from "./Component/General/LMD/LMDAside";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import appsettings from './appsettings.json'
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setMobile, setName, setRFToken, setRole, setToken, setUserAccess, setUsername } from "./redux/user/userAction";
import { toast } from "react-toastify";
function App() {
  const [user, setUser] = useState({});
  // const [userAccess, setUserAccess] = useState(false);
  // const [stationAccess, setStationAccess] = useState(false);
  // const [reportAccess, setReportAccess] = useState(false);
  // const [groupAccess, setGroupAccess] = useState(false);
  const {token,rftoken,userAccess,role,name}=useSelector(state=>state.user)
  const theme=localStorage.getItem("theme")
  const dispatch=useDispatch()
  const [darktheme,setDarkTheme] = useState(theme!==null?(theme==='dark'?true:false):false);

  const baseURL=appsettings.BaseApiUrl
  axios.interceptors.request.use(request => {
    // console.log(request);
    // Edit request config
    request.baseURL=baseURL
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
    console.log(rftoken);
    console.log("errr=>",error.config);
    if(error.response.status===401)
    {
      console.log('token expired');
      if(rftoken!==null ||rftoken!==undefined){
        axios.post(`/api/user/refresh`,{token:rftoken})
        .then(res=>{
          console.log('refreshed');
          console.log(res.data);
          dispatch(setToken(res.data.token))
          dispatch(setRFToken(res.data.refreshToken))

            error.config.headers['Authorization']= `Bearer ${res.data.token}`
            console.log(error.config);
            return axios.request(error.config)
        })
        .catch(()=>{
          localStorage.clear();
          window.location.href="/";
        })
        
      }
      
    }
    return Promise.reject(error);
  });
  
  const navigate = useNavigate();
  const SignOut = () => {
    var dto = { token: rftoken };
    axios
      .post(`/api/user/signout`, dto)
      .then(function (response) {
       
      })
      .catch(function (err) {
        console.log(err.response.data);
      });
      dispatch(setToken(''))
       dispatch(setRFToken(''))
       dispatch(setName(''))
       dispatch(setEmail(''))
       dispatch(setUsername(''))
       dispatch(setMobile(''))
       dispatch(setRole(''))
       dispatch(setUserAccess([]))
        toast("خدا نگه دار", {type:'success'})
         navigate("/");
  };
  let getUser = () => {
    axios.get(`/api/user`).then((res) => {
      // setUser(res.data);
      console.log(res.data);
      var role=''
      switch (res.data.type) {
        case 0:
          role = "مدیرکل";
          break;
        case 1:
          role = "مدیر";
          break;
        case 2:
          role = "کاربر";
          break;
          default:
            role=''
      }

      dispatch(setName(res.data.fullName))
      dispatch(setEmail(res.data.email))
      dispatch(setUsername(res.data.username))
      dispatch(setMobile(res.data.mobile))
      dispatch(setRole(role))
      dispatch(setUserAccess(res.data.accesses))
    });
  };
  let changetheme=()=>{
    if (document.documentElement.getAttribute('data-bs-theme')==='dark') {
      document.documentElement.setAttribute('data-bs-theme', 'light')
      setDarkTheme(false)
      localStorage.setItem('theme','light')
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      setDarkTheme(true)
      localStorage.setItem('theme','dark')

    }
  } 
  useEffect(() => {
   
    if ( token) {
      getUser();
    } else {
      if(window.location.pathname==="/forget")return
      if(window.location.pathname==="/")return
      navigate('/')
    }
  }, [token]);

  return (
    <>
      <nav className="navbar navbar-expand-lg  bg-dark text-white">
        <div className="container-fluid d-md-flex justify-content-md-start">
          <a className="navbar-brand ml-auto" href="/">
            سامانه جامع IOT آویسان &nbsp; |{" "}
            <span style={{ color: "#fefefe" }}>
              {" "}
              سامانه توزیع برق تهران بزرگ
            </span>
          </a>
          {token && (
            <>
                  <div className="dropdown">
                    <button
                      className="nav-link active dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-current="page"
                    >
                      <FontAwesomeIcon icon={solid("user")} />
                    </button>

                    <ul className="dropdown-menu" dir="rtl">
                      <li>
                        <p>
                          {" "}
                          {name + " "}
                          <span
                            className="text-secondary"
                            style={{ fontSize: ".7em" }}
                          >
                            (
                            {role}
                            )
                          </span>
                        </p>

                        <hr />
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          style={{ textAlign: "right" }}
                          href="/profile"
                          target="_blank"
                        >
                          <FontAwesomeIcon icon={solid("user-circle")} />{" "}
                          پروفایل
                        </a>
                      </li>
                      {/*<li>
                          <a
                            className="dropdown-item"
                            style={{ textAlign: "right" }}
                            href="#!"
                          >
                            <FontAwesomeIcon icon={solid("cog")} /> تنظیمات
                          </a>
                        </li> */}

                      <li>
                        <button
                          className="dropdown-item btn-none"
                          style={{ textAlign: "right", padding: "4px 16px" }}
                          onClick={SignOut}
                        >
                          <FontAwesomeIcon icon={solid("sign-out")} /> خروج
                        </button>
                      </li>
                    </ul>
                  </div>
                
                  <button
                    className="btn-none mt-auto mb-auto me-1 p-2 text-white"
                    style={{ fontSize: "1.1em" }}
                    onClick={() => changetheme()}
                  >
                    {darktheme ? (
                      <>
                        <FontAwesomeIcon
                          className="text-white"
                          icon={solid("sun")}
                        />
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          className="text-white  "
                          icon={solid("moon")}
                        />
                      </>
                    )}
                  </button>
              
            </>
          )}
        </div>
      </nav>
      <div className="container-fluid" style={{ padding: 0 }}>
        {token && (
          <>
            <LMDAside/>
          </>
        )}

        <Outlet
         
        />
      </div>
    </>
  );
}

export default App;

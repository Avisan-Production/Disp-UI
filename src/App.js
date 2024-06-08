import "./Assets/fonts/Iransans/Iransans.css";
import "./Assets/css/App.css";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import appsetting from "./appsettings.json";
import LMDAside from "./Component/General/LMD/LMDAside";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import bootstrap from 'bootstrap'
function App() {
  const [JwtToken, setJwtToken] = useState("");
  const [SYSName, setSYSName] = useState("");
  const [user, setUser] = useState({});
  const [userAccess, setUserAccess] = useState(false);
  const [stationAccess, setStationAccess] = useState(false);
  const [reportAccess, setReportAccess] = useState(false);
  const [groupAccess, setGroupAccess] = useState(false);
  const theme=localStorage.getItem("theme")
  
  const [darktheme,setDarkTheme] = useState(theme!==null?(theme==='dark'?true:false):false);

  const navigate = useNavigate();
  const SignOut = () => {
    var rToken = localStorage.getItem("refreshtoken");
    var dto = { token: rToken };
    axios
      .post(`/api/user/signout`, dto)
      .then(function (response) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshtoken");
        setJwtToken("");
        navigate("/");
      })
      .catch(function (err) {
        console.log(err.response.data);
      });
  };
  let getUser = () => {
    axios.get(`/api/user`).then((res) => {
      setUser(res.data);
      localStorage.setItem("role",res.data.type)
       setTimeout(() => {
          var arr = [];
          for (var item of res.data.accesses) {
            arr.push(item);
          }
          setUserAccess(arr.includes(7));
          setGroupAccess(arr.includes( 3));
          setReportAccess(arr.includes(4));
          setStationAccess(arr.includes(0));
        }, 200);
      

      console.log(res.data);
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
  var token = localStorage.getItem("token");
  useEffect(() => {
   
    if ( token !== null) {
      setJwtToken(token);
      getUser();
    } else {
      setJwtToken("");
      if(window.location.pathname==="/forget")return
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
          {JwtToken && (
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
                          {user.fullName + " "}
                          <span
                            className="text-secondary"
                            style={{ fontSize: ".7em" }}
                          >
                            (
                            {user.type === 0
                              ? "مدیر کل"
                              : user.type === 1
                              ? "مدیر"
                              : "کاربر"}
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
        {JwtToken && (
          <>
            <LMDAside
              report={reportAccess}
              station={stationAccess}
              group={groupAccess}
              user={userAccess}
            />
          </>
        )}

        <Outlet
          context={{
            JwtToken,
            setJwtToken,
            setSYSName,
          }}
        />
      </div>
    </>
  );
}

export default App;

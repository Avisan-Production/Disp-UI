import { useNavigate} from "react-router-dom";
import bg from "../../Assets/images/login-bg.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useDispatch, useSelector } from "react-redux";
import {setRFToken,setEmail,setMobile,setName,setRole,setToken,setUsername as setUname} from '../../redux/user/userAction'
import { toast } from "react-toastify";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch()
 const {token}=useSelector(s=>s.user)
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.length > 0 && password.length > 0) {
      let dto = { username: username, password: password };
      axios
        .post(`/api/user/login`, dto)
        .then(function (response) {
          dispatch(setName(response.data.fullname))
          dispatch(setEmail(response.data.email))
          dispatch(setUname(response.data.username))
          dispatch(setRole(response.data.role))
          dispatch(setMobile(response.data.mobile))
          dispatch(setToken(response.data.token))
          dispatch(setRFToken(response.data.refreshToken))
       toast("خوش آمدید", { type: "success" });
           navigate("/dashboard");
        })
        .catch(function (error) {
          console.log(error);
          toast(error.response?error.response.data:'در ورود به حساب کاربری خطا رخ داده است',{type:'error'})
        });
    }
 

  };
  const [show,setShow]=useState(false)
  useEffect(()=>{
  if(token !== null||token!==undefined|| token!==''){
    navigate("/dashboard")
  }
  },[])
  return (
    <>
      <div
        className="col-12 "
        style={{ height: "100%", overflow: "hidden !important" }}
      >
        <div className="row">
          <div className="col-12 col-md-6 d-flex ">
            <img
              src={bg}
              style={{
                width: "100%",
                overflow: "hidden",
                height: "auto",
                display: "block",
                margin: "auto",
              }}
              alt="background"
            />
          </div>
          <div
            className="col-12 col-md-6 p-5 login-from "
            style={{ height: "100vh", overflow: "hidden" }}
          >
            <h2 className="text-center">سامانه مدیریت بار آویسان</h2>
            <p className="text-center mt-3">ورود به حساب کاربری</p>
            

            <form onSubmit={handleSubmit} className="d-flex">
              <div className="col-12 col-md-8 mx-auto mt-5">
                <div className="col-12 mb-3">
                  <p>نام کاربری را وارد کنید</p>
                  <input
                    className="form-control"
                    onChange={(event) => setUsername(event.target.value)}
                    type="text"
                  ></input>
                </div>
                <div className="col-12 mb-3">
                  <p>کلمه عبور را وارد کنید</p>
                  <div className="pass_input">
                  <input
                    className="form-control"
                    onChange={(event) => setPassword(event.target.value)}
                    type={show?"text":"password"}
                  ></input>
                  <button className="btn-none" onClick={()=>setShow(!show)}>
                    {show?<>
                    <FontAwesomeIcon icon={solid('eye-slash')}/>
                    </>:
                    <>
                    <FontAwesomeIcon icon={solid('eye')} />
                    </>
                    }
                  </button>
                  </div>
                  
                </div>

                <div className="col-12 mb-3 d-flex justify-content-center">
                  <button className="btn btn-primary p-3 w-100 m-auto">
                    ورود به حساب کاربری
                  </button>
                </div>
                <div className="col-12 mt-5">
                  <a href="/forget">بازیابی حساب کاربری</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

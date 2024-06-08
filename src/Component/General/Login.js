import { useNavigate, useOutletContext } from "react-router-dom";
import bg from "../../Assets/images/login-bg.jpg";
import { useEffect, useState } from "react";
import appsetting from '../../appsettings.json'
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  let context = useOutletContext();
  var token=localStorage.getItem("token");
  if(token !==null){
    navigate("/Dashboard");
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.length > 0 && password.length > 0) {
      let dto = { username: username, password: password };
      axios
        .post(`/api/user/login`, dto)
        .then(function (response) {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshtoken", response.data.refreshToken);
          context.setJwtToken("token");
          navigate("/dashboard");
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.response.data)
        });
    }
    // context.setJwtToken("a");
    // navigate("/dashboard");

  };
  const [show,setShow]=useState(false)
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
            {message !== "" && (
              <>
                <br />
                <div className="alert alert-danger">{message}</div>
                <br />
              </>
            )}

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

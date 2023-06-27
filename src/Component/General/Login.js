import { useNavigate, useOutletContext } from "react-router-dom";
import bg from "../../Assets/images/login-bg.jpg";
import { useEffect, useState } from "react";
import appsetting from '../../appsettings.json'
import axios from "axios";

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
        .post(`${appsetting.BaseApiUrl}/api/user/login`, dto)
        .then(function (response) {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshtoken", response.data.refreshToken);
          context.setJwtToken("token");
          navigate("/dashboard");
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.data)
        });
    }
    // context.setJwtToken("a");
    // navigate("/dashboard");
  };
  return (
    <>
      <div className="col-md-8 offset-md-2 col-10 offset-1 login">
        <div className="row">
          <div className="col-12 col-md-6 d-flex">
            <img src={bg} className="login-bg" alt="background" />
          </div>
          <div className="col-12 col-md-6 login-from ">
            <h2 className="text-center">سامانه مدیریت بار آویسان</h2>
            <p className="text-center mt-3">ورود به حساب کاربری</p>
            {message !== "" && 
              <>
                <br />
                <div className="alert alert-danger">
                  <p>{message}</p>
                </div>
                <br />
              </>
            }

            <form onSubmit={handleSubmit}>
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
                <input
                  className="form-control"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                ></input>
              </div>
              <div className="col-12 mb-3">
                <a href="/forget">بازیابی حساب کاربری</a>
              </div>
              <div className="col-12 mb-3 d-flex justify-content-center">
                <button className="btn btn-secondary m-auto">
                  ورود به حساب کاربری
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

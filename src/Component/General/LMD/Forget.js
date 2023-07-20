import { useNavigate, useOutletContext } from "react-router-dom";
import bg from "../../../Assets/images/login-bg.jpg";
import { useState } from "react";
import appsetting from '../../../appsettings.json'
import axios from "axios";



function Forget (){
    const [username, setUsername] = useState("");
   
    const [message, setMessage] = useState("");
    const [messageClass, setMessageClass] = useState("");
    const navigate = useNavigate();
 
    var token=localStorage.getItem("token");
    if(token !==null){
      navigate("/Dashboard");
    }
    const handleSubmit = (event) => {
      event.preventDefault();
      if (username.length > 0 ) {
        let dto = { username: username };
        axios
          .post(`${appsetting.BaseApiUrl}/api/user/forget`, dto)
          .then(function (response) {
            console.log(response);
            setMessage(response.data)
            setMessageClass("success")
          })
          .catch(function (error) {
            console.log(error);
            setMessage(error.data)
            setMessageClass("danger")
          });
      }
      else{
        setMessage("نام کاربری را وارد نمایید ")
        setMessageClass("danger")
      }
     
    };
    return(
        <>
        <div className="col-md-8 offset-md-2 col-10 offset-1 login">
          <div className="row">
            <div className="col-12 col-md-6 d-flex">
              <img src={bg} className="login-bg" alt="background" />
            </div>
            <div className="col-12 col-md-6 login-from ">
              <h2 className="text-center">سامانه مدیریت بار آویسان</h2>
              <p className="text-center mt-3">بازیابی حساب کاربری</p>
              {message !== "" && 
                <>
                  <br />
                  <div className={`alert alert-${messageClass}`}>
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
                  <a href="/">ورود به حساب کاربری</a>
                </div>
                <div className="col-12 mb-3 d-flex justify-content-center">
                  <button className="btn btn-secondary m-auto">
                    بازیابی
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
}

export default Forget;
import { useNavigate, useOutletContext } from "react-router-dom";
import bg from "../../../Assets/images/login-bg.jpg";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";



function Forget (){
    const [username, setUsername] = useState("");
   
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
          .post(`/api/user/forget`, dto)
          .then(function (response) {
            console.log(response);
           toast(response.data,{type:'success'})
          })
          .catch(function (error) {
            console.log(error);
            toast(error.response.datal,{type:'error'})
            
          });
      }
      else{
        toast("نام کاربری را وارد نمایید ",{type:'warning'})
      }
     
    };
    return (
      <>
        <div
          className="col-12 "
          style={{ height: "100%", overflow: "hidden !important" }}
        >
          <div className="row">
            <div className="col-12 col-md-6 d-flex">
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
              <p className="text-center mt-3">بازیابی حساب کاربری</p>
          

              <form onSubmit={handleSubmit} className="d-flex ">
                <div className="col-12 col-md-8 mx-auto mt-5">
               
                  <div className="col-12 mb-3">
                    <p>نام کاربری را وارد کنید</p>
                    <input
                      className="form-control"
                      onChange={(event) => setUsername(event.target.value)}
                      type="text"
                    ></input>
                  </div>

                  <div className="col-12 mb-3 d-flex  justify-content-center">
                    <button className="btn btn-primary w-100 p-3 m-auto">
                      بازیابی
                    </button>
                  </div>
                  <div className="col-12 mt-5">
                    <a href="/">ورود به حساب کاربری</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
}

export default Forget;
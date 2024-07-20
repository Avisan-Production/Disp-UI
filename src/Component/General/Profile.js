import axios from "axios";
import { useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import appsetting from "../../appsettings.json";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile(){
    const [name,SetName]=useState("")    
    const [currentUsername,SetCurrentUsername]=useState("")
    const [username,SetUsername]=useState("")
    const [email,SetEmail]=useState("")
    const [codemelli,SetCodeMelli]=useState("")
    const [tell,SetTell]=useState("")
    const [accesses,SetAccesses]=useState([])
    const [newPass,SetNewPass]=useState("")
  
      const navigate=useNavigate();
    let GetUser=()=>{
        axios.get(`/api/user`)
        .then((res)=>{
            console.log(res.data);
            SetName(res.data.fullName)
            SetEmail(res.data.email)
            SetTell(res.data.mobile)
            SetCodeMelli(res.data.melliCode)
            SetUsername(res.data.username)
            SetCurrentUsername(res.data.username)
            SetAccesses(res.data.accesses)
        })
        .catch((err)=>{

        })
    }
    let submitInfo=()=>{
        if(window.confirm("آیا از ثبت اطلاعات مطمئن هستید ؟")){
            var dto={
                fullName:name,
                mobile:tell,
                email:email,
                melliCode:codemelli,
                username:currentUsername,
                newusername:username,
            }
            axios.patch(`/api/user/update/profile`,dto)
            .then((res)=>{
                console.log(res.data);
                toast(res.data,{type:'success'})
                setTimeout(() => {
                    localStorage.clear();
                    navigate("/");
                }, 2000);
            })
            .catch((err)=>{
                console.log(err);
                toast(err.response?err.response.data:'در ثبت اطلاعات شما خطا رخ داده است',{type:'danger'})
            })
        }
    }

    let submitPassword=()=>{
        if(window.confirm("آیا از ثبت اطلاعات مطمئن هستید ؟")){
            var dto={
                username:currentUsername,
                 password:newPass
            }
            axios.patch(`/api/user/update/pwd`,dto)
            .then((res)=>{
                console.log(res.data);
                toast(res.data,{type:'success'})

                setTimeout(() => {
                    localStorage.clear();
                    navigate("/");
                }, 2000);
            })
            .catch((err)=>{
                console.log(err);
                toast(err.response?err.response.data:'در ثبت اطلاعات شما خطا رخ داده است',{type:'danger'})

            })
        }
    }
    useState(()=>{
            GetUser();

    },[])
    return (
      <>
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header bg-dark text-white">
                  اطلاعات حساب کاربری
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <p>نام کاربری</p>
                    <input className="form-control" type="text" value={username} onChange={(e)=>SetUsername(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <p>نام و نام خانوادگی</p>
                    <input className="form-control" type="text" value={name} onChange={(e)=>SetName(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <p>شماره تماس</p>
                    <input className="form-control" type="text" value={tell} onChange={(e)=>SetTell(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <p>کد ملی</p>
                    <input className="form-control" type="text" value={codemelli} onChange={(e)=>SetCodeMelli(e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <p>پست الکترونیک</p>
                    <input className="form-control" type="email" value={email} onChange={(e)=>SetEmail(e.target.value)} />
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary w-100" onClick={()=>submitInfo()}>ثبت تغییرات</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header bg-dark text-white">
                  اطلاعات حساب کاربری
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <p>کلمه عبور جدید</p>
                    <input className="form-control" type="password"  onChange={(e)=>SetNewPass(e.target.value)} />
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary w-100" onClick={()=>submitPassword()}>تغییر کلمه عبور</button>
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </>
    );

}

export default Profile;
import axios from "axios";
import { useEffect, useState } from "react";
import appsetting from "../../../appsettings.json";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function Users(){
const [users,setUsers]=useState([]);
const [modal,setModal]=useState(false);
const [passwordmodal,setPasswordModal]=useState(false);
const [name,setName]=useState("");
const [username,setUsername]=useState("");
const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");

const [tell,setTell]=useState("");
const [type,setType]=useState(2);
const [email,setEmail]=useState("");
const [codeMelli,setCodeMelli]=useState("");
const [active,setActive]=useState(false);
const [isUpdateMode,setMode]=useState(false);
const [accessList,SetAccessList]=useState([]);
const [stationAccess,setstationAccess]=useState(false);
const [turnOnOffAccess,setturnOnOffAccess]=useState(false);
const [timerAccess,settimerAccess]=useState(false);
const [groupAccess,setgroupAccess]=useState(false);
const [reportAccess,setreportAccess]=useState(false);
const [eventAccess,seteventAccess]=useState(false);
const [dashboardAccess,setdashboardAccess]=useState(false);
const [usersAccess,setusersAccess]=useState(false);
const [addUserAccess,setaddUserAccess]=useState(false);
const [deleteUserAccess,setdeleteUserAccess]=useState(false);
const [toast, setToast] = useState({show: false,title: "",text: "",bg: ""});


var calculateAccessess=()=>{
    var arr=[];
    if(stationAccess) arr.push(0);
    if(turnOnOffAccess) arr.push(1);
    if(timerAccess) arr.push(2);
    if(groupAccess) arr.push(3);
    if(reportAccess) arr.push(4);
    if(eventAccess) arr.push(5);
    if(dashboardAccess) arr.push(6);
    if(usersAccess) arr.push(7);
    if(addUserAccess) arr.push(8);
    if(deleteUserAccess) arr.push(9);
    
    return arr;
}
var selectUser=(user)=>{
    setstationAccess(false);
    setturnOnOffAccess(false);
    settimerAccess(false);
    setgroupAccess(false);
    setreportAccess(false);
    seteventAccess(false);
    setdashboardAccess(false);
    setusersAccess(false);
    setaddUserAccess(false);
    setdeleteUserAccess(false);
  setName(user.fullName);
  setEmail(user.email);
  setActive(user.active);
  setTell(user.mobile);
  setType(user.type);
  setCodeMelli(user.codeMelli);
  setUsername(user.username);
  setMode(true);
    for(var item of user.accesses){
      if (item === 0) setstationAccess(true);
      if (item === 1) setturnOnOffAccess(true);
      if (item === 2) settimerAccess(true);
      if (item === 3) setgroupAccess(true);
      if (item === 4) setreportAccess(true);
      if (item === 5) seteventAccess(true);
      if (item === 6) setdashboardAccess(true);
      if (item === 7) setusersAccess(true);
      if (item === 8) setaddUserAccess(true);
      if (item === 9) setdeleteUserAccess(true);
    }
  setModal(true);
}

var openPasswordModal=(user)=>{
setUsername(user.username);
setPasswordModal(true)
}

const openModal=(state)=>{
  if(state){
    setPasswordModal(false);
    setName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setTell("");
    setType(2);
    setEmail("");
    setCodeMelli("");
    setActive(false);
    setMode(false);
    SetAccessList([]);
    setstationAccess(false);
    setturnOnOffAccess(false);
    settimerAccess(false);
    setgroupAccess(false);
    setreportAccess(false);
    seteventAccess(false);
    setdashboardAccess(false);
    setusersAccess(false);
    setaddUserAccess(false);
    setdeleteUserAccess(false);
  }
  setModal(true)
}

var submit=()=>{
    var dto= {
        FullName:name,
        Username : username,
        Mobile: tell,
        Email:email,
        MelliCode:`${codeMelli}`,
        Type:type,
        active:active,
        Accesses : calculateAccessess()
    }
    console.log(dto);
   if(isUpdateMode){
axios.patch(`/api/user/update`,dto)
.then((res)=>{
    setToast({show:true,title:'ویرایش کاربر',text:res.data,bg:'success'})
   getUsers();

})
.catch((err)=>{
    setToast({show:true,title:'ویرایش کاربر',text:err.response.data,bg:'danger'})
});
   }
   else{
    dto["password"]=password;
    axios.post(`/api/user/add`,dto)
    .then((res)=>{
        setToast({show:true,title:'افزودن کاربر',text:res.data,bg:'success'})
        getUsers();
    })
    .catch((err)=>{
        setToast({show:true,title:'افزودن کاربر',text:err.response.data,bg:'danger'})
    });
   } 

    setModal(false)
    setstationAccess(false);
    setturnOnOffAccess(false);
    settimerAccess(false);
    setgroupAccess(false);
    setreportAccess(false);
    seteventAccess(false);
    setdashboardAccess(false);
    setusersAccess(false);
    setaddUserAccess(false);
    setdeleteUserAccess(false);
    
}
var submitPassword=()=>{
  if(password!==confirmPassword) return
  var dto= {
      Username : username,
      Password : password

  }
  console.log(dto);
 
  axios.patch(`/api/user/update/pwd`,dto)
  .then((res)=>{
      setToast({show:true,title:'ویرایش کلمه عبور',text:res.data,bg:'success'})
      getUsers();
      setPasswordModal(false)
  })
  .catch((err)=>{
      setToast({show:true,title:'ویرایش کلمه عبور',text:err.response.data,bg:'danger'})
  });
 
}
let removeUser=(username)=>{
  if(window.confirm('آیا از حذف کاربر مطمئن هستید ؟')){
    var dto={
      username:username
    }
    axios.post(`/api/user/remove`,dto).then((response)=>
     {
        setToast({show:true,title:"حذف کاربر",text:response.data,bg:'success'})

        getUsers();
     })
     .catch((err)=>{
      setToast({show:true,title:"حذف کاربر",text:"در حذف کاربر خطا رخ داده است",bg:'danger'})
     })
    }
}
let getUsers=()=>{
 
    axios.get(`/api/user/all`).then((response)=>
     {
        console.log(response.data)
        setUsers(response.data)
     })
     .catch((err)=>{
        console.log(err.response.data)
     })
}
useEffect(()=>{

     getUsers();

},[])


    return (
      <>
        <div className="container mt-4">
          <div className="card mt-5">
            <div className="card-header bg-dark text-white d-flex justify-content-start">
              لیست کاربران
              <button
                className="btn btn-success mt-auto mb-auto"
                style={{ marginLeft: "5px !important", marginRight: "auto" }}
                onClick={() => openModal(true)}
              >
                افزودن کاربر جدید
              </button>
            </div>
            <div className="card-body chart table-responsive">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <td>نام</td>
                    <td>نام کاربری</td>
                    <td>شماره تماس </td>
                    <td>ایمیل</td>
                    <td>وضعیت</td>
                    <td>نوع</td>
                    <td>عملیات</td>
                  </tr>
                </thead>
                <tbody>
                  {users.map((x) => (
                    <>
                      <tr key={x.username}>
                        <td>{x.fullName}</td>
                        <td>{x.username}</td>
                        <td>{x.mobile} </td>
                        <td>{x.email}</td>
                        <td>{x.active ? "فعال" : "غیر فعال"}</td>
                        <td>
                          {x.type === 0
                            ? "مدیر کل"
                            : x.type === 1
                            ? "مدیر"
                            : "کاربر ساده"}
                        </td>
                        <td className="d-flex justify-content-between">
                          <button
                            className="btn-none"
                            onClick={() => removeUser(x.username)}
                          >
                            <FontAwesomeIcon
                              className="text-danger"
                              icon={solid("trash")}
                            />
                          </button>
                          <button
                            className="btn-none"
                            onClick={() => openPasswordModal(x)}
                          >
                            <FontAwesomeIcon icon={solid("key")} />
                          </button>
                          <button
                            className="btn-none"
                            onClick={() => selectUser(x)}
                          >
                            <FontAwesomeIcon icon={solid("edit")} />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal show={modal}>
          <Modal.Header>
            <Modal.Title>
              {isUpdateMode ? "ویرایش کاربر" : "افزودن کاربر جدید"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>نام و نام خانوادگی</p>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <p>شماره همراه</p>
              <input
                className="form-control"
                value={tell}
                onChange={(e) => setTell(e.target.value)}
              ></input>
            </div>
            <div>
              <p>نام کاربری</p>
              <input
                className="form-control"
                value={username}
                disabled={isUpdateMode}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
            {
              !isUpdateMode&&<>
                <div>
              <p>کلمه عبور</p>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
              </>
            }
            <div>
              <p>پست الکترونیک</p>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <p>کد ملی</p>
              <input
                className="form-control"
                value={codeMelli}
                onChange={(e) => setCodeMelli(e.target.value)}
              ></input>
            </div>
            <div>
              <p>نوع کاربری</p>
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value={0}>مدیر کل</option>
                <option value={1}>مدیر</option>
                <option value={2}>کاربر</option>
              </select>
            </div>
            <div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked"
                >
                  کاربر فعال باشد
                </label>
              </div>
            </div>
            <hr />
            <div>
              <p>دسترسی ها</p>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked0"
                  checked={stationAccess}
                  onChange={(e) => setstationAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked0"
                >
                  مدیریت ایستگاه ها
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked1"
                  checked={turnOnOffAccess}
                  onChange={(e) => setturnOnOffAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked1"
                >
                  درخواست وصل یا قطع
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked2"
                  checked={timerAccess}
                  onChange={(e) => settimerAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked2"
                >
                  درخواست تایمر
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked3"
                  checked={groupAccess}
                  onChange={(e) => setgroupAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked3"
                >
                  مدیریت محور
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked4"
                  checked={reportAccess}
                  onChange={(e) => setreportAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked4"
                >
                  گزارشگیری
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked5"
                  checked={eventAccess}
                  onChange={(e) => seteventAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked5"
                >
                  رویداد ها
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked6"
                  checked={dashboardAccess}
                  onChange={(e) => setdashboardAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked6"
                >
                  داشبورد
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked7"
                  checked={usersAccess}
                  onChange={(e) => setusersAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked7"
                >
                  مدیریت کاربران
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked8"
                  checked={addUserAccess}
                  onChange={(e) => setaddUserAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked8"
                >
                  افزودن کاربر
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked9"
                  checked={deleteUserAccess}
                  onChange={(e) => setdeleteUserAccess(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked9"
                >
                  حذف کاربر
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => submit()}>
              ثبت تغییرات
            </Button>
            <Button variant="secondary" onClick={() => setModal(false)}>
              بستن
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={passwordmodal}>
          <Modal.Header>
            <Modal.Title>تغییر کلمه عبور</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>کلمه عبور را وارد کنید</p>
              <input
                className="form-control"
                autoComplete={false}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <p >تکرار کلمه عبور را وارد کنید</p>
              <input
                className="form-control"
                type="password"
                autoComplete={false}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>
            {password.length>0&&confirmPassword.length>0&&password!==confirmPassword&&<>
            
            <p className="text-danger mt-3">کلمه عبور و تکرار آن باید یکسان باشد</p>
            </>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" disabled={password===""||confirmPassword===""||password!==confirmPassword} onClick={() => submitPassword()}>
              تغییر کلمه عبور
            </Button>
            <Button variant="secondary"  onClick={() => setPasswordModal(false)}>
              بستن
            </Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer className="position-fixed m-3" position="top-start">
          <Toast
            onClose={() =>
              setToast({ show: false, title: "", text: "", bg: "" })
            }
            show={toast.show}
            bg={toast.bg}
            delay={3000}
            autohide
          >
            <Toast.Header>{toast.title}</Toast.Header>
            <Toast.Body>{toast.text}</Toast.Body>
          </Toast>
        </ToastContainer>
      </>
    );

}

export default Users;
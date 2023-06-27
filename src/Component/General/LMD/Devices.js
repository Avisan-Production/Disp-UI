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

function Devices(){

const [toast, setToast] = useState({show: false,title: "",text: "",bg: ""});
const [modal,setModal]=useState(false);
const [devices,setDevices]=useState([]);
const [search,setSearch]=useState([]);

const [faName,setFaName]=useState("");
const [enName,setEnName]=useState("");
const [lat,setLat]=useState(0.0);
const [lon,setLon]=useState(0.0);
const [serial,setSerial]=useState(0);
const [active,setActive]=useState(false);
const [installationDate,setInstall]=useState("");
const [simCardNumber,setSimcardNumber]=useState("");
const [description,setDescription]=useState("");
let Search=(txt)=>{
  
  if(txt.length>0){
      var filter=devices.filter(x=>x.serial.toString().includes(txt)||x.deviceName.includes(txt)||x.simCardNumber.includes(txt)||x.installationDate.includes(txt))
      setSearch(filter)
  }
  else{
    setSearch(devices)
  }
}
let resetStates=()=>{
    setFaName("");
    setEnName("");
    setLat(0.0);
    setLon(0.0);
    setSerial(0);
    setActive(false);
    setInstall("");
    setSimcardNumber("");
    setDescription("");
}
let fetchTimers=()=>{
  if(window.confirm("آیا از ارسال درخواست واکشی تایمر مطمئن هستید ؟")){
    axios.post(`${appsetting.BaseApiUrl}/api/command/request/timers`)
    .then((res)=>{
        setToast({show:true,title:"واکشی تایمر",text:res.data,bg:"success"})
    })
    .catch((err)=>{
        setToast({show:true,title:"واکشی تایمر",text:"در ثبت درخواست واکشی تایمر خطا رخ داده است",bg:"danger"})
    })
  }
}
let addDevice=()=>{
    if(window.confirm("از ثبت دستگاه جدید مطمئن هستید ؟")){
        let dto = {
          active: active,
          description: description,
          deviceName: faName,
          englishName: enName,
          installationDate: installationDate,
          latitude: lat,
          longitude: lon,
          serial: serial,
          simCardNumber: simCardNumber,
          type: 0,
        };
        axios.post(`${appsetting.BaseApiUrl}/api/device/add`,dto)
        .then((res)=>{
            setToast({show:true,title:"افزودن دستگاه",text:res.data,bg:"success"})
            getDevices();
            resetStates();
            setModal(false)
        })
        .catch((err)=>{
            setToast({show:true,title:"افزودن دستگاه",text:err.data,bg:"danger"})
        })
    }
            
}

let removeDevice=(serial)=>{
  if (window.confirm("آیا از حذف دستگاه مطمئن هستید ؟")) {
    var dto={
      serial:serial
    }
    axios
      .post(`${appsetting.BaseApiUrl}/api/device/remove`,dto)
      .then((res) => {
        setToast({
          show: true,
          title: "حذف دستگاه",
          text: res.data,
          bg: "success",
        });
        getDevices();
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "حذف دستگاه",
          text: err.data,
          bg: "danger",
        });
      });
  }
}
let getDevices=()=>{
 
    axios.get(`${appsetting.BaseApiUrl}/api/device/all`)
    .then((response)=>
     {
        console.log(response.data)
        setDevices(response.data)
        setSearch(response.data)
     })
     .catch((err)=>{
        console.log(err.data)
     })
}
useEffect(()=>{

     getDevices();
    console.log('fires=>');
},[])


    return (
      <>
        <div className="container mt-4">
          <div className="card mt-5">
            <div className="card-header bg-dark text-white d-flex justify-content-start">
              لیست دستگاه ها
              <button
                className="btn btn-success mt-auto mb-auto"
                style={{ marginLeft: "5px !important", marginRight: "auto" }}
                onClick={() => setModal(true)}
              >
                افزودن دستگاه جدید
              </button>
              <button
                className="btn btn-secondary mt-auto mb-auto"
                style={{ marginLeft: "5px !important", marginRight: "5px" }}
                onClick={() => fetchTimers()}
              >
              واکشی تایمر ها
              </button>
            </div>
            <div className="card-body">
              <div className="col-12 d-md-flex justify-content-start">
                <p className="mt-auto mb-auto">جستجو</p>
                <input className="form-control me-3" onChange={(e)=>Search(e.target.value)}></input>
              </div>
              <br/>
              <hr/>
              <br/>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <td>#</td>
                    <td>سریال</td>
                    <td>نام فارسی</td>
                    
                    <td>شماره سیمکارت </td>
                    <td>زمان نصب </td>
                    <td>وضعیت </td>
                    <td>عملیات</td>
                  </tr>
                </thead>
                <tbody>
                  {search.map((x,i) => (
                    <>
                      <tr key={x.serial}>
                        <td>{i+1}</td>
                        <td>{x.serial}</td>
                        <td>{x.deviceName}</td>
                    
                        <td>{x.simCardNumber}</td>
                        <td>{x.installationDate}</td>
                        <td>{x.active ? "فعال" : "غیر فعال"}</td>

                        <td className="d-flex justify-content-between">
                          <button className="btn-none"
                          onClick={()=>removeDevice(x.serial)}
                          >
                            <FontAwesomeIcon
                              className="text-danger"
                              icon={solid("trash")}
                            />
                          </button>
                          <Link to={`/device/${x.serial}`} className="btn-none">
                            <FontAwesomeIcon icon={solid("eye")} />
                          </Link>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal show={modal} onHide={()=>resetStates()}>
          <Modal.Header>
            <Modal.Title>افزودن دستگاه جدید</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-2">
              <p>سریال :</p>
              <input
                type="number"
                className="form-control"
                min="0"
                onChange={(e) => setSerial(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <p>نام فارسی :</p>
              <input type="text" className="form-control" onChange={(e) => setFaName(e.target.value)} />
            </div>
            <div className="mb-2">
              <p>نام لاتین :</p>
              <input type="text" className="form-control" onChange={(e) => setEnName(e.target.value)} />
            </div>
            <div className="row">
              <div className="mb-2 col-12 col-md-6">
                <p>Lat :</p>
                <input
                  type="number"
                  className="form-control"
                  min={0.0}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div className="mb-2 col-12 col-md-6">
                <p>Lon :</p>
                <input
                className="form-control"
                  type="number"
                  min={0.0}
                  onChange={(e) => setLon(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-2">
              <p>شماره سیمکارت :</p>
              <input
                type="text"
           className="form-control"
                onChange={(e) => setSimcardNumber(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <p>زمان نصب :</p>
              <input
                type="text"
           className="form-control"
                onChange={(e) => setInstall(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <p>توضیحات :</p>
              <textarea
                type="text"
                cols={5}
           className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-check form-switch" >
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked9"
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked9" 
                >
                  دستگاه فعال است ؟
                </label>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={()=>addDevice()}>ثبت تغییرات</Button>
            <Button variant="secondary" onClick={() => setModal(false)}>
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

export default Devices;
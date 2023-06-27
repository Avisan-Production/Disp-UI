import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import vocab from "../../../vocab.config.json";
import appsetting from "../../../appsettings.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


const LMDDashboard = () => {
  const [modal, setModal] = useState(false);
  const [devices, setDeices] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [groups, setGroups] = useState([]);
  const [dashInfo, setDashInfo] = useState({});
  const [sortAp, setSortAp] = useState(false);
  const [sortRelay, setSortRelay] = useState(false);
  const [sortConnect, setSortConnect] = useState(false);
  



  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });

  const[smsTemplates,setTemplates]=useState([])
  const[smsText,setSMSText]=useState("")
  const[SaveAsTemplate,setSaveAsTemplate]=useState(false)

  var Search=(val)=>{
    if(val.length>0){
      var filter=devices.filter(x=>x.deviceName.includes(val))
      setSearch(filter)
    }
    else{
      setSearch(devices)
    }
  }
  //Select Or Deselect checkboxes
  function checkAll(event) {
    var chs = document.querySelectorAll('[name="ch-serial"]');
    for (var item of chs) {
      item.checked = event.target.checked;
    }
  }
  //
  function setSerials() {
    var serials = [];
    var chs = document.querySelectorAll('[name="ch-serial"]:checked');
    for (var item of chs) {
      var serial = parseInt(item.getAttribute("data-ch-serial"));
      var board = parseInt(item.getAttribute("data-ch-board"));

      serials.push({ serial: serial, board: board });
    }
    return serials;
  }
  function turnOff() {
    if (window.confirm("آیا از ارسال دستور قطع مطمئن هستید؟")) {
      var boards = setSerials();
      if (boards.length > 0) {
        var dto = { cmd: 12, boards: boards };
        axios
          .post(`${appsetting.BaseApiUrl}/api/command/request/rels`, dto)
          .then(function (response) {
            setToast({
              show: true,
              title: "درخواست",
              text: "درخواست با موفقیت ثبت شد",
              bg: "success",
            });
          })
          .catch((err) => {
            setToast({
              show: true,
              title: "درخواست",
              text: "ارسال درخواست خطا رخ داده است",
              bg: "danger",
            });
          });
      } else {
        setToast({
          show: true,
          title: "درخواست",
          text: "پستی انتخاب نشده است",
          bg: "danger",
        });
      }
    }
  }
  function turnOn() {
    if (window.confirm("آیا از ارسال درخواست وصل مطمئن هستید؟")) {
      var boards = setSerials();
      if (boards.length < 0) {
        alert("ایستگاهی انتخاب نشده است");
      }
      var dto = { cmd: 11, boards: boards };
      axios
        .post(`${appsetting.BaseApiUrl}/api/command/request/rels`, dto)
        .then(function (response) {
          setToast({
            show: true,
            title: "درخواست",
            text: "درخواست با موفقیت ثبت شد",
            bg: "success",
          });
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "درخواست",
            text: "ارسال درخواست خطا رخ داده است",
            bg: "danger",
          });
        });
    } else {
      setToast({
        show: true,
        title: "درخواست",
        text: "پستی انتخاب نشده است",
        bg: "danger",
      });
    }
  }
 
  let GetTemplates=()=>{
    axios
    .get(`${appsetting.BaseApiUrl}/api/sms/template`)
    .then(function (response) {
      setTemplates(response.data)
    })
    .catch((err) => {
      setToast({
        show: true,
        title: "لیست قالب پیامک",
        text: "در دریافت لیست قالب های پیامک خطا رخ داده است",
        bg: "danger",
      });
    });

  }
  
  let SendSMS=()=>{
    if(smsText.length>0){
      var serials = [];
      var chs = document.querySelectorAll('[name="ch-serial"]:checked');
      for (var item of chs) {
        var serial = parseInt(item.getAttribute("data-ch-serial"));
        serials.push(serial);
      }
      if(serials.length>0){
        var dto={
          serials:serials,
          text:smsText
         }
         axios.post(`${appsetting.BaseApiUrl}/api/sms/send`,dto)
        .then((res)=>{
          setToast({
            show: true,
            title: "ارسال پیامک",
            text:"پیامک با موفقیت ارسال شد",
            bg: "success",
          });
          setSMSText("")
        })
        .catch((err)=>{
          setToast({
            show: true,
            title: "ارسال پیامک",
            text: "در ارسال پیامک خطا رخ داده است",
            bg: "danger",
          });
        })
      }
      else{
        setToast({
          show: true,
          title: "ارسال پیامک",
          text: "ایستگاهی جهت ارسال پیامک انتخاب نشد",
          bg: "danger",
        });
      }
      if(SaveAsTemplate){
        
        axios.post(`${appsetting.BaseApiUrl}/api/sms/template`,{text:smsText})
        .then((res)=>{
          setToast({
            show: true,
            title: "قالب پیامک",
            text:res.data,
            bg: "success",
          });
          GetTemplates();
          setSaveAsTemplate(false)
        })
        .catch((err)=>{
          setToast({
            show: true,
            title: "قالب پیامک",
            text: "در ذخیره قالب پیامک خطا رخ داده است",
            bg: "danger",
          });
        })
      }
    }
    else{
      setToast({
        show: true,
        title: "ارسال پیامک",
        text: "متن پیامک نمی تواند خالی باشد",
        bg: "danger",
      });
    }
   
  }

  let sort=(type)=>{
    var data=devices
    var ap= sortAp
    var rel=sortRelay
    var con=sortConnect
debugger;
      switch(type){
        case 0:
          ap= !sortAp
          setSortAp(ap);
         
        break;
        case 1:
          rel=!sortRelay
          setSortRelay(rel);
         
        break;
        case 2:
          con=!sortConnect
          setSortConnect(con);
         
        break;
        default:
        break;
      }
      data = [...devices].sort((a,b)=>{
        
        var ret=0;
        if(ap) ret+=b.activePower-a.activePower
        if(rel) ret+=b.relay===a.relay?0:b.relay?1:-1
        if(con) ret+=b.isConnected===a.isConnected?0:b.isConnected?1:-1
        return ret
      })
      setSearch(data)
     
      
  }
 
  let removeTemplate=(id)=>{
    axios.post(`${appsetting.BaseApiUrl}/api/sms/template/remove/${id}`)
    .then((res)=>{
      setToast({
        show: true,
        title: "قالب پیامک",
        text:"قالب پیامک با موفقیت حذف شد",
        bg: "success",
      });
      GetTemplates()
    })
    .catch((err)=>{
      setToast({
        show: true,
        title: "قالب پیامک",
        text: "در حذف قالب پیامک خطا رخ داده است",
        bg: "danger",
      });
    })
  }
  let getDashboard = () => {
    axios
      .get(`${appsetting.BaseApiUrl}/api/device/dashboard`)
      .then(function (response) {
        console.log('dash =>',response.data); 
        setDashInfo(response.data); 
        if(response.data.devices){
          var ap= document.querySelector('[data-sort-ap]').getAttribute('data-sort-ap')==='true'?true:false
          var rel= document.querySelector('[data-sort-rel]').getAttribute('data-sort-rel')==='true'?true:false
          var con= document.querySelector('[data-sort-con]').getAttribute('data-sort-con')==='true'?true:false
          var data = response.data.devices.sort((a,b)=>{
            var ret=0;
            if(ap) ret+=b.activePower-a.activePower
            if(rel) ret+=b.relay===a.relay?0:b.relay?1:-1
            if(con) ret+=b.isConnected===a.isConnected?0:b.isConnected?1:-1
            return ret
          })
          
          setDeices(data);
          setSearch(data)
        }

      });
  };
  useEffect(() => {
    GetTemplates();
    getDashboard();
     setInterval(() => {
    getDashboard();
  }, 60 * 1000);
    axios
      .get(`${appsetting.BaseApiUrl}/api/group/all`)
      .then(function (response) {
        setGroups(response.data);

        console.log('group=>',response.data);
      });
      console.log("fires");
  }, [,]);

  const context = useOutletContext();

  context.setSYSName("سامانه LMD");

  return (
    <>
      <div className="container mt-2 p-4">
        <div className="card text-center">
          <div className="card-header d-block d-md-flex ">
            <ul className="nav nav-tabs card-header-tabs mb-md-4  ">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-stations"
                  type="button"
                  role="tab"
                  aria-controls="nav-stations"
                  aria-selected="true"
                  aria-current="true"
                  href="#!"
                >
                  {vocab.devices}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link "
                  data-bs-toggle="tab"
                  data-bs-target="#nav-groups"
                  type="button"
                  role="tab"
                  aria-controls="nav-groups"
                  aria-selected="true"
                  aria-current="true"
                  href="#!"
                >
                  {vocab.groups}
                </a>
              </li>
            </ul>
            <div  style={{ margin: "auto auto auto 5px" }}>
              <button
                className="float-left btn btn-primary"
                style={{ marginLeft: "5px" }}
                onClick={() => setModal(true)}
              >
                <FontAwesomeIcon icon={solid("envelope")} />
                {" | "} ارسال پیامک
              </button>
              <button
                className="float-left btn btn-success"
                onClick={turnOn}
                style={{ marginRight: "auto", marginLeft: "5px" }}
              >
                وصل {vocab.devices}
              </button>
              <button className="float-left btn btn-danger" onClick={turnOff}>
                قطع {vocab.devices}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="nav-stations"
                role="tabpanel"
              >
                <div className="col-12 text-right">
                  <p>
                    <FontAwesomeIcon
                      icon={solid("exclamation-triangle")}
                      className="text-warning"
                    />{" "}
                    راهنما
                  </p>
                  <div className="row">
                    <div className="col-12 col-md-4">
                      <p>
                        <FontAwesomeIcon
                          icon={solid("bullhorn")}
                          className="text-danger"
                        />{" "}
                        ایستگاه هشدار دهنده
                      </p>
                    </div>
                    <div className="col-12 col-md-4">
                      <p>
                        <span className="updater-connection connected"></span>{" "}
                        ایستگاه به سامانه متصل است
                      </p>
                    </div>
                    <div className="col-12 col-md-4">
                      <p>
                        <span className="updater-connection disconnected">
                          {" "}
                        </span>{" "}
                        ایستگاه به سامانه متصل نیست یا موقتاً قطع است
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row mb-4">
                  <div className="col-12 col-md-3">
                    <p>تعداد کل ایستگاه ها</p>
                    <input
                      className="form-control text-center"
                      value={dashInfo.deviceCount}
                      disabled
                    ></input>
                  </div>
                  <div className="col-12 col-md-3">
                    <p>تعداد ایستگاه های متصل</p>
                    <input
                      className="form-control text-center"
                      value={dashInfo.connected}
                      disabled
                    ></input>
                  </div>

                  <div className="col-12 col-md-3">
                    <p>مجموع توان اسمی</p>
                    <input
                      className="form-control text-center"
                      dir="ltr"
                      value={dashInfo.totalNominalPower+' KW'}
                      disabled
                    ></input>
                  </div>
                  <div className="col-12 col-md-3">
                    <p>مجموع توان لحظه ای</p>
                    <input
                      className="form-control text-center"
                      dir="ltr"
                      value={dashInfo.totalActivePower!==undefined?dashInfo.totalActivePower.toFixed(2) +' KW':dashInfo.totalActivePower}
                      disabled
                    ></input>
                  </div>
                </div>
                <hr />
                <br />

                <table className="table table-responsive  table-hover ">
                  <thead>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          name="check-all"
                          onChange={checkAll}
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-center">
                        {searchMode?<>
                        <input className="form-control" onChange={(e)=>Search(e.target.value)} />
                        <button className="btn-none" onClick={()=>setSearchMode(false)}><FontAwesomeIcon icon={solid('times-circle')} /></button>
                        </>
                        :
                        <>
                        <button className="btn-none mt-auto mb-auto hover" onClick={()=>setSearchMode(true)}><FontAwesomeIcon icon={solid('search')} /></button>
                        <p className="text-center mt-auto mb-auto me-2">نام {vocab.devices}</p>
                        </>
                        }
                        
                        </div>
                        
                        
                        </td>
                      <td>
                        توان اسمی
                        
                      </td>
                      <td>توان لحظه ای
                      <button  style={{color:sortAp?'#000':'#ccc'}} data-sort-ap={sortAp} className="btn-none mt-auto mb-auto hover" onClick={()=>sort(0)}><FontAwesomeIcon icon={solid('sort-alpha-down')} /></button>
                      </td>
                      <td>نوع ایستگاه</td>
                      <td>وضعیت ایستگاه
                      <button style={{color:sortRelay?'#000':'#ccc'}} data-sort-rel={sortRelay} className="btn-none mt-auto mb-auto hover" onClick={()=>sort(1)}><FontAwesomeIcon icon={solid('sort-alpha-down')} /></button>
                      </td>
                      <td>ارتباط با سامانه
                      <button  style={{color:sortConnect?'#000':'#ccc'}} data-sort-con={sortConnect} className="btn-none mt-auto mb-auto hover" onClick={()=>sort(2)}><FontAwesomeIcon icon={solid('sort-alpha-down')} /></button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.length > 0
                      ? search.map((x) => (
                          <>
                            <tr key={x.serial} data-serial={x.serial}>
                              <td>
                                <input
                                  type="checkbox"
                                  name="ch-serial"
                                  data-ch-serial={x.serial}
                                  data-ch-board={x.boardNumber}
                                />
                              </td>
                              <td>
                                <Link to={`/station/${x.serial}`}>
                                  {x.deviceName + " - " + x.boardName}
                                </Link>{" "}
                              </td>
                              <td>{x.nominalPower}</td>
                              <td data-el="ap"><span dir="ltr">{x.activePower.toFixed(2)+' KW '}</span> </td>
                              <td>
                                {x.type === 1 && (
                                  <>
                                    <FontAwesomeIcon
                                      icon={solid("bullhorn")}
                                      className="text-danger"
                                    />
                                  </>
                                )}
                              </td>

                              <td>{x.relay ? "وصل" : "قطع"}</td>
                              <td>
                                <span
                                  className={`updater-connection ${
                                    x.isConnected ? "connected" : "disconnected"
                                  }`}
                                  data-el="con"
                                ></span>
                              </td>
                            </tr>
                          </>
                        ))
                      : [0, 1, 2, 3, 4, 5].map((x) => (
                          <>
                            <tr key={x}>
                              <td colSpan={2}>
                                <p className="skeleton"></p>
                              </td>
                              <td>
                                <p className="skeleton"></p>
                              </td>
                              <td data-el="ap">
                                <p className="skeleton"></p>
                              </td>
                              <td>
                                <p className="skeleton"></p>
                              </td>
                              <td>
                                <p className="skeleton"></p>
                              </td>
                              <td>
                                <p className="skeleton"></p>
                              </td>
                              <td>
                                <p
                                  className={`updater-connection `}
                                  data-el="con"
                                ></p>
                              </td>
                            </tr>
                          </>
                        ))}
                  </tbody>
                </table>
              </div>
              <div
                className="tab-pane fade  active"
                id="nav-groups"
                role="tabpanel"
              >
                {groups.length < 1 ? (
                  <>
                    <h5 className="card-title">
                      {vocab.group} برای نمایش یافت نشد
                    </h5>
                    <p className="card-text">
                      برای مدیریت {vocab.groups} می توانید از لینک زیر اقدام
                      نمایید
                    </p>
                    <a href="#!" className="btn btn-primary">
                      مدیریت {vocab.groups}
                    </a>
                  </>
                ) : (
                  <>
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <td>نام {vocab.group}</td>
                          <td>تعداد زیر مجموعه</td>

                          <td>عملیات</td>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map((x) => (
                          <>
                            <tr key={x.id} data-gp-id={x.id}>
                              <td>{x.name}</td>
                              <td>{x.devices.length}</td>
                              <td>
                                <Link to={"/group/" + x.id}>
                                  <FontAwesomeIcon icon={solid("eye")} />
                                </Link>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer className="position-fixed m-3" position="top-start">
        <Toast
          onClose={() => setToast({ show: false, title: "", text: "", bg: "" })}
          show={toast.show}
          bg={toast.bg}
          delay={3000}
          autohide
        >
          <Toast.Header>{toast.title}</Toast.Header>
          <Toast.Body>{toast.text}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Modal show={modal} onHide={() => setModal(false)}>
        <Modal.Header>
          <Modal.Title>ارسال پیامک</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <p>متن را وارد کنید</p>
            <textarea className="form-control " rows={5}
            value={smsText}
            onChange={(e)=>setSMSText(e.target.value)}
            ></textarea>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="saveAsTemplateCheckbox"
                checked={SaveAsTemplate}
                onChange={(e)=>setSaveAsTemplate(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="saveAsTemplateCheckbox"
              >
                ذخیره به عنوان قالب پیامک
              </label>
            </div>
          </div>
          <hr/>
          <div className="mb-2">
            <p>انتخاب قالب های تعریف شده</p>
            <div className="list-group">
              {smsTemplates.length > 0 ? (
                smsTemplates.map((x) => (
                  <>
                   <li className="list-group-item list-group-item-action d-flex justify-content-start" >
                  <button
                      type="button"
                      className="btn-none"
                      onClick={()=>setSMSText(x.text)}
                    >
                      {x.text}
                    </button>
                    <button className="btn-none" style={{margin:'auto auto auto 3px'}} onClick={()=>removeTemplate(x.id)}>
                      <FontAwesomeIcon icon={solid('trash')} className="text-danger" />
                    </button>
                  </li>
                    
                  </>
                ))
              ) : (
                <>
                  <div className="alert alert-danger">
                    <p>قالب پیامک یافت نشد</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>SendSMS()}>ثبت تغییرات</Button>
          <Button variant="secondary" onClick={() => setModal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LMDDashboard;

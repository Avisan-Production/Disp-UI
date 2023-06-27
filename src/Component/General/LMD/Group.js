import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useParams } from "react-router-dom";
import appsetting from "../../../appsettings.json";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
  } from "recharts";
import Map from "../Map";
  
function Group() {
  const { id } = useParams();
  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });
  const [chartData, setChartData] = useState([]);
  const [group, setGroup] = useState({});
  const [devices, setDevices] = useState([]);

  const [timers2WeekSat, setTimer2WeekSat] = useState(false);
  const [timers2WeekSun, setTimer2WeekSun] = useState(false);
  const [timers2WeekMon, setTimer2WeekMon] = useState(false);
  const [timers2WeekTue, setTimer2WeekTue] = useState(false);
  const [timers2WeekWed, setTimer2WeekWed] = useState(false);
  const [timers2WeekThu, setTimer2WeekThu] = useState(false);
  const [timers2WeekFri, setTimer2WeekSFri] = useState(false);
  const [timers2Stime, setTimer2Stime] = useState(new Date().toLocaleTimeString());
  const [timers2Etime, setTimer2Etime] = useState(new Date().toLocaleTimeString());
  const [timers2RActive, setTimer2RActive] = useState(false);
  const [timers2TActive, setTimer2TActive] = useState(false);

  var chartWith =
    document.getElementsByClassName("chart")[0] !== undefined
      ? document.getElementsByClassName("chart")[0].offsetWidth
      : 900;

      let getData=()=>{
        var now=new Date();
       
    var start=new Date(now);
    start.setHours(now.getHours()-4)
    start.setMinutes(0)
    start.setSeconds(0)

        var dto={
          id:id,
          startDate:start.toJSON(),
          endDate:now.toJSON()
        }
        console.log(dto);
        axios.post(`${appsetting.BaseApiUrl}/api/group/data`, dto)
        .then(function (response) {
          console.log( response.data)
    
         setChartData(response.data.datas);
        });
      }
var getGis=()=>{
  var arr=[]
  if(devices.length>0){
    for(var item of devices){
      arr.push({lat:item.lat !== undefined ? item.lat : 0,lon:item.lon !== undefined ?item.lon : 0,pop:`<b>ایستگاه ${item.name}</b>`})
    }
  }
  return arr
}

      function TimeString(date){
        var h=""
        var m=""
        var s=""
        var hh=date.getHours()
        var mm=date.getMinutes()
        var ss=date.getSeconds()
        if(hh<10){
          h=`0${hh}`
        }
        else{h=`${hh}`}
        if(mm<10){
          m=`0${mm}`
        }
        else{m=`${mm}`}
        if(ss<10){
          s=`0${ss}`
        }
        else{s=`${ss}`}
    
      return `${h}:${m}:${s}`
      }
      function WeekDay(){
        var wik=0;
        if(timers2WeekSat) 
          wik+=1;
          if(timers2WeekSun) 
          wik+=2;
          if(timers2WeekMon) 
          wik+=4;
          if(timers2WeekTue) 
          wik+=8;
          if(timers2WeekWed) 
          wik+=16;
          if(timers2WeekThu) 
          wik += 32;
          if(timers2WeekFri) 
          wik += 64;
          return wik;
      }
      function weekDaytoArr(num) {
        var arr = [];
        while (true) {
          var mod = num % 2;
          arr.push(Boolean(mod));
          var divide = Math.trunc(num / 2);
          if (divide < 2) {
            arr.push(Boolean(divide));
            break;
          }
          num = divide;
        }
        var l = arr.length;
        for (var i = l; i < 7; i++) arr.push(false);
        return arr;
      }
let setTimer=()=>{
  if(window.confirm('آیا از ثبت تایمر مطمئن هستید؟')){
    var date=new Date();
    var splitStime=timers2Stime.split(':');
    var splitEtime=timers2Etime.split(':');
    var stime=new Date(date.getFullYear(),date.getMonth(),date.getDay(),parseInt(splitStime[0]),parseInt(splitStime[1]),0);
    var etime=new Date(date.getFullYear(),date.getMonth(),date.getDay(),parseInt(splitEtime[0]),parseInt(splitEtime[1]),0);
  
    var dto={
      id:parseInt(id),
      startTime:stime.toJSON(),
      endTime:etime.toJSON(),
      weekDay:WeekDay(),
      relayStatus:timers2RActive,
      Active:timers2TActive
    }
    console.log(dto);
    axios
      .post(`${appsetting.BaseApiUrl}/api/group/timer`, dto)
      .then(function (response) {
        setToast({
          show: true,
          title: "درخواست",
          text: "درخواست شما با موفقیت ثبت شد",
          bg: "success",
        });
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "تایمر",
          text: "در ثبت درخواست شما خطا رخ داده است",
          bg: "danger",
        });
      });
  }
  
}
let getTimer=()=>{
  axios
  .get(`${appsetting.BaseApiUrl}/api/group/timer/${id}`)
  .then((res) => {
    var stime= new Date(res.data.startTime)
    stime.setHours(stime.getHours()+3);
    stime.setMinutes(stime.getMinutes()+30);      
    var etime= new Date(res.data.endTime)
    etime.setHours(etime.getHours()+3);
    etime.setMinutes(etime.getMinutes()+30);      
    console.log(TimeString(stime))

    setTimer2Stime(TimeString(stime))
    setTimer2Etime(TimeString(etime))
    setTimer2TActive(res.data.active)
    setTimer2RActive(res.data.relayStatus);
    var wik=weekDaytoArr(res.data.weekDay)
    setTimer2WeekSat(wik[0])
    setTimer2WeekSun(wik[1])
    setTimer2WeekMon(wik[2])
    setTimer2WeekTue(wik[3])
    setTimer2WeekWed(wik[4])
    setTimer2WeekThu(wik[5])
    setTimer2WeekSFri(wik[6])
  })
}      
  let getGroup = () => {
    axios
      .get(`${appsetting.BaseApiUrl}/api/group/${id}`)
      .then((res) => {
        setGroup(res.data);
        setDevices(res.data.devices);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.data);
        setToast({
          show: true,
          title: "گروه ها",
          text: "در واکشی اطلاعات گروه خطا رخ داده است",
          bg:'danger'
        });
      });
  };
let TurnOnGroup=()=>{
    if(window.confirm('آیا از روشن کردن پست های گروه مطمئن هستید؟')){
        var arr=[]
        for(var item of devices){
            arr.push({serial:item.serial,board:0})
        }
        var dto={cmd:11,boards:arr}
       axios.post(`${appsetting.BaseApiUrl}/api/command/request/rels`,dto)
       .then(function (response) {
        setToast({
          show: true,
          title: "درخواست",
          text: "درخواست شما با موفقیت ثبت شد",
          bg: "success",
        });
      })
      .catch((err)=>{
        setToast({
            show: true,
            title: "درخواست",
            text: "در ارسال درخواست شما خطا رخ داده است",
            bg: "danger",
          });
      })
    }

}
let TurnOffGroup=()=>{
    if(window.confirm('آیا از خاموش کردن پست های گروه مطمئن هستید؟')){
        var arr=[]
        for(var item of devices){
            arr.push({serial:item.serial,board:0})
        }
        var dto={cmd:12,boards:arr}
       axios.post(`${appsetting.BaseApiUrl}/api/command/request/rels`,dto)
       .then(function (response) {
        setToast({
          show: true,
          title: "درخواست",
          text: "درخواست شما با موفقیت ثبت شد",
          bg: "success",
        });
      })
      .catch((err)=>{
        setToast({
            show: true,
            title: "درخواست",
            text: "در ارسال درخواست شما خطا رخ داده است",
            bg: "danger",
          });
      })
    }

}
let TurnDevice=(isOn,serial)=>{
    
    if(window.confirm(isOn? 'آیا از روشن کردن پست مطمئن هستید؟':'آیا از خاموش کردن پست مطمئن هستید؟')){
        var dto = { serial: serial, board: 0, relay: 0, cmd: isOn?11:12 };
    axios
      .post(`${appsetting.BaseApiUrl}/api/command/request`, dto)
      .then(function (response) {
        setToast({
          show: true,
          title: "درخواست",
          text: "درخواست شما با موفقیت ثبت شد",
          bg: "success",
        });
      })
      .catch((err)=>{
        setToast({
            show: true,
            title: "درخواست",
            text: "در ارسال درخواست شما خطا رخ داده است",
            bg: "danger",
          });
      })
    }

}
  useEffect(() => {
    
    getGroup();
    getTimer();
    setInterval(() => {
      getGroup();
    }, 30 * 1000);
    getData();
    setInterval(() => {
      getData();
    }, 2*60*1000);
  }, []);
  return (
    <>
      <div className="container-fluid p-3 mt-3">
        <div className="row m-0 p-0">
          <div className="col-12 col-md-4">
            <p className="text-secondary">
              مرکز های گروه
              <span style={{ float: "left" }}>
                {" "}
                <FontAwesomeIcon icon={solid("chevron-down")} />
              </span>
            </p>

            <div className="mt-2">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">نام مرکز</th>
                    <th scope="col">تعداد ایستگاه</th>
                    <th scope="col">توان</th>
                    <th scope="col">وضعیت</th>
                    <th scope="col">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <>
                      <tr key={d.serial}>
                        <th scope="row">{devices.indexOf(d)+1}</th>
                        <td>{d.name}</td>
                        <td className="text-center">{d.boards.length}</td>
                        <td className="text-right" dir="ltr">{`${d.totalAp.toFixed(2)} KW`}</td>
                        <td>
                          <span
                            style={{ marginLeft: "10px" }}
                            className={`mt-auto mb-auto updater-connection ${
                              d.isConnected ? "connected" : "disconnected"
                            }`}
                          ></span>
                        </td>
                        <td>
                          <button
                            className="btn-none text-danger"
                            style={{ margin: "auto auto auto 5px" }}
                            ata-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-title="قطع مرکز"
                            title="قطع مرکز"
                            onClick={() => TurnDevice(false, d.serial)}
                          >
                            <FontAwesomeIcon icon={solid("power-off")} />
                          </button>
                          <button
                            className="btn-none text-success"
                            style={{ margin: "auto 5px" }}
                            ata-bs-toggle="tooltip"
                            data-bs-placement="top"
                            onClick={() => TurnDevice(true, d.serial)}
                            data-bs-title="وصل مرکز"
                            title="وصل مرکز"
                          >
                            <FontAwesomeIcon icon={solid("power-off")} />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
              <div className="card">
                <div className="card-header bg-dark text-white d-flex justify-content-start">
                  <p className="mt-auto mb-auto">تایمر گروه</p>
                </div>
                <div className="card-body">
                  <div className="">
                    <p>زمان شروع</p>
                    <input
                      type="time"
                      className="form-control"
                      value={timers2Stime}
                      onChange={(e) => setTimer2Stime(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <p>زمان پایان</p>
                    <input
                      type="time"
                      className="form-control"
                      value={timers2Etime}
                      onChange={(e) => setTimer2Etime(e.target.value)}
                    />
                  </div>
                  <p>روز های اجرای تایمر</p>
                  <div className="d-flex justify-content-center mt-2 mb-2">
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-sa"
                      autocomplete="off"
                      checked={timers2WeekSat}
                      onChange={(e) => setTimer2WeekSat(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-sa"
                    >
                      شنبه
                    </label>
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-su"
                      autocomplete="off"
                      checked={timers2WeekSun}
                      onChange={(e) => setTimer2WeekSun(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-su"
                    >
                      یکشنبه
                    </label>
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-mon"
                      autocomplete="off"
                      checked={timers2WeekMon}
                      onChange={(e) => setTimer2WeekMon(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-mon"
                    >
                      دوشنبه
                    </label>
                  </div>
                  <div className="d-flex justify-content-center mt-2 mb-2">
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-tue"
                      autocomplete="off"
                      checked={timers2WeekTue}
                      onChange={(e) => setTimer2WeekTue(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-tue"
                    >
                      سه شنبه
                    </label>
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-wed"
                      autocomplete="off"
                      checked={timers2WeekWed}
                      onChange={(e) => setTimer2WeekWed(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-wed"
                    >
                      چهارشنبه
                    </label>
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-thu"
                      autocomplete="off"
                      checked={timers2WeekThu}
                      onChange={(e) => setTimer2WeekThu(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-thu"
                    >
                      پنجشنبه
                    </label>
                    <input
                      type="checkbox"
                      className="btn-check m-auto"
                      id="btn-check-outlined-fri"
                      autocomplete="off"
                      checked={timers2WeekFri}
                      onChange={(e) => setTimer2WeekSFri(e.target.checked)}
                    />
                    <label
                      className="btn btn-outline-primary m-auto weekday-item"
                      htmlFor="btn-check-outlined-fri"
                    >
                      جمعه
                    </label>
                  </div>
                  <div className="">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked={timers2RActive}
                        onChange={(e) => setTimer2RActive(e.target.checked)}
                      />
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        رله فعال باشد
                      </label>
                    </div>
                  </div>
                  <div className="">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked={timers2TActive}
                        onChange={(e) => setTimer2TActive(e.target.checked)}
                      />
                      <label
                        class="form-check-label"
                        for="flexSwitchCheckChecked"
                      >
                        تایمر فعال باشد
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    style={{ margin: "auto 5px auto auto" }}
                    onClick={() => setTimer()}
                  >
                    ثبت تغییرات
                  </button>
                  <button
                    className="btn btn-secondary "
                    style={{ margin: "auto auto auto 5px" }}
                    onClick={() => getTimer()}
                  >
                    <FontAwesomeIcon icon={solid("refresh")} />
                    {"  "}
                    بروزرسانی
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8">
            <div className="card">
              <div className="card-header bg-dark text-white d-flex justify-content-start">
                <p className="mt-auto mb-auto ">گروه {group.name}</p>
                <button
                  className="btn btn-danger"
                  style={{ margin: "auto auto auto 10px" }}
                  onClick={() => TurnOffGroup()}
                >
                  قطع همه پست ها
                </button>
                <button
                  className="btn btn-success"
                  style={{ margin: "auto 5px auto 0" }}
                  onClick={() => TurnOnGroup()}
                >
                  وصل همه پست ها
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <p>مجموع توان اسمی گروه</p>
                    <input
                      className="form-control"
                      value={group.totalPower + " kw"}
                      disabled
                    ></input>
                  </div>
                 
                  <div className="col-12 col-md-6">
                    <p>مجموع توان لحظه ای گروه</p>
                    <input
                      className="form-control"
                      value={group.totalApower + " kw"}
                      disabled
                    ></input>
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-header bg-dark text-white d-flex justify-content-start">
                <p className="mt-auto mb-auto ">
                  نمودار لحظه ای مجموع توان گروه
                </p>
              </div>
              <div className="card-body chart">
                <LineChart
                  width={chartWith}
                  height={450}
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <Line type="monotone" dataKey="apower" name="توان" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="datetime" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </div>
            </div>
            {devices.length>0 &&
              <>
                <div className="card mt-5">
                  <div className="card-header bg-dark text-white d-flex justify-content-start">
                    ایستگاه {group.name} بر روی نقشه
                  </div>
                  <div className="card-body chart">
                    <Map loc={getGis()} />
                  </div>
                </div>
              </>
            }
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
    </>
  );
}
export default Group;

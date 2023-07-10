import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import appsetting from "../../../appsettings.json";
import Map from "../Map";

function Station() {
  const { serial } = useParams();

  const [device, setDevice] = useState({});
  const [chartSelect, setChartSelect] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });
  const [chartData, setChartData] = useState([]);

  // const [timer1Modal, setTimer1Modal] = useState(false);
  // const [selectedtimer1, setSelectedTimer1] = useState({
  //   channel: 0,
  //   StartDate: new Date().toLocaleDateString(),
  //   ActiveTime: "",
  //   OnTime: 0,
  //   OffTime: 0,
  //   Active: true,
  // });
  // const [timers1, setTimers1] = useState([]);
  const [timer2Modal, setTimer2Modal] = useState(false);
  const [timer2isAdd, setTimer2IsAdd] = useState(true);
  const [timers2, setTimers2] = useState([]);
  const [timers2Chan, setTimer2Chan] = useState(0);
  const [timers2WeekSat, setTimer2WeekSat] = useState(false);
  const [timers2WeekSun, setTimer2WeekSun] = useState(false);
  const [timers2WeekMon, setTimer2WeekMon] = useState(false);
  const [timers2WeekTue, setTimer2WeekTue] = useState(false);
  const [timers2WeekWed, setTimer2WeekWed] = useState(false);
  const [timers2WeekThu, setTimer2WeekThu] = useState(false);
  const [timers2WeekFri, setTimer2WeekSFri] = useState(false);
  const [timers2Stime, setTimer2Stime] = useState(
    new Date().toLocaleTimeString()
  );
  const [timers2Etime, setTimer2Etime] = useState(
    new Date().toLocaleTimeString()
  );
  const [timers2RActive, setTimer2RActive] = useState(false);
  const [timers2TActive, setTimer2TActive] = useState(false);

  ////////////////////////////////////////////////////////////////////

  const [extraDetailModal, setExtraModal] = useState(false);
  const [extraDetailBoard, setExtraBoard] = useState(0);
  const [extraDetailChillerTonnage, setExtraChillerTonnage] = useState("");
  const [extraDetailContractualDimand, setExtraContractualDimand] =
    useState("");
  const [extraDetailFileNumber, setExtraFileNumber] = useState("");
  const [extraDetailMeterCoefficient, setExtraMeterCoefficient] = useState("");
  const [extraDetailSubscriberBillID, setExtraSubscriberBillID] = useState("");
  const [extraDetailSubscriberTarrif, setExtraSubscriberTarrif] = useState("");
  const [extraDetailMeterNumber, setExtraMeterNumber] = useState("");

  const [SMSModal, setSMSModal] = useState(false);
  const [smsTemplates, setTemplates] = useState([]);
  const [smsText, setSMSText] = useState("");
  const [SaveAsTemplate, setSaveAsTemplate] = useState(false);

  // const [timer3Modal, setTimer3Modal] = useState(false);
  // const [timers3, setTimers3] = useState([]);
  // const [selectedtimer3, setSelectedTimer3] = useState({
  //   channel:0,StartDate:new Date().toLocaleString(),EndDate:new Date().toLocaleString(),RelayStatus:false,Active:false
  // });

  var chartWith =
    document.getElementsByClassName("chart")[0] !== undefined
      ? document.getElementsByClassName("chart")[0].offsetWidth
      : 900;
  let removeTemplate = (id) => {
    axios
      .post(`${appsetting.BaseApiUrl}/api/sms/template/remove/${id}`)
      .then((res) => {
        setToast({
          show: true,
          title: "قالب پیامک",
          text: "قالب پیامک با موفقیت حذف شد",
          bg: "success",
        });
        GetTemplates();
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "قالب پیامک",
          text: "در حذف قالب پیامک خطا رخ داده است",
          bg: "danger",
        });
      });
  };
  let GetTemplates = () => {
    axios
      .get(`${appsetting.BaseApiUrl}/api/sms/template`)
      .then(function (response) {
        setTemplates(response.data);
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "لیست قالب پیامک",
          text: "در دریافت لیست قالب های پیامک خطا رخ داده است",
          bg: "danger",
        });
      });
  };
  let SendSMS = () => {
    if (smsText.length > 0) {
      var dto = {
        serials: [serial],
        text: smsText,
      };
      axios
        .post(`${appsetting.BaseApiUrl}/api/sms/send`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "ارسال پیامک",
            text: "پیامک با موفقیت ارسال شد",
            bg: "success",
          });
          setSMSText("");
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "ارسال پیامک",
            text: "در ارسال پیامک خطا رخ داده است",
            bg: "danger",
          });
        });

      if (SaveAsTemplate) {
        axios
          .post(`${appsetting.BaseApiUrl}/api/sms/template`, { text: smsText })
          .then((res) => {
            setToast({
              show: true,
              title: "قالب پیامک",
              text: res.data,
              bg: "success",
            });
            GetTemplates();
            setSaveAsTemplate(false);
          })
          .catch((err) => {
            setToast({
              show: true,
              title: "قالب پیامک",
              text: "در ذخیره قالب پیامک خطا رخ داده است",
              bg: "danger",
            });
          });
      }
    } else {
      setToast({
        show: true,
        title: "ارسال پیامک",
        text: "متن پیامک نمی تواند خالی باشد",
        bg: "danger",
      });
    }
  };
  let getData = () => {
    if(chartSelect>0){
      setToast({show:true,title:'نمایش نمودار',text:'درخواست واکشی اطلاعات نمودار صادر شد لطفا منتظر بمانید',bg:'success'})
      var now = new Date();

      var start = new Date(now);
      start.setHours(now.getHours() - 3);
      start.setMinutes(0);
      start.setSeconds(0);
      var dto = {
        serial: serial,
        boardNumber:chartSelect,
        startDate: start.toJSON(),
        endDate: now.toJSON(),
      };
      console.log(dto);
      axios
        .post(`${appsetting.BaseApiUrl}/api/device/data/board/range`, dto)
        .then(function (response) {
          console.log("data=>", response.data);
  
          setChartData(response.data.datas);
        })
        .catch((err)=>{
          setToast({show:true,title:'نمایش نمودار',text:'در واکشی اطلاعات نمودار خطا رخ داده است',bg:'danger'})
        });
    }
    else{
      setToast({show:true,title:'نمایش نمودار',text:'ایستگاهی برای نمایش نمودار انتخاب نشد',bg:'danger'})
    }
  };

  let resetExtra = () => {
    setExtraModal(false);
    setExtraBoard(0);
    setExtraChillerTonnage("");
    setExtraContractualDimand("");
    setExtraFileNumber("");
    setExtraMeterCoefficient("");
    setExtraSubscriberBillID("");
    setExtraSubscriberTarrif("");
    setExtraMeterNumber("");
  };
  let setExtra = (detail) => {
    setExtraBoard(detail.boardNumber);
    setExtraChillerTonnage(detail.chillerTonnage);
    setExtraContractualDimand(detail.contractualDimand);
    setExtraFileNumber(detail.fileNumber);
    setExtraMeterCoefficient(detail.meterCoefficient);
    setExtraSubscriberBillID(detail.subscriberBillID);
    setExtraSubscriberTarrif(detail.subscriberTarrif);
    setExtraMeterNumber(detail.meterNumber);
    setExtraModal(true);
  };
  let submitExtraDetail = () => {
    if (window.confirm("آیا از ثبت تغییرات مطمئن هستید ؟")) {
      var dto = {
        serial: serial,
        boardNumber: extraDetailBoard,
        chillerTonnage: extraDetailChillerTonnage,
        contractualDimand: extraDetailContractualDimand,
        fileNumber: extraDetailFileNumber,
        meterCoefficient: extraDetailMeterCoefficient,
        meterNumber: extraDetailMeterNumber,
        subscriberBillID: extraDetailSubscriberBillID,
        subscriberTarrif: extraDetailSubscriberTarrif,
      };
      axios
        .patch(`${appsetting.BaseApiUrl}/api/device/board/detail`, dto)
        .then(function (response) {
          resetExtra();
          setToast({
            show: true,
            title: "ویرایش چیلر",
            text: "درخواست شما با موفقیت ثبت شد",
            bg: "success",
          });
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "ویرایش چیلر",
            text: "در ثبت درخواست شما خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };

  let RelayRequest = (cmd, board) => {
    var cmdTxt = cmd === 11 ? "وصل" : "قطع";
    if (window.confirm(`آیا از ارسال دستور ${cmdTxt} مطمئن هستید؟`)) {
      var dto = { serial: serial, board: board, relay: 0, cmd: cmd };
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
        .catch((err) => {
          setToast({
            show: true,
            title: "درخواست",
            text: "در ثبت درخواست شما خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  // let ShowTimer1Modal = (chan) => {
  //   var t = timers1.find((x) => x.channel === chan);
  //   if(t){
  //     setSelectedTimer1(t);
  //   }

  //   setTimer1Modal(true);
  // };
  function WeekDay() {
    var wik = 0;
    if (timers2WeekSat) wik += 1;
    if (timers2WeekSun) wik += 2;
    if (timers2WeekMon) wik += 4;
    if (timers2WeekTue) wik += 8;
    if (timers2WeekWed) wik += 16;
    if (timers2WeekThu) wik += 32;
    if (timers2WeekFri) wik += 64;
    return wik;
  }
  let SubmitTimer2 = () => {
    if (window.confirm("آیا از ثبت تایمر مطمئن هستید ؟")) {
      var date = new Date();
      var splitStime = timers2Stime.split(":");
      var splitEtime = timers2Etime.split(":");
      var stime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDay(),
        parseInt(splitStime[0]),
        parseInt(splitStime[1]),
        0
      );
      var etime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDay(),
        parseInt(splitEtime[0]),
        parseInt(splitEtime[1]),
        0
      );
      var dto = {
        serial: serial,
        cmd: 64,
        board: 0,
        channel: timers2Chan,
        relay: 0,
        startTime: stime.toJSON(),
        endTime: etime.toJSON(),
        weekDay: WeekDay(),
        relayStatus: timers2RActive,
        Active: timers2TActive,
      };
      console.log(dto);
      axios
        .post(`${appsetting.BaseApiUrl}/api/command/request`, dto)
        .then(function (response) {
          setToast({
            show: true,
            title: "درخواست",
            text: "درخواست شما با موفقیت ثبت شد",
            bg: "success",
          });
        });
    }
  };
  function TimeString(date) {
    var h = "";
    var m = "";
    var s = "";
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    if (hh < 10) {
      h = `0${hh}`;
    } else {
      h = `${hh}`;
    }
    if (mm < 10) {
      m = `0${mm}`;
    } else {
      m = `${mm}`;
    }
    if (ss < 10) {
      s = `0${ss}`;
    } else {
      s = `${ss}`;
    }

    return `${h}:${m}:${s}`;
  }
  let ShowTimer2Modal = (timer) => {
    setTimer2Chan(timer.channel);
    var stime = new Date(timer.startTime);

    var etime = new Date(timer.endTime);

    console.log(TimeString(stime));

    setTimer2Stime(TimeString(stime));
    setTimer2Etime(TimeString(etime));
    setTimer2TActive(timer.active);
    setTimer2RActive(timer.relayStatus);
    var wik = weekDaytoArr(timer.weekDay);
    setTimer2WeekSat(wik[0]);
    setTimer2WeekSun(wik[1]);
    setTimer2WeekMon(wik[2]);
    setTimer2WeekTue(wik[3]);
    setTimer2WeekWed(wik[4]);
    setTimer2WeekThu(wik[5]);
    setTimer2WeekSFri(wik[6]);
    setTimer2Modal(true);
  };
  let resetTimer2 = () => {
    setTimer2Chan(0);
    var stime = new Date().toLocaleTimeString();
    var etime = new Date().toLocaleTimeString();
    setTimer2Etime(stime);
    setTimer2Stime(etime);
    setTimer2TActive(false);
    setTimer2RActive(false);

    setTimer2WeekSat(false);
    setTimer2WeekSun(false);
    setTimer2WeekMon(false);
    setTimer2WeekTue(false);
    setTimer2WeekWed(false);
    setTimer2WeekThu(false);
    setTimer2WeekSFri(false);
    setTimer2IsAdd(false);
    setTimer2Modal(false);
  };
  // let ShowTimer3Modal = (chan) => {
  //   var t = timers3.find((x) => x.channel === chan);
  //   setSelectedTimer3(t);
  //   setTimer3Modal(true);
  // };
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

  let getStation = () => {
    axios
      .get(`${appsetting.BaseApiUrl}/api/device/station/${serial}`)
      .then(function (response) {
        setDevice(response.data);
        console.log(response.data);
      });
  };
  let getGis = () => {
    console.log(device);
    var arr = [];
    arr.push({lat:device.lat !== undefined ? device.lat : 0,lon:device.lon !== undefined ? device.lon : 0,pop:`<b>ایستگاه ${device.name}</b>`});

    console.log("arr->", arr);
    return arr;
  };
  useEffect(() => {
    GetTemplates();
    getStation();
    axios
      .get(`${appsetting.BaseApiUrl}/api/device/Timers/2/${serial}`)
      .then(function (response) {
        setTimers2(response.data);
        console.log(response.data);
      });
    setInterval(() => {
      getStation();
    }, 10000);
    
  }, []);
  return (
    <>
      <div className="container-fluid p-5 mt-3">
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="card">
              <div className="card-header w-100 bg-black text-white mb-2 d-flex justify-content-start p-2">
                <span
                  className={`mt-auto mb-auto updater-connection ${
                    device.isConnected ? "connected" : "disconnected"
                  }`}
                ></span>
                <p
                  className="mt-auto mb-auto"
                  style={{ marginRight: "15px", marginLeft: "auto" }}
                >
                  ایستگاه {device.name}
                </p>
                <button
                  className="float-left btn btn-primary"
                  style={{ marginLeft: "5px" }}
                  onClick={() => setSMSModal(true)}
                >
                  <FontAwesomeIcon icon={solid("envelope")} />
                  {" | "} ارسال پیامک
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => RelayRequest(12, 0)}
                  style={{ marginLeft: "10px" }}
                >
                  قطع همه
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => RelayRequest(11, 0)}
                >
                  وصل همه
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <p>مجموع توان اسمی</p>
                    <input
                      className="form-control"
                      value={`${device.totalPower} kw `}
                      disabled
                    ></input>
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <p>مجموع توان لحظه ای</p>
                    <input
                      className="form-control"
                      value={`${
                        device.totalAp
                          ? device.totalAp.toFixed(2)
                          : device.totalAp
                      } kw `}
                      disabled
                    ></input>
                  </div>

                  <div className="col-12 ">
                    <p>وضعیت</p>
                    <input
                      className="form-control"
                      value={device.status}
                      disabled
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            {device.boards &&
              device.boards.map((b, i) => (
                <>
                  <div key={i} className="card mt-3">
                    <div className="card-header bg-dark text-white d-flex justify-content-start">
                      <p
                        className="mt-auto mb-auto"
                        style={{ marginRight: "15px" }}
                      >
                        {b.name}
                      </p>
                      <div style={{ marginRight: "auto" }}>
                        {b.relayStatus ? (
                          <>
                            <button
                              className="btn-none text-success"
                              onClick={() => RelayRequest(12, b.boardNumber)}
                            >
                              <FontAwesomeIcon
                                className="fa-2x"
                                icon={solid("toggle-On")}
                              />
                            </button>
                          </>
                        ) : (
                          <>
                            <div>
                              <button
                                className="btn-none text-danger"
                                onClick={() => RelayRequest(11, b.boardNumber)}
                              >
                                <FontAwesomeIcon
                                  className="fa-2x"
                                  icon={solid("toggle-off")}
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-md-4">
                          <div className="mt-2">
                            <p>توان اسمی <small className="text-secondary">(KW)</small></p>
                            <input
                              className="form-control"
                              value={b.nominalPower + " kw"}
                              disabled
                            ></input>
                          </div>
                          <div className="mt-2">
                            <p>توان لحظه ای <small className="text-secondary">(KW)</small></p>
                            <input
                              className="form-control"
                              value={
                                b.activePower
                                  ? b.activePower.toFixed(2)
                                  : b.activePower + "KW"
                              }
                              disabled
                            ></input>
                          </div>
                        </div>

                        <div className="col-12 col-md-4">
                          <div className="mt-2">
                            <p>ولتاژ <small className="text-secondary">(V)</small></p>
                            <input
                              className="form-control"
                              value={b.voltage}
                              disabled
                            ></input>
                          </div>
                          <div className="mt-2">
                            <p>جریان <small className="text-secondary">(A)</small></p>
                            <input
                              className="form-control"
                              value={b.current}
                              disabled
                            ></input>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="mt-2">
                            <p>انرژی <small className="text-secondary">(KWH)</small></p>
                            <input
                              className="form-control"
                              value={
                                b.accumulativeEnergy
                                  ? b.accumulativeEnergy.toFixed(2)
                                  : b.accumulativeEnergy
                              }
                              disabled
                            ></input>
                          </div>
                          <div className="mt-2">
                            <p>زمان آخرین داده ارسالی</p>
                            <input
                              className="form-control"
                              value={b.lastDataTime}
                              disabled
                            ></input>
                          </div>
                        </div>
                        <div className="mt-2 col-8">
                          <p>نوع</p>
                          <input
                            className="form-control"
                            value={
                              b.type === 0
                                ? "کنترل کننده خط"
                                : "کنترل ولتاژ ورودی"
                            }
                            disabled
                          ></input>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-primary mt-5"
                            onClick={() => setExtra(b.detail)}
                          >
                            <FontAwesomeIcon icon={solid("eye")} />
                            {" | "}
                            مشاهده اطلاعات تکمیلی چیلر
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            {device.name !== undefined && (
              <>
                <div className="card mt-5">
                  <div className="card-header bg-dark text-white d-flex justify-content-start">
                   <p className="mt-auto mb-auto"> نمودار لحظه ای توان</p>
                    <div className=" me-auto d-flex justify-content-start w-50">
                      <select
                        className="form-control m-auto"
                        onChange={(e) => setChartSelect(parseInt(e.target.value))}
                      >
                        <option value={0}>ایستگاه را انتخاب کنید</option>
                        {device.boards.map((b,i) => (
                          <>
                            <option key={i}  value={b.boardNumber}>{b.name}</option>
                          </>
                        ))}
                      </select>
                      <button
                      style={{width:'inherit'}}
                        className="btn btn-success m-auto me-2"
                        onClick={() => getData()}
                      >
                        نمایش داده ها
                      </button>
                    </div>
                  </div>
                  <div className="card-body chart">
                    {chartData.length > 0 ? (
                      <>
                        <LineChart
                          width={chartWith}
                          height={450}
                          data={chartData}
                          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                          <XAxis dataKey="dateText" name="زمان" />
                          <YAxis />
                          <Line
                            type="monotone"
                            dataKey="pa"
                            name="توان"
                            unit="kw"
                            stroke="#8884d8"
                          />
                          <Tooltip />
                        </LineChart>
                      </>
                    ) : (
                      <>
                        <p className="text-center">
                          <FontAwesomeIcon
                            className="fa-4x text-warning"
                            icon={solid("exclamation-triangle")}
                          /><br/>
                          ابتدا ایستگاه را انتخاب کنید
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="card mt-5">
                  <div className="card-header bg-dark text-white d-flex justify-content-start">
                    ایستگاه {device.name} بر روی نقشه
                  </div>
                  <div className="card-body chart">
                    <Map loc={getGis()} />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="col-12 col-md-4 ">
            <div className="card ">
              <div className="card-header bg-dark text-white d-flex justify-content-start">
                زمان بندی
              </div>
              <div className="card-body">
                <ul className="nav nav-tabs card-header-tabs">
                  {/* <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-t1"
                      type="button"
                      role="tab"
                      aria-controls="nav-t1"
                      aria-selected="true"
                      aria-current="true"
                      href="#!"
                    >
                      نوع 1
                    </a>
                  </li> */}
                  <li className="nav-item">
                    <a
                      className="nav-link "
                      data-bs-toggle="tab"
                      data-bs-target="#nav-t2"
                      type="button"
                      role="tab"
                      aria-controls="nav-t2"
                      aria-selected="true"
                      aria-current="true"
                      href="#!"
                    >
                      تایمر
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a
                      className="nav-link "
                      data-bs-toggle="tab"
                      data-bs-target="#nav-t3"
                      type="button"
                      role="tab"
                      aria-controls="nav-t3"
                      aria-selected="true"
                      aria-current="true"
                      href="#!"
                    >
                      نوع 3
                    </a>
                  </li> */}
                </ul>
                <hr />
                <div className="tab-content">
                  {/* <div
                    className="tab-pane fade show active"
                    id="nav-t1"
                    role="tabpanel"
                  >
                    <div>
                      <div className="timer-item">
                        <p>چنل</p>
                        <p>زمان شروع</p>
                        <p>روشن</p>
                        <p>خاموش</p>
                        <p>نمایش</p>
                      </div>
                      {timers1.map((t) => (
                        <>
                          <div className="timer-item" key={t.channel}>
                            <p>{t.channel}</p>
                            <p>
                              {new perstanDate(new Date(t.StartDate)).format(
                                "YYYY/MM/DD"
                              )}
                            </p>
                            <p>{t.OnTime}</p>
                            <p>{t.OffTime}</p>
                            <p>
                              <button
                                className="btn-none"
                                onClick={() => ShowTimer1Modal(t.channel)}
                              >
                                <FontAwesomeIcon icon={solid("eye")} />
                              </button>
                            </p>
                          </div>
                        </>
                      ))}
                      <button className="btn btn-outline-primary mt-2 w-100" onClick={()=>ShowTimer1Modal(0)}>افزودن تایمر جدید</button>
                    </div>
                  </div> */}
                  <div
                    className="tab-pane fade show active  "
                    id="nav-t2"
                    role="tabpanel"
                  >
                    <div className="timer-item">
                      <p>چنل</p>
                      <p>زمان شروع</p>
                      <p>زمان پایان</p>
                      <p>وضعیت رله</p>
                      <p>نمایش</p>
                    </div>
                    {timers2.map((t) => (
                      <>
                        <div className="timer-item">
                          <p>{t.channel}</p>
                          <p>{new Date(t.startTime).toLocaleTimeString()}</p>
                          <p>{new Date(t.endTime).toLocaleTimeString()}</p>
                          <p>{t.RelayStatus ? "وصل" : "قطع"}</p>
                          <p>
                            <button
                              className="btn-none"
                              onClick={() => ShowTimer2Modal(t)}
                            >
                              <FontAwesomeIcon icon={solid("eye")} />
                            </button>
                          </p>
                        </div>
                      </>
                    ))}
                  </div>

                  {/* <div
                    className="tab-pane fade  "
                    id="nav-t3"
                    role="tabpanel"
                  >
                    <div className="timer-item">
                      <p>چنل</p>
                      <p>زمان شروع</p>
                      <p>زمان پایان</p>
                      <p>وضعیت رله</p>
                      <p>نمایش</p>
                    </div>
                    {timers3.map((t) => (
                      <>
                        <div className="timer-item">
                          <p>{t.channel}</p>
                          <p>{new perstanDate(new Date(t.StartDate)).format(
                                "YYYY/MM/DD"
                              )}</p>
                          <p>{new perstanDate(new Date(t.EndDate)).format(
                                "YYYY/MM/DD"
                              )}</p>
                          <p>{t.RelayStatus ?"وصل":"قطع"}</p>
                          <p>
                            <button
                              className="btn-none"
                              onClick={() => ShowTimer3Modal(t.channel)}
                            >
                              <FontAwesomeIcon icon={solid("eye")} />
                            </button>
                          </p>
                        </div>
                      </>
                    ))}
                    <button className="btn btn-outline-primary mt-2 w-100">افزودن تایمر جدید</button>
                  </div> */}
                </div>
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

      <Modal show={timer2Modal} onHide={() => resetTimer2()}>
        <Modal.Header>
          <Modal.Title>ویرایش تایمر </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <p>چنل</p>

            <input className="form-control" value={timers2Chan} disabled />
          </div>
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
              <label class="form-check-label" for="flexSwitchCheckChecked">
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
              <label class="form-check-label" for="flexSwitchCheckChecked">
                تایمر فعال باشد
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => SubmitTimer2()}>
            ثبت تغییرات
          </Button>
          <Button variant="secondary" onClick={() => setTimer2Modal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={extraDetailModal} onHide={() => resetExtra()}>
        <Modal.Header>
          <Modal.Title>ویرایش اطلاعات چیلر </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <p>تناژ چیلر</p>
            <input
              type="text"
              value={extraDetailChillerTonnage}
              onChange={(e) => setExtraChillerTonnage(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <div className="mb-2">
            <p>دیماند قراردادی</p>
            <input
              type="text"
              value={extraDetailContractualDimand}
              onChange={(e) => setExtraContractualDimand(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <div className="mb-2">
            <p>شماره پرونده</p>
            <input
              type="text"
              value={extraDetailFileNumber}
              onChange={(e) => setExtraFileNumber(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <div className="mb-2">
            <p>شماره قبض مشترک</p>
            <input
              type="text"
              value={extraDetailSubscriberBillID}
              onChange={(e) => setExtraSubscriberBillID(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <div className="mb-2">
            <p>تعرفه مشترک</p>
            <input
              type="text"
              value={extraDetailSubscriberTarrif}
              onChange={(e) => setExtraSubscriberTarrif(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <div className="mb-2">
            <p>ضریب کنتور</p>
            <input
              type="text"
              value={extraDetailMeterCoefficient}
              onChange={(e) => setExtraMeterCoefficient(e.target.value)}
              className="form-control"
            ></input>
          </div>
          <div className="mb-2">
            <p>شماره کنتور</p>
            <input
              type="text"
              value={extraDetailMeterNumber}
              onChange={(e) => setExtraMeterNumber(e.target.value)}
              className="form-control"
            ></input>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => submitExtraDetail()}>
            ثبت تغییرات
          </Button>
          <Button variant="secondary" onClick={() => resetExtra()}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={SMSModal} onHide={() => setSMSModal(false)}>
        <Modal.Header>
          <Modal.Title>ارسال پیامک</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <p>متن را وارد کنید</p>
            <textarea
              className="form-control "
              rows={5}
              value={smsText}
              onChange={(e) => setSMSText(e.target.value)}
            ></textarea>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="saveAsTemplateCheckbox"
                checked={SaveAsTemplate}
                onChange={(e) => setSaveAsTemplate(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="saveAsTemplateCheckbox"
              >
                ذخیره به عنوان قالب پیامک
              </label>
            </div>
          </div>
          <hr />
          <div className="mb-2">
            <p>انتخاب قالب های تعریف شده</p>
            <div className="list-group">
              {smsTemplates.length > 0 ? (
                smsTemplates.map((x) => (
                  <>
                    <li className="list-group-item list-group-item-action d-flex justify-content-start">
                      <button
                        type="button"
                        className="btn-none"
                        onClick={() => setSMSText(x.text)}
                      >
                        {x.text}
                      </button>
                      <button
                        className="btn-none"
                        style={{ margin: "auto auto auto 3px" }}
                        onClick={() => removeTemplate(x.id)}
                      >
                        <FontAwesomeIcon
                          icon={solid("trash")}
                          className="text-danger"
                        />
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
          <Button variant="primary" onClick={() => SendSMS()}>
            ثبت تغییرات
          </Button>
          <Button variant="secondary" onClick={() => setSMSModal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Station;

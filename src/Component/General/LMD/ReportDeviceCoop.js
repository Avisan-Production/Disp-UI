
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, Cell,Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { DatePicker  } from "zaman";

import appsetting from "../../../appsettings.json";

function ReportDeviceCoop() {
  const [devices, setDevices] = useState([]);
  const [selectedDate, selectDate] = useState({});
  const [selectedDevice, SelectDevice] = useState(0);
  const [selectedBoard, SelectBoard] = useState(0);
  const [showChart, ShowChart] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });
  const [chartData, setChartData] = useState([]);

  var chartWith =
    document.getElementsByClassName("chart")[0] !== undefined
      ? document.getElementsByClassName("chart")[0].offsetWidth
      : 900;
let select=(val)=>{
    var split=val.split('-');
    var serial=parseInt(split[0])
    var board=parseInt(split[1])
    SelectDevice(serial)
    SelectBoard(board);
};
  let getData = () => {
 
   var from=new Date(selectedDate.from)
   var to=new Date(selectedDate.to)

   var start = from
   start.setHours(0)
   start.setMinutes(0)
   start.setSeconds(1)
    var end=to;
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    var dto = {
      serial: selectedDevice,
      startDate: start.toJSON(),
      endDate: end.toJSON(),
      boardNumber:selectedBoard
    };
    console.log(dto);
    axios
      .post(`${appsetting.BaseApiUrl}/api/coop/device`, dto)
      .then(function (response) {
        console.log(response.data);
        
        setChartData(response.data);
        ShowChart(true);
      });
  };

  function downloadExcel() {
    var from=new Date(selectedDate.from)
    var to=new Date(selectedDate.to)
 
    var start = from
    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(1)
     var end=to;
     end.setHours(23)
     end.setMinutes(59)
     end.setSeconds(59)
     var dto = {
       serial: selectedDevice,
       startDate: start.toJSON(),
       endDate: end.toJSON(),
       boardNumber:selectedBoard
     };
    axios.post(`${appsetting.BaseApiUrl}/api/coop/device/excel`, dto,
        {
            headers:
            {
                'Content-Disposition': "attachment; filename=avisan-report.xlsx",
                
            },
            responseType: 'blob',
        }
    ).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'avisan-report.xlsx');
        document.body.appendChild(link);
        link.click();
    })
        .catch((error) => console.log(error));
}

  let getStation = () => {
    axios
      .get(`${appsetting.BaseApiUrl}/api/device/boards/detail`)
      .then(function (response) {
        setDevices(response.data);
        console.log(response.data);
      });
  };
  useEffect(() => {
  
    getStation()

  }, []);
  return (
    <>
      <div className="container">
        <div className="card mt-5">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            گزارشگیری همکاری ایستگاه
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-6">
                <p>ایستگاه را انتخاب کنید</p>
                <select
                  className="form-control"
                  onChange={(e) => select(e.target.value)}
                >
                  <option>ایستگاه را انتخاب کنید</option>
                  {devices.map((d) => (
                    <>
                      <option value={d.serial+'-'+d.boardNumber}>{d.name}</option>
                    </>
                  ))}
                </select>
              </div>
              <div className="col-md-6 col-12">
                <p> بازه زمانی را انتخاب کنید</p>
                <DatePicker
                  className="range-picker"
                  inputClass="form-control"
                  onChange={(e) => selectDate(e)}
                  range
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary m-2" onClick={() => getData()}>
              نمایش بر روی نمودار
            </button>
            <button
              className="btn btn-success m-2"
              onClick={() => downloadExcel()}
            >
              دریافت فایل اکسل
            </button>
          </div>
        </div>
        {showChart && (
          <>
            <div className="card mt-5">
              <div className="card-header bg-dark text-white d-flex justify-content-start">
                نمودار میزان همکاری
              </div>
              <div className="card-body chart">


             
        <BarChart
          width={chartWith}
          height={450}
          data={chartData}
        
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateText" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
          <Bar dataKey="coop" background={{ fill: '#eee' }} name="همکاری" fill="#8884d8" />
        </BarChart>
      
              </div>
            </div>
          </>
        )}
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

export default ReportDeviceCoop;

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  Cell,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { DatePicker } from "zaman";
import SearchSelect from "../../SearchSelect";

function ReportDeviceCoop() {
  const [devices, setDevices] = useState([]);
  const [selectedDate, selectDate] = useState({});
  const [selectedDevice, SelectDevice] = useState(0);
  const [selectedBoard, SelectBoard] = useState(0);
  const [showChart, ShowChart] = useState(false);
  
  const [chartData, setChartData] = useState([]);

  var chartWith =
    document.getElementsByClassName("chart")[0] !== undefined
      ? document.getElementsByClassName("chart")[0].offsetWidth
      : 900;
  let select = (val) => {
    var split = val.split("-");
    var serial = parseInt(split[0]);
    console.log(serial);
    var board = parseInt(split[1]);
    SelectDevice(serial);
    SelectBoard(board);
  };
  let getData = () => {
    var from = new Date(selectedDate.from);
    var to = new Date(selectedDate.to);

    var start = from;
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(1);
    var end = to;
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    var dto = {
      stationID: selectedDevice,
      startDate: start.toJSON(),
      endDate: end.toJSON(),
      boardNumber: selectedBoard,
    };
    console.log(dto);
    axios.post(`/api/coop/device`, dto).then(function (response) {
      console.log(response.data);

      setChartData(response.data);
      ShowChart(true);
    });
  };

  function downloadExcel() {
    var from = new Date(selectedDate.from);
    var to = new Date(selectedDate.to);

    var start = from;
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(1);
    var end = to;
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    var dto = {
      stationID: selectedDevice,
      startDate: start.toJSON(),
      endDate: end.toJSON(),
      boardNumber: selectedBoard,
    };
    axios
      .post(`/api/coop/device/excel`, dto, {
        headers: {
          "Content-Disposition": "attachment; filename=avisan-report.xlsx",
        },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "avisan-report.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.log(error));
  }

  let getStation = () => {
    axios.get(`/api/device/boards/detail`).then(function (response) {
      setDevices(response.data);
      console.log(response.data);
    });
  };
  useEffect(() => {
    getStation();
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
                <SearchSelect items={devices} onSelect={(d)=>select(d.stationID + "-" + d.boardNumber)} textField="name" placeholder="نام ایستگاه را وارد کنید" ></SearchSelect>
                {/* <select
                  className="form-control"
                  onChange={(e) => select(e.target.value)}
                >
                  <option>ایستگاه را انتخاب کنید</option>
                  {devices.map((d) => (
                    <>
                      <option value={d.stationID + "-" + d.boardNumber}>
                        {d.name}
                      </option>
                    </>
                  ))}
                </select> */}
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
              {chartData.length>0?<>
              <div style={{height:'450px' ,width:'100%'}} dir="ltr" >
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateText" >
                    <Label
                   position='left'
                    >زمان</Label>
                  </XAxis>
                   
                  <YAxis tickCount={20}  >
                  <Label
                   position='center' angle={-90} dx={-30}
                    >توان(KW)</Label>
                  </YAxis>
                  <Tooltip cursor={false}  wrapperStyle={{direction:'rtl'}}/>
                  <Legend />
                  <Brush dataKey="name" height={30} stroke="#8884d8" />
                  <Bar
                   barSize={30}
                    dataKey="coop"
                    background={{ fill: "#eee" }}
                    name="همکاری"
                    unit="KW"
                   
                    fill="#8884d8"
                  />
                </BarChart>
                </ResponsiveContainer>

              </div>
         
              </>:
              <>
              <p>داده ای برای نمایش در بازه انتخابی شما یافت نشد</p>
              </>
              }
              

              </div>
            </div>
          </>
        )}
      </div>

    </>
  );
}

export default ReportDeviceCoop;

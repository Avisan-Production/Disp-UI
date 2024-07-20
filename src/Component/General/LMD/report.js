
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
  Label,
} from "recharts";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { DatePicker  } from "zaman";
import SearchSelect from "../../SearchSelect";


function Report() {
  const [devices, setDevices] = useState([]);
  const [selectedDate, selectDate] = useState({});
  const [selectedDevice, SelectDevice] = useState(0);
  const [selectedBoard, SelectBoard] = useState(0);
  const [showChart, ShowChart] = useState(false);
  
  const [chartData, setChartData] = useState([]);


  let getData = () => {
   console.log(selectedDate.to)
   console.log(selectedDate.from)
   var from=new Date(selectedDate.from)
   var to=new Date(selectedDate.to)
   console.log(to)
   console.log(from)
   var start = from
   start.setHours(0)
   start.setMinutes(0)
   start.setSeconds(1)
    var end=to;
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    var dto = {
      stationID: selectedDevice,
      boardNumber:selectedBoard,
      startDate: start.toJSON(),
      endDate: end.toJSON(),
    };
    console.log(dto);
    axios
      .post(`/api/device/data/board/range`, dto)
      .then(function (response) {
        console.log(response.data);
        
        setChartData(response.data.datas);
        ShowChart(true);
      });
  };

  function downloadExcel() {
    console.log(selectedDate.to)
    console.log(selectedDate.from)
    var from=new Date(selectedDate.from)
    var to=new Date(selectedDate.to)
    console.log(to)
    console.log(from)
    var start = from
   start.setHours(0)
   start.setMinutes(0)
   start.setSeconds(1)
    var end=to;
    end.setHours(23)
    end.setMinutes(59)
    end.setSeconds(59)
    var dto = {
      stationID: selectedDevice,
      boardNumber:selectedBoard,
      startDate: start.toJSON(),
      endDate: end.toJSON(),
    };
    axios.post(`/api/device/data/board/excel`, dto,
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
let select=(val)=>{
  var split=val.split('-');
  var serial=parseInt(split[0])
  var board=parseInt(split[1])
  SelectDevice(serial)
  SelectBoard(board);
};
let getStation = () => {
  axios
    .get(`/api/device/boards/detail`)
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
            گزارشگیری بازه ای از مجموع توان
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-6">
                <p>پست را انتخاب کنید</p>
                <SearchSelect items={devices} onSelect={(d)=>select(d.stationID + "-" + d.boardNumber)} textField="name" placeholder="نام ایستگاه را وارد کنید" ></SearchSelect>
                {/* <select
                  className="form-control"
                  onChange={(e) => select(e.target.value)}
                >
                  <option>پست را انتخاب کنید</option>
                  {devices.map((d) => (
                    <>
                      <option value={d.stationID+'-'+d.boardNumber}>{d.name}</option>
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
                نمودار لحظه ای مجموع توان
              </div>
              <div className="card-body chart">
                {chartData.length>0?<>

                  <div dir="ltr" style={{ height: 450, width: "100%" }}>
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                              <LineChart
                                data={chartData}
                                margin={{
                                  top: 5,
                                  right: 20,
                                  bottom: 5,
                                  left: 0,
                                }}
                              >
                                <CartesianGrid
                                  stroke="#ccc"
                                  strokeDasharray="5 5"
                                />
                                <XAxis dataKey="dateText">
                                  <Label offset={30} position="left">زمان</Label>
                                </XAxis>

                                <YAxis tickCount={20}>
                                  <Label position="center" angle={-90} dx={-20}>
                                    توان(KW)
                                  </Label>
                                </YAxis>
                                <Line
                                  type="monotone"
                                  dataKey="power"
                                  name="توان"
                                  unit="kw"
                                  stroke="#8884d8"
                                />
                                <Tooltip />
                                <Brush dataKey="dateText"></Brush>
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                </>:<>
                <p>داده ای در این بازه زمانی یافت نشد</p>
                </>}
                
              </div>
            </div>
          </>
        )}
      </div>

     
    </>
  );
}

export default Report;

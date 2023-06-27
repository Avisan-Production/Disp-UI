import { useEffect, useState } from "react";
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
import { DatePicker  } from "zaman";

import appsetting from "../../../appsettings.json";

function ReportGroup(){
    const [groups, setGroups] = useState([]);
    const [selectedDate, selectDate] = useState({});
    const [selectedGroup, SelectGroup] = useState(0);
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
        id:parseInt( selectedGroup),
        startDate: start.toJSON(),
        endDate: end.toJSON(),
      };
      console.log(dto);
      axios
        .post(`${appsetting.BaseApiUrl}/api/group/data`, dto)
        .then(function (response) {
          console.log(response.data);
          
          setChartData(response.data.datas);
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
         id:parseInt( selectedGroup),
         startDate: start.toJSON(),
         endDate: end.toJSON(),
       };
      axios.post(`${appsetting.BaseApiUrl}/api/group/data/excel`, dto,
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
  
    let getGroups = () => {
      axios
        .get(`${appsetting.BaseApiUrl}/api/group/all`)
        .then(function (response) {
          setGroups(response.data);
          console.log(response.data);
        });
    };
    useEffect(() => {
    
      getGroups()
  
    }, []);
    return(
    <>
            <div className="container">
        <div className="card mt-5">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            گزارشگیری بازه ای از توان
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-md-6">
                <p>گروه را انتخاب کنید</p>
                <select className="form-control" onChange={(e)=>SelectGroup(e.target.value)} >
                    <option>گروه را انتخاب کنید</option>
                   
                  {
                    groups.map((d)=>(
                        <>
                        <option value={d.id}>{d.name}</option>
                        </>
                    ))
                  }
                </select>
              </div>
              <div className="col-md-6 col-12">
                <p> بازه زمانی را انتخاب کنید</p>
                <DatePicker className="range-picker" inputClass="form-control" onChange={(e) => selectDate(e)} range />
              </div>
              
            </div>
          </div>
          <div className="card-footer">
          <button className="btn btn-primary m-2"  onClick={()=>getData()}>
            نمایش بر روی نمودار
          </button>
            <button className="btn btn-success m-2" onClick={()=>downloadExcel()}>
                دریافت فایل اکسل
            </button>
          </div>
        </div>
        {
            showChart&&
            <>
        <div className="card mt-5">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            نمودار لحظه ای مجموع چراغ روشن
          </div>
          <div className="card-body chart">
            <LineChart
              width={chartWith}
              height={450}
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="apower" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="datetime" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </div>
        </div>    
            </>
        }
        
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
    </>)
}

export default ReportGroup;
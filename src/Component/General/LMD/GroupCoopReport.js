
import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, Cell,Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { DatePicker  } from "zaman";

import appsetting from "../../../appsettings.json";

function GroupCoopReport(){
    const [groups, setGroups] = useState([]);
    const [selectedDate, selectDate] = useState(new Date());
    const [selectedRangeDate, selectRangeDate] = useState({});
    const [selectedGroup, SelectGroup] = useState(0);
    const [selectedRangeGroup, SelectRangeGroup] = useState(0);
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
        : 1100;
  let select=(val,range)=>{
    var gp=parseInt(val)
    if(range){
        SelectRangeGroup(gp)
    }
    else{
        SelectGroup(gp)
    }
      
  };

    let getData = () => {
        console.log(selectedDate.value);
        var from=new Date(selectedDate.value)
        var to=new Date(selectedDate.value)
     
        var start = from
        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(1)
        var end=to;
        end.setHours(23)
        end.setMinutes(59)
        end.setSeconds(59)
      var dto = {
        id: selectedGroup,
        startDate: from.toJSON(),
        endDate:end.toJSON()
      };
      console.log(dto);
      axios
        .post(`${appsetting.BaseApiUrl}/api/coop/group`, dto)
        .then(function (response) {
          console.log(response.data);
          
          setChartData(response.data);
          ShowChart(true);
          chartWith =
      document.getElementsByClassName("chart")[0] !== undefined
        ? document.getElementsByClassName("chart")[0].offsetWidth
        : 1100;
        });

    }
  
    function downloadExcel() {
      var from=new Date(selectedRangeDate.from)
      var to=new Date(selectedRangeDate.to)
   
      var start = from
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(1)
       var end=to;
       end.setHours(23)
       end.setMinutes(59)
       end.setSeconds(59)
       var dto = {
         id:selectedRangeGroup,
         startDate: start.toJSON(),
         endDate: end.toJSON(),
         
       };
      axios.post(`${appsetting.BaseApiUrl}/api/coop/group/excel`, dto,
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
  
    let getGroup = () => {
      axios
      .get(`${appsetting.BaseApiUrl}/api/group/all`)
        .then(function (response) {
          setGroups(response.data);
          console.log(response.data);
        });
    };
    useEffect(() => {
    
      getGroup();
    }, []);
 return (
    <>
      <div className="container">
        <div className="row">
            <div className="col-md-6 col-12">
            <div className="card mt-5">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            گزارشگیری نمودار روزانه همکاری گروه ها
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 ">
                <p>گروه را انتخاب کنید</p>
                <select
                  className="form-control"
                  onChange={(e) => select(e.target.value,false)}
                >
                  <option value={0}>گروه را انتخاب کنید</option>
                  <option value={0}>همه گروه ها</option>
                  {groups.map((d) => (
                    <>
                      <option value={d.id}>{d.name}</option>
                    </>
                  ))}
                </select>
              </div>
              <div className=" col-12">
                <p> تاریخ را انتخاب کنید</p>
                <DatePicker
                  className="range-picker"
                  inputClass="form-control"
                  onChange={(e) => selectDate(e)}
                  
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary m-2" onClick={() => getData()}>
              نمایش بر روی نمودار
            </button>
            
          </div>
        </div>
            </div>
            <div className="col-md-6 col-12">
            <div className="card mt-5">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            گزارشگیری بازه ای همکاری گروه ها به فرمت اکسل
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 ">
                <p>گروه را انتخاب کنید</p>
                <select
                  className="form-control"
                  onChange={(e) => select(e.target.value,true)}
                >
                  <option>گروه را انتخاب کنید</option>
                  <option value={0}>همه گروه ها</option>
                  {groups.map((d) => (
                    <>
                      <option value={d.id}>{d.name}</option>
                    </>
                  ))}
                </select>
              </div>
              <div className=" col-12">
                <p> تاریخ را انتخاب کنید</p>
                <DatePicker
                  className="range-picker"
                  inputClass="form-control"
                  onChange={(e) => selectRangeDate(e)}
                  range
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
           
            <button
              className="btn btn-success m-2"
              onClick={() => downloadExcel()}
            >
              دریافت فایل اکسل
            </button>
          </div>
        </div>  
                </div>
        </div>
        

        {showChart && (
          <>
            <div className="card mt-5">
              <div className="card-header bg-dark text-white d-flex justify-content-start">
                نمودار لحظه ای مجموع توان {chartData.groupName} تاریخ {chartData.dateText}
              </div>
              <div className="card-body chart">
              <BarChart
          width={chartWith}
          height={450}
          data={chartData.values}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="name" angle={270}    tickMargin={20} /> */}
          <YAxis />
          <Tooltip />
          <Legend />
           
          <Bar dataKey="coop"   background={{ fill: '#eee' }} name="همکاری" fill="#000"  >
            <LabelList dataKey="name" width='100%' pheight='100%'  angle={-90}/>
            </Bar>
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

export default GroupCoopReport;
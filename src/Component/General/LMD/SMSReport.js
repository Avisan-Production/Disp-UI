import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "zaman";
import appsetting from "../../../appsettings.json";
import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";

function SMSReport() {
  const [datetime, setDate] = useState({});
  const [report, setReport] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLog,selectLog] = useState({});
  let GetData = () => {
    var date = new Date(datetime.value);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    axios
      .get(`/api/sms/report/${date.toJSON()}`)
      .then((res) => {
        console.log(res.data);
        setReport(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
let showLog=(l)=>{
    selectLog(l)
    setShowModal(true)
}
useEffect(()=>{
    GetData();
},[])
  return (
    <>
      <div className="container">
        <div className="card mt-4">
          <div className="card-header bg-dark text-white d-md-flex justify-content-start">
            <p className="m-auto me-0">گزارش پیامک های ارسال شده</p>
            <div className="me-auto d-flex mt-2 mt-md-auto">
              <DatePicker onChange={(e) => setDate(e)} />
              <button
                className="btn btn-success me-2"
                onClick={() => GetData()}
              >
                <FontAwesomeIcon icon={solid("eye")} />
                {" | نمایش"}
              </button>
            </div>
          </div>
          <div className="card-body">
            {report.length > 0 ? (
              <>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">نام فرستنده</th>
                      <th scope="col">نام دریافت کننده</th>
                      <th scope="col">شماره تماس دریافت کننده</th>
                      <th scope="col">زمان ارسال</th>
                      <th scope="col">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((r, i) => (
                      <>
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{r.senderName}</td>
                          <td>{r.contactName}</td>
                          <td>{r.contactNumber}</td>
                          <td>{r.sendDate}</td>
                          <td>
                            <button
                              className="btn-none"
                              onClick={() => showLog(r)}
                            >
                              <FontAwesomeIcon
                                className="text-primary"
                                icon={solid("eye")}
                              />
                            </button>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <p>
                  <FontAwesomeIcon icon={solid("exclamation-triangle")} /> داده
                  ای برای نمایش در این تاریخ وجود ندارد
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>نمایش جزئیات </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
            <div className="col-12 col-md-6">
            <p>نام ارسال کننده</p>
            <input className="form-control" value={selectedLog.senderName} disabled />
          </div>
          <div className="col-12 col-md-6">
            <p>تاریخ و زمان ارسال</p>
            <input className="form-control" value={selectedLog.sendDate} disabled />
          </div>
            </div>
         
          <div className="row mt-3">
          <div className="col-12 col-md-6">
            <p>نام دریافت کننده</p>
            <input className="form-control" value={selectedLog.contactName} disabled />
          </div>
          <div className="col-12 col-md-6">
            <p>شماره دریافت کننده</p>
            <input className="form-control" value={selectedLog.contactNumber} disabled />
          </div>
          <div className="col-12 col-md-12 mt-3">
            <p>متن پیامک</p>
            <textarea className="form-control" value={selectedLog.text} rows={5} disabled ></textarea>
          </div>
          
          </div>


        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-primary" onClick={()=>setShowModal(false)}>بستن پنجره</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default SMSReport;

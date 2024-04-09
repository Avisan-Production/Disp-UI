import axios from "axios";
import { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export default function Setting() {
  const [connectedMarker, setConnectedMarker] = useState(0);
  const [disconnectedMarker, setDisconnectedMarker] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });
  const role = localStorage.getItem("role");
  if (role !== "0") {
    window.location.href = "/dashboard";
  }
  const getSettings = () => {
    axios
      .get("/api/setting/map")
      .then((res) => {
        console.log(res.data);
        setConnectedMarker(res.data.connectedMarker);
        setDisconnectedMarker(res.data.disConnectedMarker);
      })

      .catch((err) => {
        console.log(err);
      });
  };
  const SaveSetting=()=>{
    const dto={connectedMarker:connectedMarker,disconnectedMarker:disconnectedMarker}
    axios
    .post("api/setting/map",dto)
    .then((res) => {
      console.log(res.data);
      getSettings()
      setToast({
        show: true,
        title: "تنظیمات",
        text: res.data,
        bg: "success",
      });
    })
    .catch((err) => {
      console.log(err);
      setToast({
        show: true,
        title: "تنظیمات",
        text: err.response.data,
        bg: "danger",
      });
    });
  }
  useEffect(() => {
    getSettings();
  }, []);
  return (
    <>
      <div className="container mt-4">
        <div className="card mt-5">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            تنظیمات نقشه
          </div>
          <div className="card-body p-5">
            <div className="form-group mb-3">
              <p>نمایش آیکون ایستگاه های متصل </p>
              <select
                className="form-control"
                value={connectedMarker}
                onChange={(e) => setConnectedMarker(parseInt(e.target.value))}
              >
                <option value={0}>سبز</option>
                <option value={1}>قرمز</option>
                <option value={2}>آبی</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <p>نمایش آیکون ایستگاه های قطع </p>
              <select
                className="form-control"
                value={disconnectedMarker}
                onChange={(e) =>
                  setDisconnectedMarker(parseInt(e.target.value))
                }
              >
                <option value={0}>سبز</option>
                <option value={1}>قرمز</option>
                <option value={2}>آبی</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={SaveSetting}>ثبت تغییرات</button>
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

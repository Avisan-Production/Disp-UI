import axios from "axios";
import { useEffect, useState } from "react";
import appsetting from "../../../appsettings.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

function Device() {
  const { serial } = useParams();
  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });
  const [modal, setModal] = useState(false);
  const [device, setDevice] = useState({});
  const [boards, setBoards] = useState([]);
  const [deviceserial, setSerial] = useState(0);
  const [faName, setFaName] = useState("");
  const [enName, setEnName] = useState("");
  const [lat, setLat] = useState(0.0);
  const [lon, setLon] = useState(0.0);
  const [active, setActive] = useState(false);
  const [installationDate, setInstall] = useState("");
  const [simCardNumber, setSimcardNumber] = useState("");
  const [description, setDescription] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  // boards states
  const [boardName, setBoardName] = useState("");
  const [boardNumber, setBoardNumber] = useState(0);
  const [boardNominalPower, setBoardNominalPower] = useState(0);
  const [boardType, setBoardType] = useState(0);
  const [boardis3Phase, setBoardis3Phase] = useState(false);
  const [boardTotalLights, setBoardTotalLights] = useState(0);
  const [boardLightPower, setBoardLightPower] = useState(0.0);
  const [boardShow, setBoardShow] = useState(false);
  const [isAdd, setIsAdd] = useState(true);

  const [apnDomain, SetDomain] = useState("test.avisaniot.ir");
  const [apnRoom, SetRoom] = useState("api/device/t");
  const [apnPort, SetPort] = useState(80);
  const [devCommand, SetCommand] = useState("");

  const [files, SetFiles] = useState([]);

  const [contacts, SetContacts] = useState([]);
  const [ContactName, SetContactName] = useState("");
  const [ContactNumber, SetContactNumber] = useState("");

  const navigator = useNavigate();
  let cntRow = 0;

  let SendCommand = () => {
    if (window.confirm("آیا از ارسال دستور مطمئن هستید؟")) {
      var dto = {
        serial: serial,
        command: devCommand,
      };
      axios
        .post(`/api/command/console`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "کنسول",
            text: "دستور ثبت شده است",
            bg: "success",
          });
          SetCommand("");
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "کنسول",
            text: "در ثبت دستور خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let handleDocSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("آیا از ارسال فایل مستندات مطمئن هستید؟")) {
      var formData = new FormData();
      debugger;
      var imagefiles = document.getElementById("DocumentsFileUpload").files;
      formData.append("serial", serial);
      for (var item of imagefiles) {
        formData.append("files", item);
      }
      axios
        .post(`/api/device/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          getFiles();
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "مستندات",
            text: "در آپلود فایل مستندات خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let removeFiles = (url) => {
    if (window.confirm("آیا از حذف مستند مطمئن هستید ؟")) {
      var dto = { stationID: parseInt(serial), fileName: url };
      axios
        .post(`/api/device/files/remove`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "مستندات",
            text: "فایل مستندات با موفقیت حذف شد",
            bg: "success",
          });
          getFiles()
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "مستندات",
            text: "در حذف فایل مستندات خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let getFiles = () => {
    axios
      .get(`/api/device/files/${serial}`)
      .then((res) => {
        SetFiles(res.data);
      })
      .catch((err) => {
        
      });
  };
  let getContacts = () => {
    axios
      .get(`/api/device/contact/${serial}`)
      .then((res) => {
        SetContacts(res.data);
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "لیست مخاطبین",
          text: "در واکشی لیست مخاطبین خطا رخ داده است",
          bg: "danger",
        });
      });
  };
  let Addcontact = () => {
    if (window.confirm("آیا از افزودن مخاطب مطمئن هستید")) {
      var dto = {
        id: 0,
        stationID: serial,
        name: ContactName,
        number: ContactNumber,
      };
      axios
        .post(`/api/device/contact/`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "مخاطبین",
            text: "مخاطب با موفقیت افزوده شد",
            bg: "success",
          });
          getContacts();
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "لیست مخاطبین",
            text: "در ثبت مخاطب خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let RemoveContact = (cnt) => {
    if (window.confirm("آیا از حذف مخاطب مطمئن هستید")) {
      axios
        .post(`/api/device/contact/remove`, cnt)
        .then((res) => {
          setToast({
            show: true,
            title: "مخاطبین",
            text: "مخاطب با موفقیت حذف شد",
            bg: "success",
          });
          getContacts();
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "لیست مخاطبین",
            text: "در حذف مخاطب خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let SelectBoard = (board) => {
    setBoardName(board.name);
    setBoardNumber(board.boardNumber);
    setBoardNominalPower(board.nominalPower);
    setBoardType(board.type);
    setBoardis3Phase(board.is3Phase);
    setBoardTotalLights(board.totalLights);
    setBoardLightPower(board.lightPower);
    setBoardShow(board.show);
    setIsAdd(false);
    setModal(true);
  };
  let resetStates = () => {
    setBoardName("");
    setBoardNumber(0);
    setBoardNominalPower(0);
    setBoardType(0);
    setBoardis3Phase(false);
    setBoardTotalLights(0);
    setBoardLightPower(0.0);
    setBoardShow(false);
    setIsAdd(true);
  };
  let submitBoard = () => {
    var dto = {
      StationID: serial,
      boardNumber: boardNumber,
      name: boardName,
      nominalPower: boardNominalPower,
      is3Phase: boardis3Phase,
      type: boardType,
      totalLights: parseInt(boardTotalLights),
      lightPower: parseFloat(boardLightPower),
      show: boardShow,
    };
    console.log(dto);
    if (isAdd) {
      if (window.confirm("آیا از افزودن برد مطمئن هستید ؟ ")) {
        axios
          .post(`/api/device/board`, dto)
          .then((res) => {
            setToast({
              show: true,
              title: "افزودن برد",
              text: res.data,
              bg: "success",
            });
            getBoards();
            resetStates();
            setModal(false);
          })
          .catch((err) => {
            setToast({
              show: true,
              title: "افزودن برد",
              text: err.response.data,
              bg: "danger",
            });
          });
      }
    } else {
      if (window.confirm("آیا از ویرایش برد مطمئن هستید ؟ ")) {
        axios
          .patch(`/api/device/board`, dto)
          .then((res) => {
            setToast({
              show: true,
              title: "ویرایش برد",
              text: res.data,
              bg: "success",
            });
            getBoards();
            resetStates();
            setModal(false);
          })
          .catch((err) => {
            setToast({
              show: true,
              title: "ویرایش برد",
              text: "در ویرایش برد خطا رخ داده است",
              bg: "danger",
            });
          });
      }
    }
  };
  let removeBoard = (bn) => {
    if (window.confirm("آیا از حذف برد مطمئن هستید ؟")) {
      var dto = {
        StationID: serial,
        board: bn,
      };
      axios
        .post(`/api/device/board/remove`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "حذف برد",
            text: res.data,
            bg: "success",
          });
          getBoards();
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "حذف برد",
            text: "در حذف برد خطا رخ داده است",
            bg: "danger",
          });
        });
    }
    getBoards();
  };
  let ChangeApn = () => {
    if (window.confirm("آیا از تغییر API مطمئن هستید ؟")) {
      var dto = {
        serial: serial,
        cmd: 21,
        domain: apnDomain,
        room: apnRoom,
        port: parseInt(apnPort),
      };
      console.log(dto);
      axios
        .post(`/api/command/request`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "تغییر API",
            text: res.data,
            bg: "success",
          });
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "تغییر API",
            text: "در تغییر API خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let removeDevice = () => {
    if (window.confirm("آیا از حذف دستگاه مطمئن هستید ؟")) {
      var dto = {
        stationID: parseInt(serial),
      };
      axios
        .post(`/api/device/remove`, dto)
        .then((res) => {
          setToast({
            show: true,
            title: "حذف دستگاه",
            text: res.data,
            bg: "success",
          });
          navigator("/devices");
        })
        .catch((err) => {
          setToast({
            show: true,
            title: "حذف دستگاه",
            text: "در حذف پست خطا رخ داده است",
            bg: "danger",
          });
        });
    }
  };
  let getDevice = () => {
    axios
      .get(`/api/device/${serial}`)
      .then((response) => {
        console.log(response.data);
        if (response.data != null || response.data !== undefined) {
          setSerial(response.data.serial)
          setDevice(response.data);
          setFaName(response.data.deviceName);
          setEnName(response.data.englishName);
          setLat(response.data.latitude);
          setLon(response.data.longitude);
          setSimcardNumber(response.data.simCardNumber);
          setActive(response.data.active);
          setInstall(response.data.installationDate);
          setDescription(response.data.description);
          setDestinationUrl(response.data.destinationUrl);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  let editDevice = () => {
    let dto = {
      StationID:serial,
      active: active,
      description: description,
      deviceName: faName,
      englishName: enName,
      installationDate: installationDate,
      latitude: lat,
      longitude: lon,
      serial: deviceserial,
      simCardNumber: simCardNumber,
      type: 0,
      destinationUrl:destinationUrl
    };
    axios
      .patch(`/api/device/detail`, dto)
      .then((res) => {
        setToast({
          show: true,
          title: "ویرایش دستگاه",
          text: res.data,
          bg: "success",
        });
        getDevice();
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "ویرایش دستگاه",
          text: err.response.data,
          bg: "danger",
        });
      });
  };
  let getBoards = () => {
    axios
      .get(`/api/device/boards/detail/${serial}`)
      .then((response) => {
        console.log(response.data);
        if (response.data !== null || response.data !== undefined) {
          setBoards(response.data);
          console.log(response.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    getDevice();
    getBoards();
    getContacts();
    getFiles();
  }, []);

  return (
    <>
      <div className=" row mb-4 p-4">
        <div className="col-12 col-md-4">
          <div className="card mt-5">
            <div className="card-header bg-dark text-white d-flex justify-content-start">
              {device.deviceName}
              <button
                className="btn btn-danger mt-auto mb-auto"
                style={{ marginLeft: "5px !important", marginRight: "auto" }}
                onClick={() => removeDevice()}
              >
                حذف دستگاه
              </button>
            </div>
            <div className="card-body ">
              <div className="mb-2">
                <p>سریال</p>
                <input
                  type="number"
                  value={deviceserial}
                  onChange={(e) => setSerial(parseInt(e.target.value))}
                  className="form-control"
                ></input>
              </div>
              <div className="mb-2">
                <p>نام فارسی :</p>
                <input
                  type="text"
                  className="form-control"
                  value={faName}
                  onChange={(e) => setFaName(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <p>نام لاتین :</p>
                <input
                  type="text"
                  value={enName}
                  className="form-control"
                  onChange={(e) => setEnName(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="mb-2 col-12 col-md-6">
                  <p>Lat :</p>
                  <input
                    value={lat}
                    type="number"
                    className="form-control"
                    min={0.0}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div className="mb-2 col-12 col-md-6">
                  <p>Lon :</p>
                  <input
                    className="form-control"
                    type="number"
                    value={lon}
                    min={0.0}
                    onChange={(e) => setLon(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <p>شماره سیمکارت :</p>
                <input
                  type="text"
                  value={simCardNumber}
                  className="form-control"
                  onChange={(e) => setSimcardNumber(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <p>زمان نصب :</p>
                <input
                  type="text"
                  className="form-control"
                  value={installationDate}
                  onChange={(e) => setInstall(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <p>آدرس APN مقصد :</p>
                <input
                  type="text"
                  className="form-control"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <p>توضیحات :</p>
                <textarea
                  type="text"
                  cols={5}
                  value={description}
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked9"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked9"
                >
                  دستگاه فعال است ؟
                </label>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary w-100"
                onClick={() => editDevice()}
              >
                ثبت تغییرات
              </button>
            </div>
          </div>
          <div className="card mt-5">
            <div className="card-header bg-dark text-white d-flex justify-content-start">
              تغییر آدرس API دستگاه
            </div>
            <div className="card-body ">
              <div className="mb-2">
                <p>Domain</p>
                <input
                  type="text"
                  value={apnDomain}
                  onChange={(e) => SetDomain(e.target.value)}
                  className="form-control"
                ></input>
              </div>
              <div className="mb-2">
                <p>Room</p>
                <input
                  type="text"
                  value={apnRoom}
                  onChange={(e) => SetRoom(e.target.value)}
                  className="form-control"
                ></input>
              </div>
              <div className="mb-2">
                <p>Port</p>
                <input
                  type="text"
                  value={apnPort}
                  onChange={(e) => SetPort(e.target.value)}
                  className="form-control"
                ></input>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary w-100"
                onClick={() => ChangeApn()}
              >
                ثبت تغییرات
              </button>
            </div>
          </div>
          <div className="card mt-5">
            <div className="card-header bg-dark text-white d-flex justify-content-start">
              کنسول دستگاه
            </div>
            <div className="card-body ">
              <div className="mb-2">
                <p>دستور را وارد کنید</p>
                <input
                  type="text"
                  value={devCommand}
                  onChange={(e) => SetCommand(e.target.value)}
                  className="form-control"
                ></input>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary w-100"
                onClick={() => SendCommand()}
              >
                ثبت دستور
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8 mt-5 ">
          <div className="col-12 bg-black p-2 mb-2  d-flex justify-content-start text-white">
            <p
              className="mb-auto mt-auto"
              style={{ marginLeft: "auto", marginRight: "5px" }}
            >
              مدیریت برد ها
            </p>
            <button className="btn btn-success" onClick={() => setModal(true)}>
              افزودن برد جدید
            </button>
          </div>
          <div className="row col-12 p-3">
            {boards.map((b) => (
              <>
                <div className="card mb-2 col-12 col-md-6 p-0">
                  <div className="card-header bg-black text-white">
                    برد : {b.name}
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-12 mb-2">
                        <p>شماره برد</p>
                        <input
                          type="text"
                          className="form-control"
                          value={b.boardNumber}
                          disabled
                        />
                      </div>
                      <div className="col-md-6 col-12 mb-2">
                        <p>
                          توان اسمی{" "}
                          <small className="text-secondary">(KW)</small>
                        </p>
                        <input
                          type="text"
                          className="form-control"
                          value={b.nominalPower}
                          disabled
                        />
                      </div>
                      <div className="col-md-6 col-12 mb-2">
                        <p>نوع برد</p>
                        <select
                          className="form-control"
                          value={b.type}
                          disabled
                        >
                          <option value={0}>کنترل کننده خط</option>
                          <option value={1}>هشدار دهنده</option>
                        </select>
                      </div>
                      <div className="col-md-6 col-12 mb-2">
                        <p>نوع فاز</p>
                        <input
                          type="text"
                          className="form-control"
                          value={b.is3Phase ? "3 فاز" : "تک فاز"}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-between">
                    <button
                      className="btn btn-primary"
                      onClick={() => SelectBoard(b)}
                    >
                      <FontAwesomeIcon
                        icon={solid("edit")}
                        style={{ marginLeft: "5px" }}
                      />{" "}
                      |&nbsp; ویرایش برد
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeBoard(b.boardNumber)}
                    >
                      <FontAwesomeIcon
                        icon={solid("trash")}
                        style={{ marginLeft: "5px" }}
                      />
                      |&nbsp; حذف برد
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="col-12 bg-black p-2 mb-2  d-flex justify-content-start text-white">
            <p
              className="mb-auto mt-auto"
              style={{ marginLeft: "auto", marginRight: "5px" }}
            >
              مخاطببین ایستگاه
            </p>
          </div>
          <div className="col-12 p-3 row">
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">لیست مخاطببین</div>
                <div className="card-body">
                  <table className="table table-hovered">
                    <thead>
                      <tr>
                        <td>#</td>
                        <td>نام مخاطب</td>
                        <td>شماره تماس</td>
                        <td>عملیات</td>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.length > 0 ? (
                        contacts.map((c) => (
                          <>
                            <tr>
                              <td>{++cntRow}</td>
                              <td>{c.name}</td>
                              <td>{c.number}</td>
                              <td>
                                <button
                                  className="btn-none"
                                  onClick={() => RemoveContact(c)}
                                >
                                  <FontAwesomeIcon
                                    icon={solid("trash")}
                                    className="text-danger"
                                  />
                                </button>
                              </td>
                            </tr>
                          </>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td colspan="4">
                              مخاطبی برای این ایستگاه یافت نشد
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card">
                <div className="card-header">افزودن مخاطب جدید</div>
                <div className="card-body">
                  <div className="mb-2">
                    <p>نام مخاطب</p>
                    <input
                      className="form-control"
                      value={ContactName}
                      onChange={(e) => SetContactName(e.target.value)}
                    ></input>
                  </div>
                  <div className="mb-2">
                    <p>شماره مخاطب</p>
                    <input
                      className="form-control"
                      value={ContactNumber}
                      onChange={(e) => SetContactNumber(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-primary"
                    onClick={() => Addcontact()}
                  >
                    ثبت مخاطب جدید
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 col-12">
            <div className="bg-dark text-white p-2">
              <p className="m-0">مستندات ایستگاه</p>
            </div>
            <div className="col-12 mt-2">
              <form
                enctype="multipart/form-data"
                onSubmit={(e) => handleDocSubmit(e)}
              >
                <div className="input-group mb-3" dir="ltr">
                  <input
                    type="file"
                    className="form-control"
                    name="docfile"
                    multiple
                    accept="image/png, image/gif, image/jpeg"
                    id="DocumentsFileUpload"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="submit"
                    id="inputGroupFileAddon04"
                  >
                    <FontAwesomeIcon icon={solid("upload")} />
                  </button>
                </div>
              </form>
            </div>
            <div className="col-12 row mt-1">
              {files.map((f) => (
                <>
                  <div className="col-12 col-md-3">
                    <div className="card">
                      <img
                        src={`${appsetting.BaseApiUrl}${f.fileName}`}
                        style={{ height: "150px" }}
                        class="card-img-top"
                        alt="مستندات"
                      />
                      <div class="card-body">
                        <a
                          href={`${f.fileName}`}
                          className="btn btn-primary w-100"
                          target="_blank"
                        >
                          <FontAwesomeIcon
                            icon={solid("magnifying-glass-plus")}
                          />{" "}
                          {" | بزرگنمایی"}{" "}
                        </a>
                        <button
                          className="btn btn-danger w-100 mt-1"
                          onClick={() => removeFiles(f.fileName)}
                        >
                          <FontAwesomeIcon icon={solid("trash")} />
                          {" | حذف"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal show={modal}>
        <Modal.Header>
          <Modal.Title>افزودن دستگاه جدید</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <p>نام برد :</p>
            <input
              type="text"
              className="form-control"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <p>شماره برد :</p>
            {isAdd ? (
              <>
                <input
                  type="number"
                  className="form-control"
                  value={boardNumber}
                  min={0}
                  onChange={(e) => setBoardNumber(e.target.value)}
                />
              </>
            ) : (
              <>
                <input
                  type="number"
                  className="form-control"
                  value={boardNumber}
                  min={0}
                  disabled
                />
              </>
            )}
          </div>

          <div className="mb-2">
            <p>
              توان اسمی <small className="text-secondary">(KW)</small>:
            </p>
            <input
              type="number"
              className="form-control"
              min={0}
              value={boardNominalPower}
              onChange={(e) => setBoardNominalPower(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <p>نوع برد :</p>
            <select
              value={boardType}
              className="form-control"
              onChange={(e) => setBoardType(e.target.value)}
            >
              <option value={0}>کنترل کننده خط</option>
              <option value={1}>هشدار دهنده</option>
            </select>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked9"
              checked={boardShow}
              onChange={(e) => setBoardShow(e.target.checked)}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked9"
            >
              آیا برد نمایش داده شود ؟
            </label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked9"
              checked={boardis3Phase}
              onChange={(e) => setBoardis3Phase(e.target.checked)}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked9"
            >
              آیا برد 3 فاز است ؟
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => submitBoard()}>
            ثبت تغییرات
          </Button>
          <Button variant="secondary" onClick={() => setModal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
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

export default Device;

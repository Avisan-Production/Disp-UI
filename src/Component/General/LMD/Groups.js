import axios from "axios";
import { useEffect, useState } from "react";
import appsetting from "../../../appsettings.json";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
function Groups() {
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([]);
  const [groupDevices, setGroupDevices] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupID, setGroupID] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [temp, setTemp] = useState(false);
  const [addGroupModal, setAddModalModal] = useState(true);
  const [search,setSearch]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    show: false,
    title: "",
    text: "",
    bg: "",
  });
  let Search=(txt)=>{
    setSearchQuery(txt)
  console.log(devices);
  console.log(search);
    if(txt.length>0){
        var filter=devices.filter(x=>x.deviceName.includes(txt))
        setSearch(filter)
    }
    else{
      setSearch(devices)
    }
    // checkThem(groupDevices)
  }
  let getGroups = () => {
    axios
      .get(`/api/group/all`)
      .then((res) => {
        setGroups(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "گروه ها",
          text: "در دریافت اطلاعات خطا رخ داده است",
          bg: "danger",
        });
      });
  };
  let getDevices = (add) => {
    var url=`/api/device/${add?'unassigned':'all'}`
    
    axios
      .get(url)
      .then((res) => {
        setDevices(res.data);
        setSearch(res.data);
        // checkThem(groupDevices)
      })
      .catch((err) => {
        setToast({
          show: true,
          title: "گروه ها",
          text: "در دریافت اطلاعات خطا رخ داده است",
          bg: "danger",
        });
      });
  };
let resetModal=()=>{
    // var elems=document.querySelectorAll(
    //     'input[type="checkbox"][name="device-serial"]:checked'
    //   )
    //   for(var item of elems){
    //     item.checked=false;
    //   }
      setGroupID(0)
      setGroupName('')
      setGroupDevices([])
      setShowModal(false)
}
let removeGroup=(id)=>{
    if(window.confirm('آیا از حذف گروه مطمئن هستید ؟ ')){
        axios.post(`/api/group/remove/${id}`)
        .then((res)=>{
           setToast({
               show: true,
               title: "گروه ها",
               text: "گروه با موفقیت حذف شد",
               bg: "success",
             }); 
             getGroups()
             
        })
        .catch((err)=>{
           setToast({
               show: true,
               title: "گروه ها",
               text: "در حذف گروه خطا رخ داده است",
               bg: "danger",
             }); 
        })
    }
  
}
let checkChange=(serial)=>{
 
  var list=groupDevices;
    if(list.includes(serial)){
      list.splice(list.indexOf(serial),1);
    }
    else{
      list.push(serial)
    }
  setGroupDevices(list)
  setTemp(!temp)
}
let SubmitGroup=(add)=>{
   
    if(groupName.length>0){
      
        if(groupDevices.length>0){
            if(add){
                var dto = {
                    name: groupName,
                    devices:groupDevices
                  };
                 console.log(dto); 
                 axios.post(`/api/group`,dto)
                 .then((res)=>{
                    setToast({
                        show: true,
                        title: "گروه ها",
                        text: "گروه با موفقیت ثبت شد",
                        bg: "success",
                      }); 
                      getGroups()
                      setShowModal(false)
                      resetModal()
                 })
                 .catch((err)=>{
                    setToast({
                        show: true,
                        title: "گروه ها",
                        text: err.response.data,
                        bg: "danger",
                      }); 
                 })
            }
            else{
                var editdto = {
                    id:groupID,
                    name: groupName,
                    devices:groupDevices
                  };
                 console.log(dto); 
                 axios.patch(`/api/group`,editdto)
                 .then((res)=>{
                    setToast({
                        show: true,
                        title: "گروه ها",
                        text: "گروه با موفقیت ویرایش شد",
                        bg: "success",
                      }); 
                      getGroups()
                      setShowModal(false)
                      resetModal()
                 })
                 .catch((err)=>{
                    setToast({
                        show: true,
                        title: "گروه ها",
                        text: "در ویرایش گروه خطا رخ داده است",
                        bg: "danger",
                      }); 
                 })
            }
           
        }
        else{
            setToast({
                show: true,
                title: "گروه ها",
                text: "پستی برای گروه انتخاب نشده است",
                bg: "danger",
              }); 
        }
      
    }
    else{
        setToast({
            show: true,
            title: "گروه ها",
            text: "نام گروه نمی تواند خالی باشد",
            bg: "danger",
          });
    }
}
let openModal=()=>{
    getDevices(true);
    setGroupID(0)
    setGroupName('')
    setShowModal(true)
}
let openEditModal=(group)=>{
    console.log(group);
    setGroupID(group.id)
    setGroupName(group.name)
    setGroupDevices(group.devices)
    getDevices(false);
    setShowModal(true)
    setAddModalModal(false)
}
// let checkThem=(list)=>{
//     console.log(list)
//         for(var item of list){
//             var el=document.querySelector(`[name="device-serial"][value="${item}"]`)
//             if(el)
//                 el.checked=true
//         }    
    
    
// }
  useEffect(() => {
    getGroups();
   
  }, []);
  return (
    <>
      <div className="container">
        <div className="card mt-2">
          <div className="card-header bg-dark text-white d-flex justify-content-start">
            <p className="mt-auto mb-auto">گروه ها</p>
            <button
              className="btn btn-success mt-auto mb-auto"
              style={{ marginRight: "auto" }}
              onClick={() => openModal()}
            >
              افزودن گروه جدید
            </button>
          </div>
          <div className="card-body table-responsive">
            <table className="table  table-hovered">
              <thead>
                <tr>
                  <td>ردیف</td>
                  <td>نام گروه</td>
                  <td>تعداد پست زیر مجموعه</td>
                  <td>عملیات</td>
                </tr>
              </thead>
              <tbody>
                {groups.length > 0 ? (
                  groups.map((g,i) => (
                    <>
                      <tr key={g.id}>
                        <td>{i + 1}</td>
                        <td>{g.name}</td>
                        <td>{g.devices.length}</td>
                        <td className="d-flex justify-content-center">
                          <button
                            className="btn-none m-2 text-danger hover"
                            onClick={() => removeGroup(g.id)}
                          >
                            {" "}
                            <FontAwesomeIcon icon={solid("trash")} />
                          </button>
                          <button
                            className="btn-none m-2 text-primary hover"
                            onClick={() => openEditModal(g)}
                          >
                            {" "}
                            <FontAwesomeIcon icon={solid("eye")} />
                          </button>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan={4}>تا کنون گروهی ثبت نکرده اید</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
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
      <Modal show={showModal} onHide={() => resetModal()}>
        <Modal.Header>
          <Modal.Title>
          {addGroupModal>0?<>ایجاد گروه جدید</>:<>ویرایش گروه {groupName}</>}  
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>نام گروه را وارد کنید</p>
            <input
              type="text"
              className="form-control"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <p>زیر مجموعه گروه را انتخاب کنید ({groupDevices.length} مورد انتخاب شد)</p>
          <div>
            <div className="col-12 d-md-flex justify-content-start">
              <p className="mt-auto mb-auto">جستجو</p>
              <input
                className="form-control me-3 w-50"
                onChange={(e) => Search(e.target.value)}
              ></input>
            </div>
            <hr />
            <div
              className="mt-2"
              style={{ maxHeight: "250px", overflowY: "scroll" }}
            >
              {devices.length > 0 ? (
                <>
                  <ul className="list-group" style={{ marginRight: "-40px" }}>
                    {search.map((d,i) => (
                      <>
                        <li className="list-group-item" key={i}>
                          {groupDevices.includes(d.id) ? (
                            <>
                              <FontAwesomeIcon
                                icon={solid("check-square")}
                                className="text-success"
                                style={{ marginLeft: 5 }}
                              />
                            </>
                          ) : (
                            <>
                              <span className="me-3"></span>
                            </>
                          )}
                          <span>{d.deviceName}</span>
                          <button
                            className="btn-none hover "
                            style={{ float: "left" }}
                            onClick={()=>checkChange(d.id)}
                          >
                            {groupDevices.includes(d.id) ? 
                              <>
                                
                                <FontAwesomeIcon icon={solid("times-circle")} className="text-danger" />
                              </>
                             : 
                              <>
                               
                                <FontAwesomeIcon icon={solid("check-circle")} className="text-success" />
                              </>
                            }
                          </button>
                        </li>
                      </>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <div className="alert alert-warning">
                    <p>پست اختصاص داده نشده یافت نشد</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => SubmitGroup(groupID > 0 ? false : true)}
          >
            ثبت تغییرات
          </Button>
          <Button variant="secondary" onClick={() => resetModal()}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Groups;

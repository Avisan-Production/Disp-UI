import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../../Assets/css/asideNav.css'
import appsetting from '../../../appsettings.json'
import { useEffect, useState } from 'react'
import axios from "axios";

const LMDAside=(props)=>{
  const [devices,setDevices]=useState([]);
  const [searchDevices,setSearchDevices]=useState([]);
  let getStation = () => {
    axios
      .get(`${appsetting.BaseApiUrl}/api/device/boards/detail`)
      .then(function (response) {
        setDevices(response.data);
        console.log(response.data);
      });
  };
  let search=(text)=>{
    if(text.length>0){
      var filter=devices.filter(x=>x.name.includes(text));
      setSearchDevices(filter)
    }
    else{
      setSearchDevices([]);
    }
  }
    useEffect(()=>{
      getStation();
    },[])
    
    return (
      <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <span className="navbar-brand" href="#!">
              <FontAwesomeIcon icon={solid("bars")} /> {' منو '}
            </span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav  mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/dashboard"
                  >
                    داشبورد
                  </a>
                </li>
                {props.report && (
                  <>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#!"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        گزارشگیری
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="/report/station">
                            گزارش گیری ایستگاه ها
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/report/group">
                            گزارش گیری گروه ها
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a className="dropdown-item" href="/report/sms">
                            گزارش گیری پیامک های ارسالی
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="/report/coop/station"
                          >
                            گزارش گیری همکاری ایستگاه
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="/report/coop/group"
                          >
                            گزارش گیری همکاری گروه
                          </a>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#!"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    تنظیمات
                  </a>
                  <ul className="dropdown-menu">
                    {props.station && (
                      <>
                        <li>
                          <a className="dropdown-item" href="/devices">
                            مدیریت پست ها
                          </a>
                        </li>
                      </>
                    )}
                    {props.group && (
                      <>
                        <li>
                          <a className="dropdown-item" href="/groups">
                            مدیریت گروه ها
                          </a>
                        </li>
                      </>
                    )}
                    {props.user && (
                      <>
                        <li>
                          <a className="dropdown-item" href="/users">
                            مدیریت کاربران
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#!">
                    مانیتورینگ
                  </a>
                </li>
              </ul>
              <div className=" me-auto" style={{ position: "relative" }}>
                <input
                  className="form-control "
                  type="search"
                  placeholder="جستجو"
                  aria-label="Search"
                  onChange={(e)=>search(e.target.value)}
                />
                {searchDevices.length > 0 && (
                  <>
                    <div className="search-autocomplete">
                      <ul>
                        {searchDevices.map((d)=>(<>
                          <li>
                          <a href={`/station/${d.serial}`}>{d.name}</a>
                        </li> 
                        </>))}
                       
                       
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </>
    );

}
export default LMDAside;
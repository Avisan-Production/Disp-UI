import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro"; // <-- import styles to be used
import { Link, useNavigate } from "react-router-dom";
import appsetting from "../../appsettings.json";
import axios from "axios";

const Navbar = (props) => {
  const navigate = useNavigate();
  const SignOut = () => {
    var rToken = localStorage.getItem("refreshtoken");
    var dto = { token: rToken };
    axios
      .post(`${appsetting.BaseApiUrl}/api/user/signout`, dto)
      .then(function (response) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshtoken");
        navigate("/");
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg  bg-dark text-white">
        <div className="container-fluid d-md-flex justify-content-md-start">
          <a className="navbar-brand ml-auto" href="#!">
            سامانه جامع IOT آویسان &nbsp;
            {props.SYSName !== "" && <>| {props.SYSName}</>}
          </a>
          {props.logged && (
            <>
              <ul className="navbar-nav" style={{ marginRight: "auto" }}>
                <li className="nav-item">
                  <div className="dropdown">
                    <button
                      className="nav-link active dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      aria-current="page"
                    >
                      <FontAwesomeIcon icon={solid("user")} />
                    </button>

                    <ul className="dropdown-menu" dir="rtl">
                      <li>
                        <p>سبحان عبدی</p>
                        <p className="text-secondary">مدیر</p>
                       
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      {/* <li>
                          <a
                            className="dropdown-item"
                            style={{ textAlign: "right" }}
                            href="#!"
                          >
                            <FontAwesomeIcon icon={solid("user-circle")} />{" "}
                            پروفایل
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            style={{ textAlign: "right" }}
                            href="#!"
                          >
                            <FontAwesomeIcon icon={solid("cog")} /> تنظیمات
                          </a>
                        </li> */}

                      <li>
                        <button
                          className="dropdown-item btn-none"
                          style={{ textAlign: "right" }}
                          onClick={SignOut}
                        >
                          <FontAwesomeIcon icon={solid("sign-out")} /> خروج
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

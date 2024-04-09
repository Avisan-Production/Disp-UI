import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function DashboardItem(props) {
  const [item, setItem] = useState({});
  const [selected, setSelected] = useState(false);

  let initiate = () => {
    setItem(props.item);
    setSelected(props.selected);
   
    setSelected(props.selected);
   
  };

  let check = (e) => {
    if (e.target.checked) {
      props.onSelect();
    } else {
      props.onUnSelect();
    }
  setSelected(e.target.checked)
  };
  useEffect(() => {
    initiate();
  }, [props]);
  return (
    <>
      <>
        <tr>
          <td>
            {/* <span style={{marginRight:'-5px',marginLeft:'5px'}}>
                              {selected &&
                                <>
                                
                                <FontAwesomeIcon icon={solid('check-square')} color="green" />
                                </>
                                
                                }
                                </span> */}
            <span>{props.row}</span>
          </td>

          <td>
            <Link to={`/station/${item.id}`}>
              {item.deviceName + " - " + item.boardName}
            </Link>{" "}
          </td>
          <td>{item.nominalPower}</td>
          <td data-el="ap">
            <span dir="ltr">{item.activePower + " KW "}</span>{" "}
          </td>
          <td>
            {item.type === 1 && (
              <>
                <FontAwesomeIcon
                  icon={solid("bullhorn")}
                  className="text-danger"
                />
              </>
            )}
          </td>

          <td>{item.relay ? "وصل" : "قطع"}</td>
          <td>
            <span
              className={`updater-connection ${
                item.isConnected ? "connected" : "disconnected"
              }`}
              data-el="con"
            ></span>
          </td>
          <td>
          
                <input type="checkbox" onChange={(e)=>check(e)}  checked={selected} />
                {/* <button className="btn-none hover" onClick={props.onUnSelect}>
                                    لغو
                                  </button> */}
          
          </td>
        </tr>
      </>
    </>
  );
}

export default DashboardItem;

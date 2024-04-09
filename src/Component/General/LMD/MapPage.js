import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import redMarker from "../../../Assets/images/marker-icon-red.png";
import greenMarker from "../../../Assets/images/marker-icon-green.png";
import blueMarker from "../../../Assets/images/marker-icon.png";
import shadowMarker from "../../../Assets/images/marker-shadow.png";
import axios from "axios";
function MapPage() {
    const [devices, setDeices] = useState([]);
    const [setting, setSetting] = useState({});

    const role=localStorage.getItem("role")
    let getDashboard = () => {
        axios
          .get(`/api/device/dashboard`)
          .then(function (response) {
           setSetting(response.data.setting)
            setDeices(response.data.devices)
          });
      };
 // create map
 const mapRef = useRef(null);
 useEffect(() => {
  getDashboard();

   mapRef.current = L.map("map", {
     center: [35.7215115, 51.3449087],
     zoom: 8,
     layers: [
       L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")
     ]
   });
 }, []);

 // add layer
 const layerRef = useRef(null);
 useEffect(() => {
   layerRef.current = L.layerGroup().addTo(mapRef.current);
 }, []);
 useEffect(() => {
   layerRef.current.clearLayers();
   var greenIcon = L.icon({
          iconUrl: greenMarker,
          shadowUrl: shadowMarker,
          iconSize:[25,41],
          iconAnchor:[12.5,41]
        });
        var redIcon = L.icon({
          iconUrl: redMarker,
          shadowUrl: shadowMarker,
          iconSize:[25,41],
          iconAnchor:[12.5,41]
        });
        var blueIcon = L.icon({
          iconUrl: blueMarker,
          shadowUrl: shadowMarker,
          iconSize:[25,41],
          iconAnchor:[12.5,41]
        });
   for (var item of devices) {
          var arr = [item.lat, item.lon];
          let connectedMarker;
          let disconnectedMarker;
          if(setting.connectedMarker===0)connectedMarker=greenIcon
          if(setting.connectedMarker===1)connectedMarker=redIcon
          if(setting.connectedMarker===2)connectedMarker=blueIcon
          if(setting.disConnectedMarker===0)disconnectedMarker=greenIcon
          if(setting.disConnectedMarker===1)disconnectedMarker=redIcon
          if(setting.disConnectedMarker===2)disconnectedMarker=blueIcon
          var icon = item.isConnected ? connectedMarker :disconnectedMarker;
         var marker = L.marker(arr, { icon: icon ,autoPanOnFocus:true,autoPan:true}).addTo(layerRef.current);
          let pop = `<strong>${item.deviceName}-${item.boardName}</strong><br/><span>توان اسمی:<strong>${item.nominalPower.toFixed(2)}</strong></span><br/><span>توان لحظه ای:<strong>${item.activePower.toFixed(2)}</strong></span><br/><a href="/station/${item.id}" target="_blank">نمایش</a>`;
          marker.bindPopup(pop);
        }
   
    
 }, [devices]);

  return (
    <>
      <div>
        {role===0 &&<>
        رنگ ایستگاه های قطع : 
        </>}
        <div id="map" style={{ height: "100vh" }}></div>
      </div>
    </>
  );
}
export default MapPage;

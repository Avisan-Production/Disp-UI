import L from 'leaflet'
import { useEffect } from 'react';

function Map(props){
useEffect(()=>{
    console.log(props.loc);
    document.getElementById("map").innerHTML=''
    if(props.loc.length>0){
      var map = L.map('map').setView([props.loc[0].lat,props.loc[0].lon], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        
       }).addTo(map);
      for(var item of props.loc){
        var arr=[item.lat,item.lon];
        var marker = L.marker(arr).addTo(map);
        marker.bindPopup(item.pop).openPopup();
      }
      
    
    }
    else{
      document.getElementById("map").innerHTML=`<p>داده مناسب برای نمایش نقشه یافت نشد</p>`
    }
    
},[])
return  (<>
<div id="map" style={{height:props.height?props.height:'350px'}}></div>
</>)
}
export default Map;
import { stationTypes } from "./stationTypes"
export const setDashboard=(token)=>{
    return {
        type:stationTypes.SET_DASHBOARD_STATIONS,
        payload:token
    }
}

export const setMapStation=(token)=>{
    return {
        type:stationTypes.SET_MAP_STATIONS,
        payload:token
    }
}
export const setMapZoom=(token)=>{
    return {
        type:stationTypes.SET_MAP_ZOOM,
        payload:token
    }
}
export const setAlarm=(token)=>{
    return {
        type:stationTypes.SET_ALARMS,
        payload:token
    }
}
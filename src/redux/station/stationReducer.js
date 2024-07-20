import { stationTypes } from './stationTypes'
import {  createReducer } from '@reduxjs/toolkit'

const initialState={
   dashboard:[],
   map:[],
   mapZoom:12,
   alarm:[]

}


const stationReducer = createReducer(initialState, (builder) => {
    builder
      .addCase(stationTypes.SET_DASHBOARD_STATIONS, (state, action) => {
        state.dashboard=action.payload
      })
      .addCase(stationTypes.SET_MAP_STATIONS,(state, action) => {
        state.map=action.payload
      })
      .addCase(stationTypes.SET_MAP_ZOOM,(state, action) => {
        state.mapZoom=action.payload
      })
      .addCase(stationTypes.SET_ALARMS,(state, action) => {
        state.alarm=action.payload
      })
      
      .addDefaultCase((state, action) => {})
  })

export {stationReducer}
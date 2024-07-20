import { UserTypes } from './userTypes'
import {  createReducer } from '@reduxjs/toolkit'

const initialState={
    token:'',
    rftoken:'',
    name:'',
    roel:'',
    username:'',
    mobile:'',
    email:'',
    userAccess:[],
}


const userReducer = createReducer(initialState, (builder) => {
    builder
      .addCase(UserTypes.USER_SET_NAME, (state, action) => {
        state.name=action.payload
        console.log(state);
      })
      .addCase(UserTypes.USER_TOKEN, (state, action) => {
        state.token=action.payload
      })
      .addCase(UserTypes.USER_RFTOKEN, (state, action) => {
        state.rftoken=action.payload
      })
      .addCase(UserTypes.USER_SET_EMAIL, (state, action) => {
        state.email=action.payload
      })
      .addCase(UserTypes.USER_SET_USERNAME, (state, action) => {
        state.username=action.payload
      })
      .addCase(UserTypes.USER_SET_ROLE, (state, action) => {
        state.role=action.payload
      })
     
      .addCase(UserTypes.USER_SET_USERACCESS, (state, action) => {
        state.userAccess=action.payload
      })
      // .addCase(UserTypes.USER_SET_GROUPACCESS, (state, action) => {
      //   state.groupAccess=action.payload
      // })
      // .addCase(UserTypes.USER_SET_STATIONACCESS, (state, action) => {
      //   state.stationAccess=action.payload
      // })
      // .addCase(UserTypes.USER_SET_REPORTACCESS, (state, action) => {
      //   state.reportAccess=action.payload
      // })
     
      .addDefaultCase((state, action) => {})
  })

export {userReducer}
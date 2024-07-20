import {configureStore} from '@reduxjs/toolkit'
import {userReducer} from './user/userReducer'
import {stationReducer} from './station/stationReducer'
import logger from 'redux-logger'
import storage from 'redux-persist/es/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import { encryptTransform } from 'redux-persist-transform-encrypt';


  


const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
 transforms: [
        encryptTransform({
          secretKey: 'my-super-secret-key',
          onError: function (error) {
            // Handle the error.
          },
        }),
      ],
};

let rootReducer = combineReducers({
    user:userReducer,
    station:stationReducer
});
let pr=persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer:pr,
    middleware: getDefaultMiddleware =>{
    return getDefaultMiddleware().prepend(logger)}
}) 

let persistor = persistStore(store);
export { store,persistor}
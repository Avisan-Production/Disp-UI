import appsetting from '../../../appsettings.json'
import axios from 'axios'

 class ApiReq {
  constructor() {}
  GetBoardsDetail() {
    var res = [];
    axios
      .get(`/api/device/all`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Content-Type": "application/json",
        },
        responseType: "json",
      })
      .then(function (response) {
        res = response.data;
      });
    return res;
  }
  GetBoardsData(){
    var res=[];
    axios.get(`/api/device/data/0`,{
        headers:{
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Content-Type':'application/json'
        }
        ,responseType:'json'
      })
      .then(function (response) {
        res=response.data;
        
      })   
      return res;
  }

}

export default new ApiReq();
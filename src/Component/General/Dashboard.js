import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import {Link} from 'react-router-dom'
import { useState ,useEffect} from 'react';
import axios from 'axios'

const Dashboard=()=>{
 const [data,setData]=useState({})

 useEffect(()=>{

  axios
  .get("http://localhost:5260/api/detail")
  .then((res) => {
    console.log(res);
    setData(res.data)
  })
 },[])
    return (
        <>
         <div className=" p-5">
        <h3>محصولات فعال شما</h3>
        <hr></hr>
        <div className="row mt-2">
          <div className="col-md-4 col-12 p-2">
            <div className="card text-right mb-3" >
              <div className="card-body">
                <h3 className="card-title w-100">
                  LMD
                <Link to="/lmd" className='float-start'>
                  <FontAwesomeIcon icon={solid('arrow-left')} />
                </Link>
                </h3>
                <hr></hr>
                <h5>برای شما {data.lmd} دستگاه موجود است</h5>
                <p className="card-text text-secondary">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
                </p>
                <hr/>
                <a href='#!' className='btn btn-outline-primary w-100'>خرید دستگاه جدید</a>
              </div>
            </div>
          </div>
          <div className="col-md-4  col-12 p-2">
            <div className="card text-right mb-3" >
              <div className="card-body">
                <h3 className="card-title w-100">
                  SPS
                <a href='#!' className='float-start'>
                  <FontAwesomeIcon icon={solid('arrow-left')} />
                </a>
                </h3>
                <hr></hr>
                <h5>برای شما {data.sps} دستگاه موجود است</h5>
                <p className="card-text text-secondary">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
                </p>
                <hr/>
                <a href='#!' className='btn btn-outline-primary w-100'>خرید دستگاه جدید</a>
              </div>
            </div>
          </div>
          <div className="col-md-4  col-12 p-2">
            <div className="card text-right mb-3" >
              <div className="card-body">
                <h3 className="card-title w-100">
                  LEVEL METER
                <a href='#!' className='float-start'>
                  <FontAwesomeIcon icon={solid('arrow-left')} />
                </a>
                </h3>
                <hr></hr>
                <h5>برای شما {data.levelMeter} دستگاه موجود است</h5>
                <p className="card-text text-secondary">
                لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
                </p>
                <hr/>
                <a href='#!' className='btn btn-outline-primary w-100'>خرید دستگاه جدید</a>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
    )
}
export default Dashboard;
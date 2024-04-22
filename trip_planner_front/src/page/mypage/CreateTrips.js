import Swal from "sweetalert2";
import "./createTrips.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Input } from "../../component/FormFrm";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const { kakao } = window;

const CreateTrips = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  const navigate = useNavigate();

  // if (!isLogin) {
  //   Swal.fire({
  //     icon: "warning",
  //     text: "로그인 후 이용이 가능합니다.",
  //     confirmButtonText: "닫기",
  //   }).then(navigate("/"));
  // }

  /* data */
  const [map, setMap] = useState(null);
  const [tripTitle, setTripTitle] = useState("");
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
  const [tripDays, setTripDays] = useState([]);

  /* 지도 */
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);
    setMap(map);
  }, [])

  /* datepicker */
  useEffect(() => {
    if(tripStartDate && tripEndDate && (new Date(tripEndDate.$d.getTime()) >= new Date(tripStartDate.$d.getTime()))){
      const newTripDate = new Array();
      const endDate = tripEndDate.format("YYYY-MM-DD");
      let tripDayCount = 0;
      while(true){
        const tripDate = dayjs(new Date(tripStartDate.$d.getTime()+86400000*tripDayCount)).format("YYYY-MM-DD");
        newTripDate.push(tripDate);
        if(tripDate === endDate){
          break;
        }
        tripDayCount++;
      }
      setTripDays(newTripDate);
    }
  }, [tripStartDate, tripEndDate])
  console.log(tripDays);

  return(
    <section className="contents trips">
      <h2 className="hidden">여행 일정 만들기</h2>
      <div className="createTrips_wrap">
        <div className="left_area">
          <div className="trips_wrap">
            <div className="trips_input_wrap">
              <div className="set_title_wrap">
                <Input type="text" data={tripTitle} setData={setTripTitle} placeholder="여행 제목을 입력해주세요" />
              </div>
              <div className="set_date_wrap">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker onChange={(newValue)=>{
                      setTripStartDate(newValue);
                    }} format="YYYY-MM-DD" disablePast />
                    <DatePicker onChange={(newValue)=>{
                      setTripEndDate(newValue);
                    }} format="YYYY-MM-DD" disablePast />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="trips_plan_wrap">
              {
                tripDays.map((day, index) => {
                  return(
                    <SetDayWrap key={"day"+index} tripDate={day} dayIndex={index} />
                  )
                })
              }
            </div>
            <div className="btn_area">
              <Button text="여행 등록하기" class="btn_primary"/>
            </div>
          </div>
        </div>
        
        <div className="map_area" id="map"></div>
      </div>
    </section>
  )
}

const SetDayWrap = (props) => {
  const tripDate = props.tripDate;
  const dayIndex = props.dayIndex;

  return(
    <div className="set_day_wrap">
      <div className="day_title_wrap">
        <div className="day_title">Day {dayIndex+1}<span className="tripDate">{tripDate}</span></div>
        <button type="button" className="btn_tripCost">비용 추가</button>
      </div>
      <div className="day_items_wrap">
        <ul className="place_list"></ul>
      </div>
      <div className="day_btns_wrap">
        <div className="btn_area">
          <Button text="장소 추가" class="btn_secondary md" />
        </div>
      </div>
    </div>
  )
}

export default CreateTrips;
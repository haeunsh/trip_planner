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

  /* 완성시 등록할 data */
  const [map, setMap] = useState(null);
  const [tripTitle, setTripTitle] = useState("");
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
  const [tripDays, setTripDays] = useState([]);

  /* 화면용 state */
  const [openSearchWrap, setOpenSearchWrap] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [placeReqPage, setPlaceReqPage] = useState(-1);
  const [placeList, setPlaceList] = useState([]);
  const [placePageInfo, setPlacePageInfo] = useState({});
  const [innReqPage, setInnReqPage] = useState(-1);
  const [innList, setInnList] = useState([]);
  const [innPageInfo, setInnPageInfo] = useState({});

  /* functions */
  const openSearchWrapFunc = () => {
    setOpenSearchWrap(true);
  }
  const closeSearchWrapFunc = () => {
    setOpenSearchWrap(false);
  }
  const searchFunc = () => {
    setKeyword(searchInput);
    setPlaceReqPage(1);
    setInnReqPage(1);
  }
  //장소 검색
  useEffect(() => {
    const searchObj = {keyword: keyword, reqPage: placeReqPage};
    console.log(searchObj);
    if(keyword !== ""){
      axios.post(backServer + "/trip/searchPlace", searchObj)
      .then((res) => {
        console.log(res.data.data);
        setPlaceList(res.data.data.placeList);
        setPlacePageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      })
    }
  }, [keyword, placeReqPage])
  //숙소 검색
  useEffect(() => {
    const searchObj = {keyword: keyword, reqPage: innReqPage};
    console.log(searchObj);
    if(keyword !== ""){
      axios.post(backServer + "/trip/searchInns", searchObj)
      .then((res) => {
        console.log(res.data.data);
        setInnList(res.data.data.innList);
        setInnPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res.data);
      })
    }
  }, [keyword, innReqPage])

  const searchKeyDownEvnet = (e) => {
    if(e.key === "Enter"){
      searchFunc();
    }
  }

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

  return(
    <section className="contents trips">
      <h2 className="hidden">여행 일정 만들기</h2>
      <div className="createTrips_wrap">
        {/* 일정 만들기 영역 */}
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
                    <SetDayWrap key={"day"+index} tripDate={day} dayIndex={index} openSearchWrapFunc={openSearchWrapFunc} />
                  )
                })
              }
            </div>
            <div className="btn_area">
              <Button text="여행 등록하기" class="btn_primary"/>
            </div>
          </div>
          {/* 검색창 영역 */}
          {
            openSearchWrap ? (
              <div className="search_wrap">
                <div className="search_input_wrap">
                  <div className="search_input">
                    <Input type="text" data={searchInput} setData={setSearchInput} placeholder="여행지나 숙소를 검색해보세요" keyDownEvent={searchKeyDownEvnet} />
                    <button type="button" className="btn_search" onClick={searchFunc}><span className="hidden">검색</span></button>
                  </div>
                </div>
                <div className="search_result_wrap">
                  <div className="result_title">장소</div>
                  <div className="result_place_area">
                    <ul className="place_list">
                      {
                        placeList.map((place, index) => {
                          return(
                            <li key={"place" + index} className="item tripPlace">
                              <div className="item_box">
                                <div className="item_box_content">
                                  <div className="place_name">{place.placeName}</div>
                                  <div className="place_info">
                                    <span>{place.placeCategory}</span>
                                    <span>{place.placeAddress}</span>
                                  </div>
                                  <div className="place_phone">{place.placePhone}</div>
                                </div>
                                <div className="item_btn_wrap">
                                  <Button text="일정 추가" class="btn_primary outline sm btn_addPlace" />
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                    <Pagination pageInfo={placePageInfo} reqPage={placeReqPage} setReqPage={setPlaceReqPage} />
                  </div>
                  <div className="result_title">숙소</div>
                  <div className="result_place_area">
                    <ul className="place_list">
                      {
                        innList.map((inn, index) => {
                          return(
                            <li key={"inn" + index} className="item tripPlace">
                              <div className="item_box">
                                <div className="item_box_content">
                                  <div className="place_name">{inn.partnerName}</div>
                                  <div className="place_info">
                                    <span>{inn.innTypeStr}</span>
                                    <span>{inn.innAddr}</span>
                                  </div>
                                  <div className="place_phone">{inn.partnerPhone}</div>
                                </div>
                                <div className="item_btn_wrap">
                                  <Button text="일정 추가" class="btn_primary outline sm btn_addPlace" />
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                    <Pagination pageInfo={innPageInfo} reqPage={innReqPage} setReqPage={setInnReqPage} />
                    <div className="btn_area">
                      {/* <Button text="숙소 검색 결과 더보기" class="btn_primary outline md" /> */}
                    </div>
                  </div>
                </div>
                <button type="button" className="btn_close" onClick={closeSearchWrapFunc}><span className="hidden">닫기</span></button>
              </div>
            ) : ""
          }
        </div>

        {/* 지도 영역 */}
        <div className="map_area" id="map"></div>
      </div>
    </section>
  )
}

const SetDayWrap = (props) => {
  const tripDate = props.tripDate;
  const dayIndex = props.dayIndex;
  const openSearchWrapFunc = props.openSearchWrapFunc;

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
          <Button text="장소 추가" class="btn_secondary md" clickEvent={openSearchWrapFunc} />
        </div>
      </div>
    </div>
  )
}

const Pagination = (props) => {
  const pageInfo = props.pageInfo;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  const changePage = (e) => {
    setReqPage(Number(e.currentTarget.innerText));
  };

  const pagingArr = new Array();
  if(Object.keys(pageInfo).length !== 0){
    let pageNo = Number(pageInfo.pageNo);
    if(pageNo > 1){
      pagingArr.push(
        <button key="prev_page" type="button" className="page_item prev" onClick={() => {
          if(reqPage !== 1){
            setReqPage(Number(pageInfo.pageNo)-Number(pageInfo.pageNaviSize));
          };
        }}><span className="hidden">이전</span></button>
      );
    }
    
    for(let i=0; i<pageInfo.pageNaviSize; i++){
      if(pageNo === Number(reqPage)){
        pagingArr.push(
          <button key={"page"+i} type="button" className="page_item active">{pageNo}</button>
        );
      }else{
        pagingArr.push(
          <button key={"page"+i} type="button" className="page_item" onClick={changePage}>{pageNo}</button>
        );
      };
      pageNo++;
      if(pageNo > pageInfo.totalPage){
        break;
      };
    };
    if(pageNo <= pageInfo.totalPage){
      pagingArr.push(
        <button key="next_page" type="button" className="page_item next" onClick={() => {
          setReqPage(Number(pageInfo.pageNo)+Number(pageInfo.pageNaviSize));
        }}><span className="hidden">다음</span></button>
      );
    };
  };

  return(
    <div className="pagination">{pagingArr}</div>
  );
};

export default CreateTrips;
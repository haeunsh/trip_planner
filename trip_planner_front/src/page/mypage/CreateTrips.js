import Swal from "sweetalert2";
import "./createTrips.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Textarea } from "../../component/FormFrm";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Modal from "../../component/Modal";
const { kakao } = window;

const CreateTrips = (props)=>{
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

  /***** 완성 시 등록할 data *****/
  const [tripTitle, setTripTitle] = useState("");
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
  const [tripDays, setTripDays] = useState([]);
  const [tripDetailList, setTripDetailList] = useState([]);
  
  /***** 화면용 states *****/
  const [openSearchWrap, setOpenSearchWrap] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const resultWrap = useRef();
  const placeRef = useRef();
  const activePlaceRef = useRef();
  const activeInnRef = useRef();
  const [placeReqPage, setPlaceReqPage] = useState(-1);
  const [placeList, setPlaceList] = useState([]);
  const [placePageInfo, setPlacePageInfo] = useState({});
  const [activePlaceIndex, setActivePlaceIndex] = useState(-1);
  const [activeInnIndex, setActiveInnIndex] = useState(-1);
  const [innReqPage, setInnReqPage] = useState(-1);
  const [innList, setInnList] = useState([]);
  const [innPageInfo, setInnPageInfo] = useState({});
  const [selectPlaceList, setSelectPlaceList] = useState([]);
  const [selectPlaceListIndex, setSelectPlaceListIndex] = useState(-1);
  const [totalCost, setTotalCost] = useState(0);
  const [openCostModal, setOpenCostModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [tripCost, setTripCost] = useState("");
  const [tripTodo, setTripTodo] = useState("");
  const [selectPlaceIndex, setSelectPlaceIndex] = useState(-1);
  
  /***** functions *****/
  //장소 검색창 닫았을 때
  const closeSearchWrapFunc = ()=>{
    setSelectPlaceListIndex(-1);
    setOpenSearchWrap(false);
  }
  //장소 검색 함수
  const searchFunc = ()=>{
    resultWrap.current.scrollTop = 0;
    setKeyword(searchInput);
    setPlaceReqPage(1);
    setInnReqPage(1);
  }
  //장소 검색(여행지)
  useEffect(()=>{
    const searchObj = {keyword: keyword, reqPage: placeReqPage};
    // console.log(searchObj);
    if(keyword !== ""){
      axios.post(backServer + "/trip/searchPlace", searchObj)
      .then((res)=>{
        // console.log(res.data.data);
        setPlaceList(res.data.data.placeList);
        setPlacePageInfo(res.data.data.pi);
      })
      .catch((res)=>{
        console.log(res.data);
      })
    }
  }, [keyword, placeReqPage])
  //장소 검색(숙소)
  useEffect(()=>{
    const searchObj = {keyword: keyword, reqPage: innReqPage};
    // console.log(searchObj);
    if(keyword !== ""){
      axios.post(backServer + "/trip/searchInns", searchObj)
      .then((res)=>{
        // console.log(res.data.data);
        setInnList(res.data.data.innList);
        setInnPageInfo(res.data.data.pi);
      })
      .catch((res)=>{
        console.log(res.data);
      })
    }
  }, [keyword, innReqPage])
  //장소 검색 엔터키 이벤트
  const searchKeyDownEvnet = (e)=>{
    if(e.key === "Enter"){
      searchFunc();
    }
  }
  //장소 클릭 시 함수
  const clickPlaceFunc = (place, index)=>{
    if(place.type === "place"){
      setActiveInnIndex(-1);
      setActivePlaceIndex(index);
      showInfoWindow(infoWindows, infoWindows[index], place);
    }
    if(place.type === "inn"){
      // console.log(innInfoWindows);
      // console.log(innInfoWindows[index]);
      // console.log(innInfos);
      // console.log(innInfos[index]);
      setActiveInnIndex(index);
      setActivePlaceIndex(-1);
      showInfoWindow(innInfoWindows, innInfoWindows[index], innInfos[index]);
    }
  }
  //검색 장소 스크롤 이벤트(여행지)
  useEffect(()=>{
    if(activePlaceRef.current){
      resultWrap.current.scrollTop = activePlaceRef.current.offsetTop - 40;
    }
  },[activePlaceIndex]);
  //검색 장소 스크롤 이벤트(숙소)
  useEffect(()=>{
    if(activeInnRef.current){
      resultWrap.current.scrollTop = activeInnRef.current.offsetTop - 40;
    }
  },[activeInnIndex]);
  //일정 추가 함수
  const addPlaceFunc = (place)=>{
    place.tripDay = tripDays[selectPlaceListIndex];
    place.tripRoute = selectPlaceList[selectPlaceListIndex].length === 0 ? 1 : selectPlaceList[selectPlaceListIndex].length+1;
    selectPlaceList[selectPlaceListIndex].push(place);
    setSelectPlaceList([...selectPlaceList]);
  }
  // console.log(selectPlaceList);
  //비용 추가 함수
  const addCostFunc = () => {
    selectPlaceList[selectPlaceListIndex][selectPlaceIndex].tripCost = tripCost;
    setSelectPlaceList([...selectPlaceList]);
    setTripCost("");
    setOpenCostModal(false);
  }
  //할 일 추가 함수
  const addTodoFunc = () => {
    selectPlaceList[selectPlaceListIndex][selectPlaceIndex].tripTodo = tripTodo;
    setSelectPlaceList([...selectPlaceList]);
    setTripTodo("")
    setOpenTodoModal(false);
  }
  //비용 추가 모달 close 함수
  const closeCostModalFunc = () => {
    setTripCost("");
    setOpenCostModal(false);
  }
  //할 일 추가 모달 close 함수
  const closeTodoModalFunc = () => {
    setTripTodo("");
    setOpenTodoModal(false);
  }
  //여행 등록하기 함수
  const createTripsFunc = () => {
    console.log(tripDetailList);
  }

  /***** 지도 *****/
  /* 지도 states */
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const [innInfos, setInnInfos] = useState([]);
  const [innMarkers, setInnMarkers] = useState([]);
  const [innInfoWindows, setInnInfoWindows] = useState([]);
  const [myMarkers, setMyMarkers] = useState([]);
  const [myInfoWindows, setMyInfoWindows] = useState([]);
  
  /* 지도 functions */
  //마커 초기화 함수
  function removeMarker(markers, setMarkers){
    for(let i=0; i<markers.length; i++) {
      markers[i].setMap(null);
    }   
    markers.length = 0;
    setMarkers([...markers]);
  }
  //인포윈도우 초기화 함수
  function removeInfoWindow(infoWindows, setInfoWindows){
    for(let i=0; i<infoWindows.length; i++) {
      infoWindows[i].setMap(null);
    }
    infoWindows.length = 0;
    setInfoWindows([...infoWindows]);
  }
  //인포윈도우 표시 함수
  function showInfoWindow(infoWdws, infoWdw, place){
    const placeName = place.placeName ? place.placeName : place.partnerName;
    const placePhone = place.placePhone ? place.placePhone : place.partnerTel ? place.partnerTel : "";
    const placeCategory = place.placeCategory ? place.placeCategory : place.innTypeStr ? place.innTypeStr : "";
    const placeAddress = place.placeAddress ? place.placeAddress : place.innAddr;
    let infoWindowStr = [
      "<div class='infoWindow'>",
        "<div class='item_box'>",
          "<div class='item_box_content'>",
            "<div class='place_name'>"+placeName+"</div>",
            "<div class='place_info'>",
              "<span>"+placeCategory+"</span>",
              "<span>"+placeAddress+"</span>",
            "</div>",
            "<div class='place_phone'>"+placePhone+"</div>",
          "</div>",
        "</div>",
      "</div>"
    ].join("");
    infoWdw.setContent(infoWindowStr);
    infoWdw.setPosition(new kakao.maps.LatLng(place.placeLat, place.placeLng));
    for(let i=0; i<infoWdws.length; i++) {
      infoWdws[i].setMap(null);
    }
    for(let i=0; i<infoWindows.length; i++) {
      infoWindows[i].setMap(null);
    }
    for(let i=0; i<innInfoWindows.length; i++) {
      innInfoWindows[i].setMap(null);
    }
    infoWdw.setMap(map);
    map.setCenter(new kakao.maps.LatLng(place.placeLat, place.placeLng));
  }

  /* 초기값 */
  useEffect(()=>{
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);
    setMap(map);
  }, [])

  /* 실제 표시 */
  useEffect(()=>{
    if(map === null) {
      return;
    }

    //지도 표시를 위한 영역값
    const bounds = new kakao.maps.LatLngBounds();
    //숙소 검색 시 좌표 값을 받아오기 위한 Geocoder
    const geocoder = new kakao.maps.services.Geocoder();

    //마커와 인포윈도우 최초 초기화
    removeMarker(markers, setMarkers);
    removeMarker(innMarkers, setInnMarkers);
    removeInfoWindow(infoWindows, setInfoWindows);
    removeInfoWindow(innInfoWindows, setInnInfoWindows);
    setActivePlaceIndex(-1);
    setActiveInnIndex(-1);

    //마커 표시
    if(openSearchWrap){
      placeList.forEach((place, index)=>{
        displayMarker(markers, setMarkers, infoWindows, setInfoWindows, setActivePlaceIndex, place, index);
      })
      const innArr = new Array();
      innList.forEach((inn, index)=>{
        const callback = function(result, status) {
          if(status === kakao.maps.services.Status.OK) {
            inn.placeLat = result[0].y;
            inn.placeLng = result[0].x;
            // const inns = {placeLat: result[0].y, placeLng: result[0].x, placeName: inn.partnerName, placeAddress: inn.innAddr, placePhone: inn.partnerTel};
            innArr[index] = inn;
            displayMarker(innMarkers, setInnMarkers, innInfoWindows, setInnInfoWindows, setActiveInnIndex, inn, index);
          }
        };
        geocoder.addressSearch(inn.innAddr, callback);
      })
      setInnInfos(innArr);
    }

    //마커 표시 함수
    function displayMarker(markers, setMarkers, infoWindows, setInfoWindows, setActiveIndex, place, index){
      bounds.extend(new kakao.maps.LatLng(place.placeLat, place.placeLng));
  
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.placeLat, place.placeLng),
        zIndex: 30
      });
      markers.push(marker);
      setMarkers([...markers]);

      map.setBounds(bounds);

      //마커마다 인포윈도우 생성
      const infoWindow = new kakao.maps.CustomOverlay({
        zIndex: 45,
        yAnchor: 1.4
      });
      infoWindows.push(infoWindow);
      setInfoWindows([...infoWindows]);

      //마커 클릭 시 인포윈도우 표시
      kakao.maps.event.addListener(marker, 'click', function() {
        setActivePlaceIndex(-1);
        setActiveInnIndex(-1);
        setActiveIndex(index);
        showInfoWindow(infoWindows, infoWindow, place);
      })
    }
  }, [map, openSearchWrap, placeList, innList])

  /***** datepicker *****/
  useEffect(()=>{
    if(tripStartDate && tripEndDate && (new Date(tripEndDate.$d.getTime()) >= new Date(tripStartDate.$d.getTime()))){
      const newTripDate = new Array();
      const endDate = tripEndDate.format("YYYY-MM-DD");
      let tripDayCount = 0;
      //selectPlaceList 카피
      const copySelectPlaceList = selectPlaceList.filter((item)=>{
        return item.length !== 0;
      })
      selectPlaceList.length = 0;
      tripDetailList.length = 0;
      console.log(copySelectPlaceList);

      while(true){
        const tripDate = dayjs(new Date(tripStartDate.$d.getTime()+86400000*tripDayCount)).format("YYYY-MM-DD");
        newTripDate.push(tripDate);

        //2. 기존에 담은 장소가 있을 경우 카피본을 넣어주기
        if(copySelectPlaceList[tripDayCount]){
          selectPlaceList.push(copySelectPlaceList[tripDayCount]);
        }else{
          //1. 생성되는 tripDays 개수만큼 selectPlaceList 내부의 배열도 추가(최초거나, 기존에 담은 장소가 없을 경우)
          const newArr = new Array();
          selectPlaceList.push(newArr);
        }
        
        if(tripDate === endDate){
          for(let i=tripDayCount+1; i<copySelectPlaceList.length; i++){
            selectPlaceList[tripDayCount].push(...copySelectPlaceList[i]);
          }
          break;
        }
        tripDayCount++;
      }
      for(let i=0; i<selectPlaceList.length; i++){
        for(let j=0; j<selectPlaceList[i].length; j++){
          selectPlaceList[i][j].oldTripDay = selectPlaceList[i][j].tripDay;
          selectPlaceList[i][j].tripDay = newTripDate[i];
        }
      }
      setTripDays(newTripDate);
      setSelectPlaceList([...selectPlaceList]);
      console.log(selectPlaceList);
    }
  }, [tripStartDate, tripEndDate]);

  /***** 전송할 tripDetailList 세팅 *****/
  useEffect(()=>{
    tripDetailList.length = 0;
    for(let i=0; i<selectPlaceList.length; i++){
      for(let j=0; j<selectPlaceList[i].length; j++){
        tripDetailList.push({
          innNo: selectPlaceList[i][j].innNo,
          placeNo: selectPlaceList[i][j].placeNo,
          tripDay: selectPlaceList[i][j].tripDay,
          oldTripDay: selectPlaceList[i][j].oldTripDay,
          oldTripRoute: selectPlaceList[i][j].oldTripRoute,
          tripRoute: selectPlaceList[i][j].tripRoute,
          tripCost: selectPlaceList[i][j].tripCost,
          tripTodo: selectPlaceList[i][j].tripTodo
        })
      }
    }
    setTripDetailList([...tripDetailList]);
  }, [selectPlaceList])

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
                    }} format="YYYY-MM-DD" />
                    <DatePicker onChange={(newValue)=>{
                      setTripEndDate(newValue);
                    }} format="YYYY-MM-DD" />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="trips_plan_wrap">
              {
                tripDays.map((day, index)=>{
                  return(
                    <SetDayWrap key={"day"+index} tripDays={tripDays} tripDate={day} dayIndex={index} totalCost={totalCost} setOpenSearchWrap={setOpenSearchWrap} selectPlaceList={selectPlaceList} setSelectPlaceList={setSelectPlaceList} selectPlaceListIndex={selectPlaceListIndex} setSelectPlaceListIndex={setSelectPlaceListIndex} setOpenCostModal={setOpenCostModal} setOpenTodoModal={setOpenTodoModal} setModalTitle={setModalTitle} setSelectPlaceIndex={setSelectPlaceIndex} setTripCost={setTripCost} setTripTodo={setTripTodo} />
                  )
                })
              }
            </div>
            <div className="btn_area">
              <Button text="여행 등록하기" class="btn_primary" clickEvent={createTripsFunc}/>
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
                <div className="search_result_wrap" ref={resultWrap}>
                  <div className="result_title">여행지</div>
                  <div className="result_place_area">
                    <ul className="place_list">
                      {
                        placeList.map((place, index)=>{
                          place.type = "place";
                          return(
                            <li key={"place" + index} className={index === activePlaceIndex ? "item active" : "item"} onClick={()=>{clickPlaceFunc(place, index)}} ref={index === activePlaceIndex ? activePlaceRef : placeRef} >
                              <div className="tripPlace">
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
                                    <Button text="일정 추가" class="btn_primary outline sm btn_addPlace" clickEvent={(e)=>{
                                      // e.stopPropagation();
                                      return addPlaceFunc(place);
                                    }} />
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                    {
                      placeList.length !== 0 ? (
                        <Pagination pageInfo={placePageInfo} reqPage={placeReqPage} setReqPage={setPlaceReqPage} />
                      ) : ""
                    }
                  </div>
                  <div className="result_title">숙소</div>
                  <div className="result_place_area">
                    <ul className="place_list">
                      {
                        innList.map((inn, index)=>{
                          inn.type = "inn";
                          return(
                            <li key={"inn" + index} className={index === activeInnIndex ? "item active" : "item"} onClick={()=>{clickPlaceFunc(inn, index)}} ref={index === activeInnIndex ? activeInnRef : placeRef} >
                              <div className="tripPlace">
                                <div className="item_box">
                                  <div className="item_box_content">
                                    <div className="place_name">{inn.partnerName}</div>
                                    <div className="place_info">
                                      <span>{inn.innTypeStr}</span>
                                      <span>{inn.innAddr}</span>
                                    </div>
                                    <div className="place_phone">{inn.partnerTel}</div>
                                  </div>
                                  <div className="item_btn_wrap">
                                    <Button text="일정 추가" class="btn_primary outline sm btn_addPlace" clickEvent={(e)=>{
                                      // e.stopPropagation();
                                      return addPlaceFunc(inn);
                                    }} />
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                    {
                      innList.length !== 0 ? (
                        <>
                          <Pagination pageInfo={innPageInfo} reqPage={innReqPage} setReqPage={setInnReqPage} />
                          <div className="btn_area">
                            <Button text="숙소 검색 결과 더보기" class="btn_primary outline md" />
                          </div>
                        </>
                      ) : ""
                    }
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

      <Modal class="modal" open={openCostModal} closeModal={closeCostModalFunc} title={modalTitle} useCloseBtn={true}>
        <Input type="number" data={tripCost} setData={setTripCost} placeholder="비용을 입력해주세요" />

        <div className="btn_area">
          <Button class="btn_secondary" text="확인" clickEvent={addCostFunc} />
        </div>
      </Modal>

      <Modal class="modal lg" open={openTodoModal} closeModal={closeTodoModalFunc} title={modalTitle}>
        <Textarea data={tripTodo} setData={setTripTodo} placeholder="할 일을 입력해주세요" />

        <div className="btn_area">
          <Button class="btn_secondary outline" text="취소" clickEvent={closeTodoModalFunc} />
          <Button class="btn_secondary" text="확인" clickEvent={addTodoFunc} />
        </div>
      </Modal>
    </section>
  )
}

const SetDayWrap = (props)=>{
  const tripDays = props.tripDays;
  const tripDate = props.tripDate;
  const dayIndex = props.dayIndex;
  const totalCost = props.totalCost;
  const setOpenSearchWrap = props.setOpenSearchWrap;
  const selectPlaceList = props.selectPlaceList;
  const setSelectPlaceList = props.setSelectPlaceList;
  const selectPlaceListIndex = props.selectPlaceListIndex;
  const setSelectPlaceListIndex = props.setSelectPlaceListIndex;
  const setOpenCostModal = props.setOpenCostModal;
  const setOpenTodoModal = props.setOpenTodoModal;
  const setModalTitle = props.setModalTitle;
  const setSelectPlaceIndex = props.setSelectPlaceIndex;
  const setTripCost = props.setTripCost;
  const setTripTodo = props.setTripTodo;
  //루트번호에 컬러인덱스
  let colorIndex = 0;
  for(let i=0; i<dayIndex+1; i++){
    colorIndex = colorIndex+1;
    if(i%4 === 0){
        colorIndex = 1;
    }
  }
  //장소 검색창 열었을 때
  const openSearchWrapFunc = ()=>{
    setOpenSearchWrap(true);
    setSelectPlaceListIndex(dayIndex);
  }
  //비용 추가 버튼 클릭시
  const openCostModalFunc = (place, index) => {
    setOpenCostModal(true);
    setModalTitle(place.placeName);
    setSelectPlaceListIndex(dayIndex);
    setSelectPlaceIndex(index);
    setTripCost(place.tripCost);
  }
  //할 일 추가 버튼 클릭시
  const openTodoModalFunc = (place, index) => {
    setOpenTodoModal(true);
    setModalTitle(place.placeName);
    setSelectPlaceListIndex(dayIndex);
    setSelectPlaceIndex(index);
    setTripTodo(place.tripTodo);
  }
  //장소 순서 변경 버튼 클릭시(내리기 버튼)
  const tripRouteDown = (index) => {
    if(dayIndex !== selectPlaceList.length-1 && index === selectPlaceList[dayIndex].length-1){
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex+1];
      selectPlaceList[dayIndex+1].splice(0,0,thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
    }else if(dayIndex !== selectPlaceList.length-1 && index !== selectPlaceList[dayIndex].length-1){
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex];
      selectPlaceList[dayIndex].splice(index+1,0,thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
    }else if(dayIndex === selectPlaceList.length-1 && index !== selectPlaceList[dayIndex].length-1){
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex];
      selectPlaceList[dayIndex].splice(index+1,0,thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
    }
  }

  return(
    <div className="set_day_wrap">
      <div className="day_title_wrap">
        <div className="day_title">Day {dayIndex+1}<span className="tripDate">{tripDate}</span></div>
        <div className="total_cost">{totalCost}</div>
        {/* <button type="button" className="btn_tripCost">비용 추가</button> */}
      </div>
      <div className="day_items_wrap">
        <ul className="place_list">
          {
            selectPlaceList[dayIndex] ? (
              selectPlaceList[dayIndex].map((place, index)=>{
                place.oldTripRoute = place.tripRoute;
                place.tripRoute = index+1;
                return(
                  <li key={"select_place"+dayIndex+"-"+index} className="item">
                    <div className="tripPlace">
                      <div className={"tripRoute_no color"+colorIndex}>{index+1}</div>
                      <div className="item_box">
                        <div className="item_box_content">
                          <div className="place_name">{place.placeName ? place.placeName : place.partnerName}</div>
                          <div className="place_info">
                            <span>{place.placeCategory ? place.placeCategory : place.innTypeStr}</span>
                            <span>{place.placeAddress ? place.placeAddress : place.innAddr}</span>
                          </div>
                          <div className="trip_cost" onClick={()=>{openCostModalFunc(place, index)}}>{place.tripCost}</div>
                        </div>
                        <div className="item_btn_wrap">
                          <button type="button" className="btn_changeOrder down" onClick={()=>{tripRouteDown(index)}}><span className="hidden">내리기</span></button>
                          <button type="button" className="btn_changeOrder up"><span className="hidden">올리기</span></button>
                        </div>
                        {
                          place.tripCost && place.tripTodo ? "" : (
                            <div className="btn_area">
                              {!place.tripCost ? (
                                <button type="button" className="btn_tripCost" onClick={()=>{openCostModalFunc(place, index)}}><i></i><span>비용 추가</span></button>
                              ) : ""}
                              {!place.tripTodo ? (
                                <button type="button" className="btn_tripTodo" onClick={()=>{openTodoModalFunc(place, index)}}><i></i><span>할 일 추가</span></button>
                              ) : ""}
                            </div>
                          )
                        }
                        <button type="button" className="btn_delete"><span className="hidden">삭제</span></button>
                      </div>
                    </div>
                    {place.tripTodo ? (
                      <div className="tripTodo">
                        <div className="tripRoute_no"></div>
                        <div className="item_box">
                          <div className="item_box_content" onClick={()=>{openTodoModalFunc(place, index)}}>{place.tripTodo}</div>
                          <button type="button" className="btn_delete"><span className="hidden">삭제</span></button>
                        </div>
                      </div>
                    ) : ""}
                  </li>
                )
              })
            ):""
          }
        </ul>
      </div>
      <div className="day_btns_wrap">
        <div className="btn_area">
          <Button text="장소 추가" class={dayIndex === selectPlaceListIndex ? "btn_secondary md btn_openSearch active" : "btn_secondary md btn_openSearch"} clickEvent={openSearchWrapFunc} />
        </div>
      </div>
    </div>
  )
}

const Pagination = (props)=>{
  const pageInfo = props.pageInfo;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  const changePage = (e)=>{
    setReqPage(Number(e.currentTarget.innerText));
  };

  const pagingArr = new Array();
  let pageNo = Number(pageInfo.pageNo);
  if(pageNo > 1){
    pagingArr.push(
      <button key="prev_page" type="button" className="page_item prev" onClick={()=>{
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
      <button key="next_page" type="button" className="page_item next" onClick={()=>{
        setReqPage(Number(pageInfo.pageNo)+Number(pageInfo.pageNaviSize));
      }}><span className="hidden">다음</span></button>
    );
  };

  return(
    <div className="pagination">{pagingArr}</div>
  );
};

export default CreateTrips;
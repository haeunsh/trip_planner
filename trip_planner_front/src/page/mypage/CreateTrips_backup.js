import "./createTrips.css";
import { useEffect, useRef, useState } from "react";
import { Button, Input, Textarea } from "../../component/FormFrm";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Modal from "../../component/Modal";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const { kakao } = window;

const CreateTrips_backup = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  
  const isLogin = props.isLogin;
  // if (!isLogin) {
  //   Swal.fire({
  //     icon: "warning",
  //     text: "로그인 후 이용이 가능합니다.",
  //     confirmButtonText: "닫기",
  //   }).then(navigate("/"));
  // }

  const [trip, setTrip] = useState({}); //최종 데이터
  const [tripBtnDisabled, setTripBtnDisabled] = useState(true);
  const [tripDetailList, setTripDetailList] = useState([]);
  const [tripTitle, setTripTitle] = useState("");
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState(null);
  const [tripDays, setTripDays] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchPlaces, setSearchPlaces] = useState("");
  const [openSearchWrap, setOpenSearchWrap] = useState(false);
  const [placeResultList, setPlaceResultList] = useState([]);
  const [detailListNo, setDetailListNo] = useState(-1);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [openCostModal, setOpenCostModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [tripTodo, setTripTodo] = useState("");
  const [todoDayIndex, setTodoDayIndex] = useState(-1);
  const [todoIndex, setTodoIndex] = useState(-1);
  const [tripCost, setTripCost] = useState(0);

  // 여행 등록하기
  const createTripsFunc = () => {
    if(tripTitle === ""){
      trip.tripTitle = "국내 여행";
      setTripTitle("국내 여행");
    }
    console.log(trip);
    axios.post(backServer + "/trip", trip)
    .then((res) => {
      if(res.data.message === "success"){
        Swal.fire({icon: "success", title: "등록 완료", text: "여행 일정이 등록되었습니다.", confirmButtonText: "닫기"});
        navigate("/mypage/myTrips");
      }
    })
    .catch((res) => {
      console.log(res);
      Swal.fire({icon: "warning", text: "문제가 발생했습니다. 잠시 후 다시 시도해주세요.", confirmButtonText: "닫기"})
    })
  }

  useEffect(() => {
    setTrip({tripTitle: tripTitle, tripStartDate: dayjs(tripStartDate).format("YYYY-MM-DD"), tripEndDate: dayjs(tripEndDate).format("YYYY-MM-DD"), tripDetailListStr: JSON.stringify(tripDetailList)});
  }, [tripTitle, tripStartDate, tripEndDate, tripDetailList])

  const closeTodoModalFunc = () => {
    document.body.classList.remove("scroll_fixed");
    setTripTodo("");
    setOpenTodoModal(false);
  }

  const closeCostModalFunc = () => {
    document.body.classList.remove("scroll_fixed");
    setTripCost("");
    setOpenCostModal(false);
  }

  const addTodoFunc = () => {
    tripDetailList[todoDayIndex].selectPlaceList[todoIndex].tripTodo = tripTodo;
    setTripDetailList([...tripDetailList]);
    setTripTodo("");
    setOpenTodoModal(false);
  }

  const addCostFunc = () => {
    tripDetailList[todoDayIndex].tripCost = tripCost;
    setTripDetailList([...tripDetailList]);
    setTripCost("");
    setOpenCostModal(false);
  }

  const closeSearchWrap = () => {
    setOpenSearchWrap(false);
  }

  const searchFunc = () => {
    if(searchInput !== searchPlaces){
      placeResultList.length = 0;
      setPlaceResultList([...placeResultList]);
    }
    setSearchPlaces(searchInput);
  }

  const searchKeyDownEvnet = (e) => {
    if(e.key === "Enter"){
      searchFunc();
    }
  }

  /* 지도(최초 1회만 등록) */
  const [map, setMap] = useState(null);
  const [mapRoutes, setMapRoutes] = useState([]);
  const [linePath, setLinePath] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [myMarkers, setMyMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const [myInfoWindows, setMyInfoWindows] = useState([]);
  const [mapPs, setMapPs] = useState(null);
  const [activePlaceIndex, setActivePlaceIndex] = useState(0);
  const placeRef = useRef();
  const activePlaceRef = useRef();
  const resultPlaceArea = useRef();
  const [activeMyPlaceIndex, setActiveMyPlaceIndex] = useState([]);
  const myPlaceRef = useRef();
  const activeMyPlaceRef = useRef();
  const selectMyPlaceArea = useRef();

  //검색 장소 스크롤 이벤트
  useEffect(()=>{
    if(activePlaceRef.current){
      resultPlaceArea.current.scrollTop = activePlaceRef.current.offsetTop;
    }
  },[activePlaceIndex]);
  useEffect(()=>{
    if(activeMyPlaceRef.current){
      // console.log(selectMyPlaceArea.current.getBoundingClientRect());
      // console.log(selectMyPlaceArea.current.getBoundingClientRect().height);
      // console.log(activeMyPlaceRef.current.getBoundingClientRect());
      console.log(window.pageYOffset + selectMyPlaceArea.current.getBoundingClientRect().top);
      console.log(window.pageYOffset + activeMyPlaceRef.current.parentNode.parentNode.getBoundingClientRect().top);
      // console.log(activeMyPlaceRef.current.parentNode.parentNode.clientHeight);
      // console.log(activeMyPlaceRef.current.clientHeight);

      // selectMyPlaceArea.current.scrollTop = (window.pageYOffset + activeMyPlaceRef.current.getBoundingClientRect().top) - (window.pageYOffset + selectMyPlaceArea.current.getBoundingClientRect().top);
      // selectMyPlaceArea.current.scrollTop = 0;
    }
  },[activeMyPlaceIndex]);

  //인포윈도우 표시 함수
  function showInfoWindow(infoWindowArr, infoWindow, place){
    const tripPlacePhone = place.tripPlacePhone ? place.tripPlacePhone : "";
    const tripPlaceCategory = place.tripPlaceCategory ? place.tripPlaceCategory : "";
    let infoWindowStr = [
      "<div class='infoWindow myList'>",
        "<div class='item_box'>",
          "<div class='item_box_content'>",
            "<div class='place_name'>"+place.tripPlaceName+"</div>",
            "<div class='place_info'>",
              "<span>"+tripPlaceCategory+"</span>",
              "<span>"+place.tripPlaceAddress+"</span>",
            "</div>",
            "<div class='place_phone'>"+tripPlacePhone+"</div>",
          "</div>",
        "</div>",
      "</div>"
    ].join("");
    infoWindow.setContent(infoWindowStr);
    infoWindow.setPosition(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
    for(let i=0; i<infoWindowArr.length; i++) {
      infoWindowArr[i].setMap(null);
    }
    infoWindow.setMap(map);
    map.setCenter(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
  }

  //마커 초기화 함수들
  function removeMarker(){
    for(let i=0; i<markers.length; i++) {
      markers[i].setMap(null);
    }   
    markers.length = 0;
    setMarkers([...markers]);
  }
  function removeMyMarker(){
    for(let i=0; i<myMarkers.length; i++) {
      myMarkers[i].setMap(null);
    }   
    myMarkers.length = 0;
    setMyMarkers([...myMarkers]);
  }

  //인포윈도우 초기화 함수들
  function removeInfoWindow(){
    for(let i=0; i<infoWindows.length; i++) {
      infoWindows[i].setMap(null);
    }
    infoWindows.length = 0;
    setInfoWindows([...infoWindows]);
  }
  function removeMyInfoWindow(){
    for(let i=0; i<myInfoWindows.length; i++) {
      myInfoWindows[i].setMap(null);
    }
    myInfoWindows.length = 0;
    setMyInfoWindows([...myInfoWindows]);
  }
  
  //최초 지도 세팅
  useEffect(() => {
    const container = document.getElementById('map');
    const ps = new kakao.maps.services.Places();

    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };

    const map = new kakao.maps.Map(container, options);
    setMap(map);
    setMapPs(ps);
  }, []);

  /* 지도에 표시할 것들 분리 */
  useEffect(() => {
    if(map === null) {
      return;
    }

    //지도 표시를 위한 영역값
    const bounds = new kakao.maps.LatLngBounds();

    //최초에 모든 것 초기화
    removeMarker();
    removeMyMarker();
    removeInfoWindow();
    removeMyInfoWindow();
    removeMapRoute();
    removeLinePath();
    removePolyline();

    //담아놓은 여행장소가 하나라도 있으면
    const emptySp = tripDetailList.filter((item) => {
      return item.selectPlaceList.length === 0;
    })
    // console.log(emptySp);
    //내 장소들 최초 표시
    if(tripDetailList.length !== 0 && emptySp.length !== tripDetailList.length){
      // console.log("여기");
      displayMyMarker();
      // console.log(myInfoWindows);
    }
    
    //장소 검색
    const placesSearchCB = (data, status, pagination) => {
      //검색 장소 리스트 초기화
      placeResultList.length = 0;
      setPlaceResultList([...placeResultList]);
      activeMyPlaceIndex.length = 0;
      setActiveMyPlaceIndex([...activeMyPlaceIndex]);

      if(status === kakao.maps.services.Status.OK) {
        //검색창이 열려있으면 검색 장소 마커 표시
        if(openSearchWrap){
          data.forEach((place) => {
            setActivePlaceIndex(0);
            
            placeResultList.push({
              tripPlaceName : place.place_name,
              tripPlaceCategory : place.category_group_name !== "" ? place.category_group_name : place.category_name,
              tripPlaceAddress : place.address_name,
              tripPlacePhone : place.phone,
              tripPlaceLat : place.y,
              tripPlaceLng : place.x
            });
            setPlaceResultList([...placeResultList]);

            displayMarker(placeResultList);
          })

          displayPagination(pagination);
        }else{
          removeMarker();
          removeInfoWindow();
        }
      }
    }

    //검색 장소 페이지네이션
    function displayPagination(pagination) {
      let paginationEl = document.getElementById('pagination'),
          fragment = document.createDocumentFragment(),
          i;

      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i=1; i <= pagination.last; i++) {
        let el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            }
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }

    //검색창이 빈 문자열이 아니면 검색
    if(searchPlaces !== "") {
      // removeMyInfoWindow();
      mapPs.keywordSearch(searchPlaces, placesSearchCB, {size: 10});
    }

    //검색한 장소 마커와 인포윈도우
    const displayMarker = (placeResultList) => {
      removeMarker();
      removeInfoWindow();
      removeMyMarker();
      removeMyInfoWindow();
      removeLinePath();
      removePolyline();

      placeResultList.forEach((place, index) => {
        bounds.extend(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
  
        const marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng),
          zIndex: 30
        });
        markers.push(marker);
        setMarkers([...markers]);
          
        //검색 결과만큼 인포윈도우 생성해서 배열에 추가
        const infoWindow = new kakao.maps.CustomOverlay({
          zIndex: 45,
          yAnchor: 1.6
        });
        infoWindows.push(infoWindow);
        setInfoWindows([...infoWindows]);
  
        //마커 클릭시
        kakao.maps.event.addListener(marker, 'click', function() {
          // marker.setClickable(true);

          //현재 선택한 검색 장소의 인덱스 변경
          setActivePlaceIndex(index);

          //인포윈도우 표시
          //여기를..
          // removeMyInfoWindow();
          showInfoWindow(infoWindows, infoWindow, place);
        });
  
        map.setBounds(bounds);
      })
    }
    
    //내 장소 마커, 루트, 인포윈도우
    function displayMyMarker() {
      removeMarker();
      removeInfoWindow();
      removeLinePath();
      removePolyline();
      
      tripDetailList.forEach((detail, index) => {
        detail.selectPlaceList.forEach((place, idx) => {
          bounds.extend(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
          
          let colorIndex = 0;
          for(let i=0; i<index+1; i++){
            colorIndex = colorIndex+1;
            if(i%4 === 0){
                colorIndex = 1;
            }
          }

          const marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng),
            zIndex: 40
          });
          myMarkers.push(marker);
          setMyMarkers([...myMarkers]);

          const infoWindow = new kakao.maps.CustomOverlay({
            zIndex: 50,
            yAnchor: 1.7,
          });
          myInfoWindows.push(infoWindow);
          setMyInfoWindows([...myInfoWindows]);

          const mapRoute = new kakao.maps.CustomOverlay({
            map: map,
            position: new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng),
            content: "<div class='map_route color"+colorIndex+"'>"+(place.tripRoute)+"</div>",
            yAnchor: 2.8,
            zIndex: 3,
            clickable: true
          });

          mapRoutes.push(mapRoute);
          setMapRoutes([...mapRoutes]);
          
          //마커 클릭시
          kakao.maps.event.addListener(marker, 'click', function() {
            // marker.setClickable(true);

            //현재 선택한 내 장소의 인덱스 변경
            activeMyPlaceIndex.length = 0;
            activeMyPlaceIndex.push(index);
            activeMyPlaceIndex.push(idx);
            setActiveMyPlaceIndex([...activeMyPlaceIndex]);

            //인포윈도우 표시
            // removeInfoWindow();
            showInfoWindow(myInfoWindows, infoWindow, place);
          });

          //장소에 이을 선 좌표 배열 추가
          linePath.push(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));

          //선 생성
          const polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#E9511C',
            strokeOpacity: 0.6,
            strokeStyle: 'dashed'
          });

          polylines.push(polyline);
          setPolylines([...polylines]);

          //선 표시
          for (let i=0; i<polylines.length; i++) {
            polylines[i].setMap(null);
          }
          polyline.setMap(map);
          map.setBounds(bounds);
        })

      })
    }

    //맵루트번호 초기화 함수
    function removeMapRoute(){
      for (let i=0; i<mapRoutes.length; i++) {
        mapRoutes[i].setMap(null);
      }   
      mapRoutes.length = 0;
      setMapRoutes([...mapRoutes]);
    }
    //맵루트라인 초기화 함수들
    function removeLinePath(){
      linePath.length = 0;
      setLinePath([...linePath]);
    }
    function removePolyline(){
      for (let i=0; i<polylines.length; i++) {
        polylines[i].setMap(null);
      }   
      polylines.length = 0;
      setPolylines([...polylines]);
    }
  }, [map, trip, openSearchWrap, searchPlaces])

  /* datepicker */
  useEffect(()=>{
    //dayjs(new Date())
    //tripStartDate.format("YYYY-MM-DD")
    //조건검사(시작날짜,종료날짜 비교하는거, 값이있는지)
    if(tripStartDate && tripEndDate && (new Date(tripEndDate.$d.getTime()) >= new Date(tripStartDate.$d.getTime()))){
      const copyTripDetailList = tripDetailList.filter((item)=>{
        return item.length !== 0;
      });
      tripDays.length = 0;
      tripDetailList.length = 0;

      const newTripDetailList = new Array();
      const newTripDate = new Array();
      const endDate = tripEndDate.format("YYYY-MM-DD");
      let tripDayCount = 0;
      while(true){
        const tripDate = dayjs(new Date(tripStartDate.$d.getTime()+86400000*tripDayCount)).format("YYYY-MM-DD");
        newTripDate.push(tripDate);
        if(tripDayCount < copyTripDetailList.length){
          if(tripDate === endDate){
            const array = new Array();

            for(let i=tripDayCount;i<copyTripDetailList.length;i++){
              for(let j=0;j<copyTripDetailList[i].selectPlaceList.length;j++){
                array.push(copyTripDetailList[i].selectPlaceList[j]);
              }
            }
            newTripDetailList.push({selectPlaceList : array, tripDay: tripDate});
          }else{
            newTripDetailList.push({selectPlaceList : copyTripDetailList[tripDayCount].selectPlaceList, tripDay: tripDate});
          }
        }else{
          newTripDetailList.push({selectPlaceList: [], tripDay: tripDate});
        }
        if(tripDate === endDate){
          break;
        }
        tripDayCount++;
      }
      setTripDays(newTripDate);
      setTripDetailList(newTripDetailList);
    }
  },[tripStartDate, tripEndDate])
  
  return (
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
                      setTripBtnDisabled(false);
                    }} format="YYYY-MM-DD" disablePast />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="trips_plan_wrap" ref={selectMyPlaceArea}>
              {
                tripDetailList.map((item, index) => {
                  return(
                    <SetDayWrap key={"day" + index} tripDetailItem={item} tripDetailList={tripDetailList} setTripDetailList={setTripDetailList} dayIndex={index} tripDays={tripDays[index]} setOpenSearchWrap={setOpenSearchWrap} openTodoModal={openTodoModal} setOpenTodoModal={setOpenTodoModal} setModalTitle={setModalTitle} setTodoDayIndex={setTodoDayIndex} setTodoIndex={setTodoIndex} setSearchInput={setSearchInput} setTripCost={setTripCost} setOpenCostModal={setOpenCostModal} setDetailListNo={setDetailListNo} setTripTodo={setTripTodo} myPlaceRef={myPlaceRef} activeMyPlaceRef={activeMyPlaceRef} activeMyPlaceIndex={activeMyPlaceIndex} setActiveMyPlaceIndex={setActiveMyPlaceIndex} map={map} myInfoWindows={myInfoWindows} markers={markers} showInfoWindow={showInfoWindow} />
                  );
                })
              }
            </div>
            <div className="btn_area">
              <Button text="여행 등록하기" class="btn_primary" clickEvent={createTripsFunc} disabled={tripBtnDisabled} />
            </div>
          </div>

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
                  {/* <div className="result_title">장소</div> */}
                  <div className="result_place_area" ref={resultPlaceArea}>
                    <ul className="place_list">
                      {
                        placeResultList.map((place, index) => {
                          let activePlace = false;
                          if(index === activePlaceIndex){
                            activePlace = true;
                          }
                          return(
                            <ItemTripPlace key={"place"+index} trip={trip} setTrip={setTrip} tripDetailList={tripDetailList} placeResultList={placeResultList} setTripDetailList={setTripDetailList} place={place} thisIndex={detailListNo} listType="result_items" setOpenSearchWrap={setOpenSearchWrap} tripDays={tripDays} activePlace={activePlace} placeRef={placeRef} setActivePlaceIndex={setActivePlaceIndex} activePlaceRef={activePlaceRef} infoWindows={infoWindows} showInfoWindow={showInfoWindow} />
                          );
                        })
                      }
                    </ul>
                    <div id="pagination"></div>
                  </div>
                  {/* <div className="result_title">숙소</div>
                  <div className="result_inns_area">
                    <ul className="inn_list">
                      <li>
                        여기에 이제.. 숙소 정보를..
                      </li>
                    </ul>
                    <div className="btn_area">
                      <Button text="숙소 검색 결과 더보기" class="btn_primary outline md" />
                    </div>
                  </div> */}
                </div>
                <button type="button" className="btn_close" onClick={closeSearchWrap}><span className="hidden">닫기</span></button>
              </div>
            ) : ""
          }
          
        </div>

        <div className="map_area" id="map"></div>
      </div>

      <Modal class="modal lg" open={openTodoModal} closeModal={closeTodoModalFunc} title={modalTitle}>
        <Textarea data={tripTodo} setData={setTripTodo} placeholder="할 일을 입력해주세요" />

        <div className="btn_area">
          <Button class="btn_secondary outline" text="취소" clickEvent={closeTodoModalFunc} />
          <Button class="btn_secondary" text="확인" clickEvent={addTodoFunc} />
        </div>
      </Modal>

      <Modal class="modal" open={openCostModal} closeModal={closeCostModalFunc} title={modalTitle} useCloseBtn={true}>
        <Input type="number" data={tripCost} setData={setTripCost} placeholder="비용을 입력해주세요" />

        <div className="btn_area">
          <Button class="btn_secondary" text="확인" clickEvent={addCostFunc} />
        </div>
      </Modal>
      
    </section>
  );
}

const SetDayWrap = (props) => {
  const tripDetailItem = props.tripDetailItem;
  const tripDetailList = props.tripDetailList;
  const setTripDetailList = props.setTripDetailList;
  const dayIndex = props.dayIndex;
  const tripDays = props.tripDays;
  const setOpenSearchWrap = props.setOpenSearchWrap;
  const setOpenTodoModal = props.setOpenTodoModal;
  const setModalTitle = props.setModalTitle;
  const setTodoDayIndex = props.setTodoDayIndex;
  const setTodoIndex = props.setTodoIndex;
  const setSearchInput = props.setSearchInput;
  const setTripCost = props.setTripCost;
  const setOpenCostModal = props.setOpenCostModal;
  const setDetailListNo = props.setDetailListNo;
  const setTripTodo = props.setTripTodo;
  const myPlaceRef = props.myPlaceRef;
  const activeMyPlaceRef = props.activeMyPlaceRef;
  const activeMyPlaceIndex = props.activeMyPlaceIndex;
  const setActiveMyPlaceIndex = props.setActiveMyPlaceIndex;
  const map = props.map;
  const myInfoWindows = props.myInfoWindows;
  const markers = props.markers;
  const showInfoWindow = props.showInfoWindow;

  const openSearchWrapFunc = () => {
    setOpenSearchWrap(true);
    setDetailListNo(dayIndex);
    setSearchInput("");
  }

  const openCostModalFunc = () => {
    document.body.classList.add("scroll_fixed");
    setModalTitle("Day "+(dayIndex+1));
    setTodoDayIndex(dayIndex);
    setTripCost(tripDetailItem.tripCost);
    setOpenCostModal(true);
  }

  // console.log(dayIndex, tripDetailList[dayIndex]);

  return(
    <div className="set_day_wrap">
      <div className="day_title_wrap">
        <div className="day_title">Day {dayIndex+1}<span className="tripDay">{tripDays}</span></div>
        {
          tripDetailItem.tripCost ? (
            <button type="button" className="btn_tripCost on" onClick={openCostModalFunc}>{tripDetailItem.tripCost}</button>
          ) : (
            <button type="button" className="btn_tripCost" onClick={openCostModalFunc}>비용 추가</button>
          )
        }
      </div>
      <div className="day_items_wrap">
        <ul className="place_list">
          {
            tripDetailItem.selectPlaceList.map((item, index) => {
              let activeMyPlace = false;
              if(item.delNo === 1){
                item.tripRoute = -1
              }else{
                item.tripRoute = index+1;
                item.delNo = -1;
              }
              item.tripDay = tripDetailItem.tripDay;
              if(activeMyPlaceIndex[0] === dayIndex && activeMyPlaceIndex[1] === index){
                activeMyPlace = true;
              }
              return (
                <ItemTripPlace key={"select" + index} tripDetailList={tripDetailList} setTripDetailList={setTripDetailList} routeIndex={index} thisIndex={dayIndex} place={item} listType="day_items" setOpenTodoModal={setOpenTodoModal} setModalTitle={setModalTitle} setTodoDayIndex={setTodoDayIndex} setTodoIndex={setTodoIndex} setTripTodo={setTripTodo} activeMyPlace={activeMyPlace} myPlaceRef={myPlaceRef} activeMyPlaceRef={activeMyPlaceRef} map={map} myInfoWindows={myInfoWindows} markers={markers} activeMyPlaceIndex={activeMyPlaceIndex} setActiveMyPlaceIndex={setActiveMyPlaceIndex} showInfoWindow={showInfoWindow}/>
              );
            })
          }
        </ul>
      </div>
      <div className="day_btns_wrap">
        <div className="btn_area">
          <Button text="장소 추가" class="btn_secondary md" clickEvent={openSearchWrapFunc} />
        </div>
      </div>
    </div>
  );
}

const ItemTripPlace = (props) => {
  const tripDetailList = props.tripDetailList;
  const setTripDetailList = props.setTripDetailList;
  const routeIndex = props.routeIndex;
  const thisIndex = props.thisIndex;
  const place = props.place;
  const listType = props.listType;
  const setOpenTodoModal = props.setOpenTodoModal;
  const setModalTitle = props.setModalTitle;
  const setTodoDayIndex = props.setTodoDayIndex;
  const setTodoIndex = props.setTodoIndex;
  const setOpenSearchWrap = props.setOpenSearchWrap;
  const setTripTodo = props.setTripTodo;
  const tripDays = props.tripDays;
  const placeResultList = props.placeResultList;
  const activePlace = props.activePlace;
  const placeRef = props.placeRef;
  const activePlaceRef = props.activePlaceRef;
  const activeMyPlace = props.activeMyPlace;
  const myPlaceRef = props.myPlaceRef;
  const activeMyPlaceRef = props.activeMyPlaceRef;
  const setActivePlaceIndex = props.setActivePlaceIndex;
  const infoWindows = props.infoWindows;
  const myInfoWindows = props.myInfoWindows;
  const activeMyPlaceIndex = props.activeMyPlaceIndex;
  const setActiveMyPlaceIndex = props.setActiveMyPlaceIndex;
  const showInfoWindow = props.showInfoWindow;

  let colorIndex = 0;
  for(let i=0; i<thisIndex+1; i++){
    colorIndex = colorIndex+1;
    if(i%4 === 0){
        colorIndex = 1;
    }
  }

  const addPlaceFunc = () => {
    tripDetailList[thisIndex].tripDay = tripDays[thisIndex];
    // tripDetailList[thisIndex].selectPlaceList.push({tripPlace: place});
    tripDetailList[thisIndex].selectPlaceList.push({...place, tripDay: tripDays[thisIndex], delNo: -1});
    setTripDetailList([...tripDetailList]);
    setOpenSearchWrap(false);
  }

  const openTodoModalFunc = () => {
    document.body.classList.add("scroll_fixed");
    setModalTitle(place.tripPlaceName);
    setTodoDayIndex(thisIndex);
    setTodoIndex(routeIndex);
    setOpenTodoModal(true);
  }
  
  const modifyTodo = () => {
    document.body.classList.add("scroll_fixed");
    setTripTodo(place.tripTodo);
    setModalTitle(place.tripPlaceName);
    setTodoDayIndex(thisIndex);
    setTodoIndex(routeIndex);
    setOpenTodoModal(true);
  }

  const deleteTodo = () => {
    tripDetailList[thisIndex].selectPlaceList[routeIndex].tripTodo = "";
    setTripDetailList([...tripDetailList]);
    setTripTodo("");
  }

  const deletePlace = () => {
    tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    setTripDetailList([...tripDetailList]);
  }

  const tripRouteDown = () => {
    for(let i=0;i<tripDetailList[thisIndex].selectPlaceList.length;i++){
      tripDetailList[thisIndex].selectPlaceList[i].oldTripRoute = i;
    }
    const thisItem = tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    tripDetailList[thisIndex].selectPlaceList.splice(routeIndex+1,0,thisItem[0]);
    setTripDetailList([...tripDetailList]);
  }

  const tripRouteUp = () => {
    for(let i=0;i<tripDetailList[thisIndex].selectPlaceList.length;i++){
      tripDetailList[thisIndex].selectPlaceList[i].oldTripRoute = i;
    }
    const thisItem = tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    let newIndex = routeIndex-1;
    if(routeIndex === 0){
      newIndex = 0
    }
    tripDetailList[thisIndex].selectPlaceList.splice(newIndex,0,thisItem[0]);
    setTripDetailList([...tripDetailList]);
  }

  const clickMyPlaceFunc = () => {
    if(myInfoWindows.length !== 0){
      activeMyPlaceIndex.length = 0;
      activeMyPlaceIndex.push(thisIndex);
      activeMyPlaceIndex.push(routeIndex);
      setActiveMyPlaceIndex([...activeMyPlaceIndex]);
  
      const array = new Array();
      for(let i=0;i<tripDetailList.length;i++){
        tripDetailList[i].selectPlaceList.forEach((item)=>{
          array.push(item);
        });
      }
  
      array.forEach((item, index) => {
        if(item === place){
          // console.log(myInfoWindows);
          // console.log(myInfoWindows[index]);
          // console.log(place);
          showInfoWindow(myInfoWindows, myInfoWindows[index], place);
        }
      })
    }
    // console.log("아이고");
  }

  const clickPlaceFunc = () => {
    const array = new Array();
    for(let i=0;i<placeResultList.length;i++){
      array.push(placeResultList[i]);
    }
    
    array.forEach((item, index) => {
      if(item === place){
        setActivePlaceIndex(index);
        // console.log(infoWindows);
        // console.log(infoWindows[index]);
        // console.log(place);
        showInfoWindow(infoWindows, infoWindows[index], place);
      }
    })
  }

  return(
    listType === "day_items" ? (
      <>
        <li className={activeMyPlace ? "item tripPlace active" : "item tripPlace"} ref={activeMyPlace ? activeMyPlaceRef : myPlaceRef} onClick={clickMyPlaceFunc}>
          <div className={"tripRoute_no color"+colorIndex}>{(routeIndex+1)}</div>
          <div className="item_box">
            <div className="item_box_content">
              <div className="place_name">{place.tripPlaceName}</div>
              <div className="place_info">
                <span>{place.tripPlaceCategory}</span>
                <span>{place.tripPlaceAddress}</span>
              </div>
            </div>
            <div className="item_btn_wrap">
              {
                routeIndex === 0 ? (
                  <button type="button" className="btn_changeOrder down" onClick={tripRouteDown}><span className="hidden">내리기</span></button>
                ) : routeIndex === tripDetailList[thisIndex].selectPlaceList.length - 1 ? (
                  <button type="button" className="btn_changeOrder up" onClick={tripRouteUp}><span className="hidden">올리기</span></button>
                ) : (
                  <>
                    <button type="button" className="btn_changeOrder down" onClick={tripRouteDown}><span className="hidden">내리기</span></button>
                    <button type="button" className="btn_changeOrder up" onClick={tripRouteUp}><span className="hidden">올리기</span></button>
                  </>
                )
              }
            </div>
            {!place.tripTodo ? (
              <div className="btn_area">
                <Button text="할 일 추가" class="btn_secondary outline md" clickEvent={openTodoModalFunc} />
              </div>
            ) : ""}
            <button type="button" className="btn_delete" onClick={deletePlace}><span className="hidden">삭제</span></button>
          </div>
        </li>
        {place.tripTodo ? (
          <li className="item tripTodo">
          <div className={"tripRoute_no color"+colorIndex}></div>
          <div className="item_box">
            <div className="item_box_content" onClick={modifyTodo}>{place.tripTodo}</div>
            <button type="button" className="btn_delete" onClick={deleteTodo}><span className="hidden">삭제</span></button>
          </div>
        </li>
        ) : ""}
      </>
    ) : (
      <li className={activePlace ? "item tripPlace active" : "item tripPlace"} ref={activePlace ? activePlaceRef : placeRef}>
        <div className="item_box" onClick={clickPlaceFunc}>
          <div className="item_box_content">
            <div className="place_name">{place.tripPlaceName}</div>
            <div className="place_info">
              <span>{place.tripPlaceCategory}</span>
              <span>{place.tripPlaceAddress}</span>
            </div>
            <div className="place_phone">{place.tripPlacePhone}</div>
          </div>
          <div className="item_btn_wrap">
            <Button text="일정 추가" class="btn_primary outline sm btn_addPlace" clickEvent={addPlaceFunc} />
          </div>
        </div>
      </li>
    )
  )
}

export {CreateTrips_backup, SetDayWrap, ItemTripPlace};
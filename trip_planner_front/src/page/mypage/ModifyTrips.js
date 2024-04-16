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
import { useNavigate, useParams } from "react-router-dom";
const { kakao } = window;

const ModifyTrips = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const params = useParams();
  const tripNo = params.tripNo;
  const [modifyMode, setModifyMode] = useState(false);

  const isLogin = props.isLogin;
  if (!isLogin) {
    Swal.fire({
      icon: "warning",
      text: "로그인 후 이용이 가능합니다.",
      confirmButtonText: "닫기",
    }).then(navigate("/"));
  }
  const [trip, setTrip] = useState({}); //최종 데이터
  const [tripDetailList, setTripDetailList] = useState([]);
  const [tripTitleInput, setTripTitleInput] = useState("");
  const [tripTitle, setTripTitle] = useState("");
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
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
  const [datePicker1Disabled, setDatePicker1Disabled] = useState(true);
  const [datePicker2Disabled, setDatePicker2Disabled] = useState(true);
  const [tripTitleInputDisabled, setTripTitleInputDisabled] = useState(true);
  const [btnTripCostDisabled, setBtnTripCostDisabled] = useState(true);
  const [btnChangeOrderDisabled, setBtnChangeOrderDisabled] = useState(true);
  const [btnTodoDisabled, setBtnTodoDisabled] = useState(true);
  const [btnPlaceDisabled, setBtnPlaceDisabled] = useState(true);
  const [btnDeltePlaceDisabled, setBtnDeltePlaceDisabled] = useState(true);
  const [btnModifyText, setBtnModifyText] = useState("수정하기");
  
  useEffect(() => {
    axios.get(backServer + "/trip/view/" + tripNo)
    .then((res) => {
      if(res.data.message === "success"){
        console.log(res.data.data);
        setTripTitle(res.data.data.tripTitle);
        setTripDetailList(res.data.data.tripDetailList);
        setTripStartDate(dayjs(res.data.data.tripStartDate));
        setTripEndDate(dayjs(res.data.data.tripEndDate));
        setTrip(res.data.data);
      }
    })
    .catch((res) => {
      console.log(res);
    })
    console.log(tripDetailList);
  }, [])


  // 제목 수정
  useEffect(() => {
    if(modifyMode){
      if(tripTitle !== ""){
        const tripObj = {tripNo, tripTitle}
        axios.patch(backServer + "/trip/tripTbl", tripObj)
        .then((res) => {
          console.log("제목 수정 axios!!!!!");
          console.log(res.data);
        })
        .catch((res) => {
          console.log(res);
        })
      }
    }
  }, [tripTitle])


  const tripTitieBlurFunc = () => {
    setTripTitle(tripTitleInput);
  }

  // 여행 수정하기
  const modifyTripsFunc = () => {
    if(btnModifyText === "수정완료"){
      Swal.fire({icon: "success", title: "수정 완료", text: "여행 일정이 수정되었습니다.", confirmButtonText: "닫기"});
      navigate("/mypage/myTrips");
      return;
    }
    for(let i=0; i<trip.tripDetailList.length; i++){
      for(let j=0; j<trip.tripDetailList[i].selectPlaceList.length; j++){
        trip.tripDetailList[i].selectPlaceList[j].oldTripRoute = 0;
      }
    }
    setTrip({...trip});
    setDatePicker1Disabled(!datePicker1Disabled);
    setDatePicker2Disabled(!datePicker2Disabled);
    setTripTitleInputDisabled(!tripTitleInputDisabled);
    setBtnTripCostDisabled(!btnTripCostDisabled);
    setBtnChangeOrderDisabled(!btnChangeOrderDisabled);
    setBtnTodoDisabled(!btnTodoDisabled);
    setBtnPlaceDisabled(!btnPlaceDisabled);
    setModifyMode(!modifyMode);
    setBtnDeltePlaceDisabled(!btnDeltePlaceDisabled);
    setBtnModifyText(btnModifyText === "수정하기" ? "수정완료" : "수정하기");
  }

  // 디테일 수정
  useEffect(() => {
    if(modifyMode){

      trip.tripDetailList = tripDetailList;

      // if(tripDetailList.length != 0){
        const tripObj = {tripNo: tripNo, tripStartDate: trip.tripStartDate, tripEndDate: trip.tripEndDate, tripDetailList: trip.tripDetailList, tripDetailListStr: JSON.stringify(trip.tripDetailList)};
        console.log("보내는 정보");
        console.log(tripObj);
        axios.patch(backServer + "/trip/tripDetailTbl", tripObj)
        .then((res) => {
          console.log("디테일 수정 axios!!!!!");
          console.log(res.data);

          axios.get(backServer + "/trip/view/" + tripNo)
          .then((res) => {
            if(res.data.message === "success"){
              console.log(res.data.data);
              trip.tripDetailList = res.data.data.tripDetailList;
              for(let i=0; i<trip.tripDetailList.length; i++){
                for(let j=0; j<trip.tripDetailList[i].selectPlaceList.length; j++){
                  // console.log("얘한테: ");
                  // console.log(trip.tripDetailList[i].selectPlaceList[j].tripDetailNo);
                  // console.log("이걸 주겠다: ");
                  // console.log(trip.tripDetailList[i].tripDetailNo);
                  trip.tripDetailList[i].selectPlaceList[j].tripDetailNo = trip.tripDetailList[i].tripDetailNo;
                  trip.tripDetailList[i].selectPlaceList[j].oldTripRoute = 0;
                  if(trip.tripDetailList[i].selectPlaceList[j].delNo === 1){
                    trip.tripDetailList[i].selectPlaceList.splice(j, 1);
                  }
                }
              }
              setTripDetailList([...trip.tripDetailList]);
            }
          })
          .catch((res) => {
            console.log(res);
          })

        })
        .catch((res) => {
          console.log(res);
        })
      // }
      
    }
  }, [trip])

  useEffect(() => {
    console.log("현재 버전 trip")
    console.log(trip)
  }, [trip])

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
    // console.log("todo 수정");
    // console.log(tripDetailList[todoDayIndex].selectPlaceList[todoIndex].tripTodo);

    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
  }

  const addCostFunc = () => {
    tripDetailList[todoDayIndex].tripCost = tripCost;
    setTripDetailList([...tripDetailList]);
    setTripCost("");
    setOpenCostModal(false);

    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
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

  const clickPlaceListFunc = (e) => {
    console.log(e.target);
  }

  /* 지도(최초 1회만 등록) */
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapRoutes, setMapRoutes] = useState([]);
  const [linePath, setLinePath] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [mapPs, setMapPs] = useState(null);
  const [activePlaceIndex, setActivePlaceIndex] = useState(0);
  const placeRef = useRef();
  const activePlaceRef = useRef();
  const resultPlaceArea = useRef();
  const [activeMyPlaceIndex, setActiveMyPlaceIndex] = useState([]);
  const myPlaceRef = useRef();
  const activeMyPlaceRef = useRef();
  const selectMyPlaceArea = useRef();
  useEffect(()=>{
    if(activeMyPlaceRef.current){
      resultPlaceArea.current.scrollTop = activePlaceRef.current.offsetTop;
    }
  },[activePlaceIndex]);
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

    // 지도 표시를 위한 영역값
    const bounds = new kakao.maps.LatLngBounds();

    removeMarker();
    removeMapRoute();
    removeInfoWindow();
    removeLinePath();
    removePolyline();

    // 담아놓은 여행장소가 하나라도 있으면
    const emptySp = tripDetailList.filter((item) => {
      return item.selectPlaceList.length === 0;
    })
    // 내 장소들 최초 표시
    // const linePath = [];
    if(tripDetailList.length !== 0 && emptySp.length !== tripDetailList.length){
      displayMyMarker();
    }
    
    // 장소 검색
    const placesSearchCB = (data, status, pagination) => {
      placeResultList.length = 0;
      setPlaceResultList([...placeResultList]);

      if(status === kakao.maps.services.Status.OK) {
        removeMarker();
        removeInfoWindow();
        removeLinePath();
        removePolyline();

        if(openSearchWrap){
          data.forEach((place, index) => {
            setActivePlaceIndex(0);
            displayMarker(place, index);
            
            placeResultList.push({
              tripPlaceName : place.place_name,
              tripPlaceCategory : place.category_group_name !== "" ? place.category_group_name : place.category_name,
              tripPlaceAddress : place.address_name,
              tripPlacePhone : place.phone,
              tripPlaceLat : place.y,
              tripPlaceLng : place.x
            });
            setPlaceResultList([...placeResultList]);
          })

          displayPagination(pagination);
        }
        // else{
          if(tripDetailList.length !== 0){
            displayMyMarker();
          }
        // }
      }
    }

    function displayPagination(pagination) {
      let paginationEl = document.getElementById('pagination'),
          fragment = document.createDocumentFragment(),
          i;

      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
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

    if(searchPlaces !== "") {
      mapPs.keywordSearch(searchPlaces, placesSearchCB, {size: 10});
    }

    // 검색한 장소 마커와 인포윈도우
    const displayMarker = (place, index) => {
      bounds.extend(new kakao.maps.LatLng(place.y, place.x));

      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
        zIndex: 30
      });
      markers.push(marker);
      setMarkers([...markers]);
        
      const infoWindow = new kakao.maps.CustomOverlay({
        zIndex: 45,
        yAnchor: 1.7
      });
      infoWindows.push(infoWindow);
      setInfoWindows([...infoWindows]);

      kakao.maps.event.addListener(marker, 'click', function() {
        marker.setClickable(true);
        setActivePlaceIndex(index);
        console.log(resultPlaceArea.current.scrollHeight);
        console.log(activePlaceRef.current.offsetTop);
        //resultPlaceArea.current.scrollTop = activePlaceRef.current.offsetTop;

        let infoWindowStr = [
          "<div class='infoWindow'>",
            "<div class='item_box'>",
              "<div class='item_box_content'>",
                "<div class='place_name'>"+place.place_name+"</div>",
                "<div class='place_info'>",
                  "<span>"+place.category_group_name+"</span>",
                  "<span>"+place.address_name+"</span>",
                "</div>",
                "<div class='place_phone'>"+place.phone+"</div>",
              "</div>",
            "</div>",
          "</div>"
        ].join("");
        infoWindow.setContent(infoWindowStr);
        infoWindow.setPosition(new kakao.maps.LatLng(place.y, place.x));
        for (let i=0; i<infoWindows.length; i++) {
          infoWindows[i].setMap(null);
        }
        infoWindow.setMap(map);
        map.setCenter(new kakao.maps.LatLng(place.y, place.x));
      });

      // kakao.maps.event.addListener(marker, 'custom_action', function(data){
      //   console.log(data + '가 발생했습니다.');
      // });
      // kakao.maps.event.trigger(marker, 'custom_action', '내 이벤트');

      map.setBounds(bounds);
    }
    
    // 내 장소 마커, 루트, 인포윈도우
    function displayMyMarker() {
      // removeMarker();
      removeMapRoute();
      // removeInfoWindow();
      // removeLinePath();
      // removePolyline();
      
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
          markers.push(marker);
          setMarkers([...markers]);

          const infoWindow = new kakao.maps.CustomOverlay({
            zIndex: 50,
            yAnchor: 1.7,
          });
          infoWindows.push(infoWindow);
          setInfoWindows([...infoWindows]);

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
            
          setActiveMyPlaceIndex([0,0]);
          kakao.maps.event.addListener(marker, 'click', function() {
            
            marker.setClickable(true);
            activeMyPlaceIndex.length = 0;
            activeMyPlaceIndex.push(index);
            activeMyPlaceIndex.push(idx);
            setActiveMyPlaceIndex([...activeMyPlaceIndex]);
            console.log(activeMyPlaceIndex);
            // console.log(selectMyPlaceArea.current.scrollHeight);
            // console.log(activeMyPlaceRef.current.offsetTop);
            // selectMyPlaceArea.current.scrollTop = activeMyPlaceRef.current.offsetTop;

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
            infoWindow.setPosition(new kakao.maps.LatLng(tripDetailList[activeMyPlaceIndex[0]].selectPlaceList[activeMyPlaceIndex[1]].tripPlaceLat, tripDetailList[activeMyPlaceIndex[0]].selectPlaceList[activeMyPlaceIndex[1]].tripPlaceLng));
            for (let i=0; i<infoWindows.length; i++) {
              infoWindows[i].setMap(null);
            }
            infoWindow.setMap(map);
            map.setCenter(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
          });

          // 장소에 이을 선 좌표 배열 추가
          linePath.push(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));

          // 선 생성
          const polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#E9511C',
            strokeOpacity: 0.6,
            strokeStyle: 'dashed'
          });

          polylines.push(polyline);
          setPolylines([...polylines]);

          // 선 표시
          for (let i=0; i<polylines.length; i++) {
            polylines[i].setMap(null);
          }
          polyline.setMap(map);
          map.setBounds(bounds);
        })

      })

    }

    function removeMarker(){
      for(let i=0; i<markers.length; i++) {
        markers[i].setMap(null);
      }   
      markers.length = 0;
      setMarkers([...markers]);
    }

    function removeMapRoute(){
      for (let i=0; i<mapRoutes.length; i++) {
        mapRoutes[i].setMap(null);
      }   
      mapRoutes.length = 0;
      setMapRoutes([...mapRoutes]);
    }

    function removeInfoWindow(){
      for (let i=0; i<infoWindows.length; i++) {
        infoWindows[i].setMap(null);
      }   
      infoWindows.length = 0;
      setInfoWindows([...infoWindows]);
    }

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
    // console.log(tripDetailList);

    if(tripStartDate && tripEndDate){
      if(new Date(tripEndDate.$d.getTime()) < new Date(tripStartDate.$d.getTime())){
        return;
      }
      trip.tripStartDate = dayjs(tripStartDate).format("YYYY-MM-DD");
      trip.tripEndDate = dayjs(tripEndDate).format("YYYY-MM-DD");

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
          if(tripDate === endDate){//마지막 바퀴에선 마지막 날짜에 사라진 날짜의 selectPlaceList를 추가
            const array = new Array();

            for(let i=tripDayCount;i<copyTripDetailList.length;i++){
              for(let j=0;j<copyTripDetailList[i].selectPlaceList.length;j++){
                copyTripDetailList[i].selectPlaceList[j].oldTripDay = copyTripDetailList[i].selectPlaceList[j].tripDay;
                copyTripDetailList[i].selectPlaceList[j].oldTripRoute = copyTripDetailList[i].selectPlaceList[j].tripRoute;
                array.push(copyTripDetailList[i].selectPlaceList[j]);
              }
            }

            if(copyTripDetailList[tripDayCount]){
              newTripDetailList.push({tripDetailNo: copyTripDetailList[tripDayCount].tripDetailNo, tripNo: copyTripDetailList[tripDayCount].tripNo, selectPlaceList : array, tripDay: tripDate, tripCost: copyTripDetailList[tripDayCount].tripCost});
            }else{
              newTripDetailList.push({selectPlaceList : array, tripDay: tripDate});
            }
          }else{
            if(copyTripDetailList[tripDayCount]){
              newTripDetailList.push({tripDetailNo: copyTripDetailList[tripDayCount].tripDetailNo, tripNo: copyTripDetailList[tripDayCount].tripNo, selectPlaceList : copyTripDetailList[tripDayCount].selectPlaceList, tripDay: tripDate, tripCost: copyTripDetailList[tripDayCount].tripCost});
            }else{
              newTripDetailList.push({selectPlaceList : copyTripDetailList[tripDayCount].selectPlaceList, tripDay: tripDate});
            }
          }
        }else{
          if(copyTripDetailList[tripDayCount]){
            newTripDetailList.push({tripDetailNo: copyTripDetailList[tripDayCount].tripDetailNo, tripNo: copyTripDetailList[tripDayCount].tripNo, selectPlaceList : [], tripDay: tripDate, tripCost: copyTripDetailList[tripDayCount].tripCost});
          }else{
            newTripDetailList.push({selectPlaceList: [], tripDay: tripDate});
          }
        }
        if(tripDate === endDate){
          break;
        }
        tripDayCount++;
      }
      setTripDays(newTripDate);
      setTripDetailList(newTripDetailList);
      // trip.tripDetailList = [...newTripDetailList];
      setTrip({...trip});

      // if(trip.tripStartDate !== dayjs(tripStartDate).format("YYYY-MM-DD")){
      //   console.log("시작 날짜 변경");
      //   trip.tripStartDate = dayjs(tripStartDate).format("YYYY-MM-DD");
      // }
      // if(trip.tripEndDate !== dayjs(tripEndDate).format("YYYY-MM-DD")){
      //   console.log("종료 날짜 변경");
      //   trip.tripEndDate = dayjs(tripEndDate).format("YYYY-MM-DD");
      // }

      const tripObj = {tripNo: tripNo, tripStartDate: trip.tripStartDate, tripEndDate: trip.tripEndDate};
      
      if(modifyMode){
        console.log("날짜 수정 여기용");
        console.log(tripObj);

        axios.patch(backServer + "/trip/tripTbl", tripObj)
        .then((res) => {
          console.log("날짜 수정 axios!!!!!");
          console.log(res.data);
        })
        .catch((res) => {
          console.log(res);
        })
      }

    }
  },[tripStartDate, tripEndDate])

  return (
    <section className="contents trips">
      <h2 className="hidden">여행 일정 수정</h2>
      <div className="createTrips_wrap">
        <div className="left_area">
          <div className="trips_wrap">
            <div className="trips_input_wrap">
              <div className="set_title_wrap">
                <Input type="text" disabled={tripTitleInputDisabled} data={tripTitleInput === "" ? tripTitle : ""} setData={setTripTitleInput} placeholder="여행 제목을 입력해주세요" blurEvent={tripTitieBlurFunc} />
              </div>
              <div className="set_date_wrap">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker disabled={datePicker1Disabled} onChange={(newValue)=>{
                      setTripStartDate(newValue);
                    }} format="YYYY-MM-DD" value={tripStartDate || dayjs(new Date())} disablePast />
                    <DatePicker disabled={datePicker2Disabled} onChange={(newValue)=>{
                      setTripEndDate(newValue);
                    }} format="YYYY-MM-DD" value={tripEndDate || dayjs(new Date())} disablePast />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="trips_plan_wrap" ref={selectMyPlaceArea}>
              {
                tripDetailList.map((item, index) => {
                  return(
                    <SetDayWrap key={"day" + index} tripDetailItem={item} trip={trip} setTrip={setTrip} tripDetailList={tripDetailList} setTripDetailList={setTripDetailList} dayIndex={index} tripDays={tripDays[index]} setOpenSearchWrap={setOpenSearchWrap} openTodoModal={openTodoModal} setOpenTodoModal={setOpenTodoModal} setModalTitle={setModalTitle} setTodoDayIndex={setTodoDayIndex} setTodoIndex={setTodoIndex} setSearchInput={setSearchInput} setTripCost={setTripCost} setOpenCostModal={setOpenCostModal} setDetailListNo={setDetailListNo} setTripTodo={setTripTodo} btnTripCostDisabled={btnTripCostDisabled} btnChangeOrderDisabled={btnChangeOrderDisabled} btnTodoDisabled={btnTodoDisabled} btnPlaceDisabled={btnPlaceDisabled} btnDeltePlaceDisabled={btnDeltePlaceDisabled} myPlaceRef={myPlaceRef} activeMyPlaceRef={activeMyPlaceRef} activeMyPlaceIndex={activeMyPlaceIndex} setInfoWindowOpen={setInfoWindowOpen} map={map} infoWindows={infoWindows} markers={markers} setActiveMyPlaceIndex={setActiveMyPlaceIndex} />
                  );
                })
              }
            </div>
            <div className="btn_area">
              {
                  new Date(trip.tripEndDate).toLocaleDateString("ko-KR") >= new Date().toLocaleDateString("ko-KR") ? (
                  <Button text={btnModifyText} class="btn_primary" clickEvent={modifyTripsFunc} />
                ) : ""
              }
              
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
                  <div className="result_title">장소</div>
                  <div className="result_place_area" ref={resultPlaceArea}>
                    <ul className="place_list">
                      {
                        placeResultList.map((place, index) => {
                          let activePlace = false;
                          if(index === activePlaceIndex){
                            activePlace = true;
                          }
                          return(
                            <ItemTripPlace key={"place"+index} trip={trip} setTrip={setTrip} tripDetailList={tripDetailList} setTripDetailList={setTripDetailList} place={place} thisIndex={detailListNo} listType="result_items" setOpenSearchWrap={setOpenSearchWrap} tripDays={tripDays} clickPlaceListFunc={clickPlaceListFunc} activePlace={activePlace} placeRef={placeRef} activePlaceRef={activePlaceRef} />
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
  const trip = props.trip;
  const setTrip = props.setTrip;
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
  const btnTripCostDisabled = props.btnTripCostDisabled;
  const btnChangeOrderDisabled = props.btnChangeOrderDisabled
  const btnTodoDisabled = props.btnTodoDisabled;
  const btnPlaceDisabled = props.btnPlaceDisabled;
  const btnDeltePlaceDisabled = props.btnDeltePlaceDisabled;
  const myPlaceRef = props.myPlaceRef;
  const activeMyPlaceRef = props.activeMyPlaceRef;
  const activeMyPlaceIndex = props.activeMyPlaceIndex;
  const setActiveMyPlaceIndex = props.setActiveMyPlaceIndex;
  const setInfoWindowOpen = props.setInfoWindowOpen;
  const map = props.map;
  const infoWindows = props.infoWindows;
  const markers = props.markers;

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
            <button disabled={btnTripCostDisabled} type="button" className="btn_tripCost on" onClick={openCostModalFunc}>{tripDetailItem.tripCost}</button>
          ) : (
            <button disabled={btnTripCostDisabled} type="button" className="btn_tripCost" onClick={openCostModalFunc}>비용 추가</button>
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
                <ItemTripPlace key={"select" + index} trip={trip} setTrip={setTrip} tripDetailList={tripDetailList} setTripDetailList={setTripDetailList} routeIndex={index} thisIndex={dayIndex} place={item} listType="day_items" setOpenTodoModal={setOpenTodoModal} setModalTitle={setModalTitle} setTodoDayIndex={setTodoDayIndex} setTodoIndex={setTodoIndex} setTripTodo={setTripTodo} btnChangeOrderDisabled={btnChangeOrderDisabled} btnTodoDisabled={btnTodoDisabled} btnDeltePlaceDisabled={btnDeltePlaceDisabled} activeMyPlace={activeMyPlace} myPlaceRef={myPlaceRef} activeMyPlaceRef={activeMyPlaceRef} setInfoWindowOpen={setInfoWindowOpen} map={map} infoWindows={infoWindows} markers={markers} activeMyPlaceIndex={activeMyPlaceIndex} setActiveMyPlaceIndex={setActiveMyPlaceIndex} />
              );
            })
          }
        </ul>
      </div>
      <div className="day_btns_wrap">
        <div className="btn_area">
          <Button disabled={btnPlaceDisabled} text="장소 추가" class="btn_secondary md" clickEvent={openSearchWrapFunc} />
        </div>
      </div>
    </div>
  );
}

const ItemTripPlace = (props) => {
  const trip = props.trip;
  const setTrip = props.setTrip;
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
  const btnChangeOrderDisabled = props.btnChangeOrderDisabled;
  const btnTodoDisabled = props.btnTodoDisabled;
  const btnDeltePlaceDisabled = props.btnDeltePlaceDisabled;
  const clickPlaceListFunc = props.clickPlaceListFunc;
  const activePlace = props.activePlace;
  const placeRef = props.placeRef;
  const activePlaceRef = props.activePlaceRef;
  const activeMyPlace = props.activeMyPlace;
  const myPlaceRef = props.myPlaceRef;
  const activeMyPlaceRef = props.activeMyPlaceRef;
  const setInfoWindowOpen = props.setInfoWindowOpen;
  const map = props.map;
  const infoWindows = props.infoWindows;
  const markers = props.markers;
  const activeMyPlaceIndex = props.activeMyPlaceIndex;
  const setActiveMyPlaceIndex = props.setActiveMyPlaceIndex;

  let colorIndex = 0;
  for(let i=0; i<thisIndex+1; i++){
    colorIndex = colorIndex+1;
    if(i%4 === 0){
        colorIndex = 1;
    }
  }

  const addPlaceFunc = (e) => {
    e.stopPropagation();
    tripDetailList[thisIndex].tripDay = tripDays[thisIndex];
    tripDetailList[thisIndex].selectPlaceList.push({...place, tripDay: tripDays[thisIndex], delNo: -1, tripDetailNo: 0});
    setTripDetailList([...tripDetailList]);
    setOpenSearchWrap(false);

    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
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

    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
  }

  const deletePlace = (e) => {
    e.stopPropagation();
    // console.log(routeIndex);
    // tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    tripDetailList[thisIndex].selectPlaceList[routeIndex].delNo = 1;
    tripDetailList[thisIndex].selectPlaceList[routeIndex].oldTripRoute = tripDetailList[thisIndex].selectPlaceList[routeIndex].tripRoute;
  
    for(let i=0; i<trip.tripDetailList[thisIndex].selectPlaceList.length; i++){
      //지운 장소의 이전 장소들 루트 수정
      if(routeIndex > i){
        tripDetailList[thisIndex].selectPlaceList[routeIndex-(i+1)].tripRoute = tripDetailList[thisIndex].selectPlaceList[routeIndex-(i+1)].tripRoute;
        tripDetailList[thisIndex].selectPlaceList[routeIndex-(i+1)].oldTripRoute = tripDetailList[thisIndex].selectPlaceList[routeIndex-(i+1)].tripRoute;
      }
      //지운 장소의 다음 장소들 루트 수정
      if(tripDetailList[thisIndex].selectPlaceList[routeIndex+(i+1)]){
        tripDetailList[thisIndex].selectPlaceList[routeIndex+(i+1)].oldTripRoute = tripDetailList[thisIndex].selectPlaceList[routeIndex+(i+1)].tripRoute;
        tripDetailList[thisIndex].selectPlaceList[routeIndex+(i+1)].tripRoute = routeIndex+(i+1);
      }
    }

    const delItem = tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    tripDetailList[thisIndex].selectPlaceList.push(...delItem);
    setTripDetailList([...tripDetailList]);
    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
  }

  const tripRouteDown = (e) => {
    e.stopPropagation();
    for(let i=0;i<tripDetailList[thisIndex].selectPlaceList.length;i++){
      tripDetailList[thisIndex].selectPlaceList[i].oldTripRoute = tripDetailList[thisIndex].selectPlaceList[i].tripRoute;
    }
    const thisItem = tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    tripDetailList[thisIndex].selectPlaceList.splice(routeIndex+1,0,thisItem[0]);
    setTripDetailList([...tripDetailList]);
    // console.log("routeDown");
    // console.log(tripDetailList);

    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
  }

  const tripRouteUp = (e) => {
    e.stopPropagation();
    for(let i=0;i<tripDetailList[thisIndex].selectPlaceList.length;i++){
      tripDetailList[thisIndex].selectPlaceList[i].oldTripRoute = tripDetailList[thisIndex].selectPlaceList[i].tripRoute;
    }
    const thisItem = tripDetailList[thisIndex].selectPlaceList.splice(routeIndex, 1);
    let newIndex = routeIndex-1;
    if(routeIndex === 0){
      newIndex = 0
    }
    tripDetailList[thisIndex].selectPlaceList.splice(newIndex,0,thisItem[0]);
    setTripDetailList([...tripDetailList]);
    // console.log("routeUp");
    // console.log(tripDetailList);

    trip.tripDetailList = tripDetailList;
    setTrip({...trip});
  }
  // console.log(tripDetailList[thisIndex])

  const clickPlaceFunc = () => {
    console.log(activeMyPlaceIndex);
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
    console.log(array);
    console.log(tripDetailList)
    console.log(place);
    array.forEach((item,index)=>{
      if(item === place){
        let infoWindowStr = [
          "<div class='infoWindow'>",
            "<div class='item_box'>",
              "<div class='item_box_content'>",
                "<div class='place_name'>"+place.tripPlaceName+"</div>",
                "<div class='place_info'>",
                  "<span>"+place.tripPlaceCategory
                  +"</span>",
                  "<span>"+place.tripPlaceAddress+"</span>",
                "</div>",
                "<div class='place_phone'>"+place.tripPlacePhone+"</div>",
              "</div>",
            "</div>",
          "</div>"
        ].join("");
        for (let i=0; i<infoWindows.length; i++) {
          infoWindows[i].setMap(null);
        }
        infoWindows[index].setContent(infoWindowStr);
        infoWindows[index].setPosition(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
        infoWindows[index].setMap(map);
        map.setCenter(new kakao.maps.LatLng(place.tripPlaceLat, place.tripPlaceLng));
      }
    });
    console.log("아이고");
    console.log(markers);
    // activeMyPlaceIndex.length = 0;
    // activeMyPlaceIndex.push(index);
    // activeMyPlaceIndex.push(idx);
    // setActiveMyPlaceIndex([...activeMyPlaceIndex]);

    setInfoWindowOpen(true);
  }

  return(
    listType === "day_items" ? (
      <>
        {place.delNo !== 1 ? (
          <li className={activeMyPlace ? "item tripPlace active" : "item tripPlace"} ref={activeMyPlace ? activeMyPlaceRef : myPlaceRef} onClick={clickPlaceFunc}>
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
                  tripDetailList[thisIndex].selectPlaceList.length > 1 && routeIndex === 0 ? (
                    <button disabled={btnChangeOrderDisabled} type="button" className="btn_changeOrder down" onClick={tripRouteDown}><span className="hidden">내리기</span></button>
                  ) : tripDetailList[thisIndex].selectPlaceList.length > 1 && routeIndex === tripDetailList[thisIndex].selectPlaceList.length - 1 ? (
                    <button disabled={btnChangeOrderDisabled} type="button" className="btn_changeOrder up" onClick={tripRouteUp}><span className="hidden">올리기</span></button>
                  ) : tripDetailList[thisIndex].selectPlaceList.length > 1 ? (
                    <>
                      <button disabled={btnChangeOrderDisabled} type="button" className="btn_changeOrder down" onClick={tripRouteDown}><span className="hidden">내리기</span></button>
                      <button disabled={btnChangeOrderDisabled} type="button" className="btn_changeOrder up" onClick={tripRouteUp}><span className="hidden">올리기</span></button>
                    </>
                  ) : ""
                }
              </div>
              {!place.tripTodo ? (
                <div className="btn_area">
                  <Button disabled={btnTodoDisabled} text="할 일 추가" class="btn_secondary outline md" clickEvent={openTodoModalFunc} />
                </div>
              ) : ""}
              <button disabled={btnDeltePlaceDisabled} type="button" className="btn_delete" onClick={deletePlace}><span className="hidden">삭제</span></button>
            </div>
          </li>
          ) : ""
        }
        {/* {place.delNo !== 1 && place.tripTodo ? ( */}
        {place.tripTodo ? (
          <li className="item tripTodo">
          <div className={"tripRoute_no color"+colorIndex}></div>
          <div className="item_box">
            <div className="item_box_content" onClick={modifyTodo}>{place.tripTodo}</div>
            <button disabled={btnDeltePlaceDisabled} type="button" className="btn_delete" onClick={deleteTodo}><span className="hidden">삭제</span></button>
          </div>
        </li>
        ) : ""}
      </>
    ) : (
      <li className={activePlace ? "item tripPlace active" : "item tripPlace"} ref={activePlace ? activePlaceRef : placeRef}>
        <div className="item_box" onClick={clickPlaceListFunc}>
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

export default ModifyTrips;
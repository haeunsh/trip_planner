import Swal from "sweetalert2";
import "./createTrips.css";
import { useNavigate, useParams } from "react-router-dom";
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

const ModifyTrips = (props)=>{
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const params = useParams();
  const tripNo = params.tripNo;

  if(!isLogin) {
    Swal.fire({
      icon: "warning",
      text: "로그인 후 이용이 가능합니다.",
      confirmButtonText: "닫기",
    }).then(navigate("/"));
  }

  /***** 완성 시 등록할 데이터 *****/
  const [tripTitle, setTripTitle] = useState("");
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
  const [tripDetailList, setTripDetailList] = useState([]);
  
  /***** 화면용 states *****/
  const [trip, setTrip] = useState({});
  const [modifyTrip, setModifyTrip] = useState({});
  const [tripTitleInput, setTripTitleInput] = useState("");
  const [tripDays, setTripDays] = useState([]);
  const [openSearchWrap, setOpenSearchWrap] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const resultWrap = useRef();
  const tripsPlanWrap = useRef();
  const placeRef = useRef();
  const activePlaceRef = useRef();
  const myPlaceRef = useRef();
  const activeMyPlaceRef = useRef();
  const activeInnRef = useRef();
  const [placeReqPage, setPlaceReqPage] = useState(-1);
  const [placeList, setPlaceList] = useState([]);
  const [placePageInfo, setPlacePageInfo] = useState({});
  const [activePlaceIndex, setActivePlaceIndex] = useState(-1);
  const [activeInnIndex, setActiveInnIndex] = useState(-1);
  const [activeMyPlaceIndex, setActiveMyPlaceIndex] = useState([]);
  const [innReqPage, setInnReqPage] = useState(-1);
  const [innList, setInnList] = useState([]);
  const [innPageInfo, setInnPageInfo] = useState({});
  const [selectPlaceList, setSelectPlaceList] = useState([]);
  const [selectPlaceListIndex, setSelectPlaceListIndex] = useState(-1);
  const [openCostModal, setOpenCostModal] = useState(false);
  const [openTodoModal, setOpenTodoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [tripCost, setTripCost] = useState(0);
  const [tripTodo, setTripTodo] = useState("");
  const [selectPlaceIndex, setSelectPlaceIndex] = useState(-1);

  const [btnModifyText, setBtnModifyText] = useState("수정하기");
  const [modifyMode, setModifyMode] = useState(false);
  
  //등록된 데이터 가져오기
  useEffect(() => {
    axios.get(backServer + "/trip/view/" + tripNo)
    .then((res) => {
      if(res.data.message === "success"){
        console.log(res.data.data);
        setTripTitleInput(res.data.data.tripTitle);
        setTripStartDate(dayjs(res.data.data.tripStartDate));
        setTripEndDate(dayjs(res.data.data.tripEndDate));
        const placeListArr = new Array();
        for(let i=0; i<res.data.data.tripDetailList.length; i++){
          if(i !== 0){
            if(res.data.data.tripDetailList[i].tripDay === res.data.data.tripDetailList[i-1].tripDay){
              if(res.data.data.tripDetailList[i].selectPlace){
                res.data.data.tripDetailList[i].selectPlace.tripDetailNo = res.data.data.tripDetailList[i].tripDetailNo;
                res.data.data.tripDetailList[i].selectPlace.tripCost = res.data.data.tripDetailList[i].tripCost;
                res.data.data.tripDetailList[i].selectPlace.tripTodo = res.data.data.tripDetailList[i].tripTodo;
                placeListArr[placeListArr.length-1].push(res.data.data.tripDetailList[i].selectPlace);
              }else if(res.data.data.tripDetailList[i].selectInn){
                res.data.data.tripDetailList[i].selectInn.tripDetailNo = res.data.data.tripDetailList[i].tripDetailNo;
                res.data.data.tripDetailList[i].selectInn.tripCost = res.data.data.tripDetailList[i].tripCost;
                res.data.data.tripDetailList[i].selectInn.tripTodo = res.data.data.tripDetailList[i].tripTodo;
                placeListArr[placeListArr.length-1].push(res.data.data.tripDetailList[i].selectInn);
              }
            }else{
              const innerArr = new Array();
              if(res.data.data.tripDetailList[i].selectPlace){
                res.data.data.tripDetailList[i].selectPlace.tripDetailNo = res.data.data.tripDetailList[i].tripDetailNo;
                res.data.data.tripDetailList[i].selectPlace.tripCost = res.data.data.tripDetailList[i].tripCost;
                res.data.data.tripDetailList[i].selectPlace.tripTodo = res.data.data.tripDetailList[i].tripTodo;
                innerArr.push(res.data.data.tripDetailList[i].selectPlace);
                placeListArr.push(innerArr);
              }else if(res.data.data.tripDetailList[i].selectInn){
                res.data.data.tripDetailList[i].selectInn.tripDetailNo = res.data.data.tripDetailList[i].tripDetailNo;
                res.data.data.tripDetailList[i].selectInn.tripCost = res.data.data.tripDetailList[i].tripCost;
                res.data.data.tripDetailList[i].selectInn.tripTodo = res.data.data.tripDetailList[i].tripTodo;
                innerArr.push(res.data.data.tripDetailList[i].selectInn);
                placeListArr.push(innerArr);
              }
            }
          }else{
            const innerArr = new Array();
            if(res.data.data.tripDetailList[i].selectPlace){
              res.data.data.tripDetailList[i].selectPlace.tripDetailNo = res.data.data.tripDetailList[i].tripDetailNo;
              res.data.data.tripDetailList[i].selectPlace.tripCost = res.data.data.tripDetailList[i].tripCost;
              res.data.data.tripDetailList[i].selectPlace.tripTodo = res.data.data.tripDetailList[i].tripTodo;
              innerArr.push(res.data.data.tripDetailList[i].selectPlace);
              placeListArr.push(innerArr);
            }else if(res.data.data.tripDetailList[i].selectInn){
              res.data.data.tripDetailList[i].selectInn.tripDetailNo = res.data.data.tripDetailList[i].tripDetailNo;
              res.data.data.tripDetailList[i].selectInn.tripCost = res.data.data.tripDetailList[i].tripCost;
              res.data.data.tripDetailList[i].selectInn.tripTodo = res.data.data.tripDetailList[i].tripTodo;
              innerArr.push(res.data.data.tripDetailList[i].selectInn);
              placeListArr.push(innerArr);
            }
          }
        }
        // console.log(placeListArr);
        setSelectPlaceList(placeListArr);
      }
    })
    .catch((res) => {
      console.log(res);
    })
  }, [modifyTrip])

  /***** functions *****/
  //*** 여행 수정하기 버튼 클릭시 ***//
  const modifyFunc = ()=>{
    if(btnModifyText === "수정 완료"){
      Swal.fire({icon: "success", title: "수정 완료", text: "여행 일정이 수정되었습니다.", confirmButtonText: "닫기"});
      navigate("/mypage/myTrips");
    }else{
      //수정권한 체크하고 넣어주기
      setModifyMode(true);
      setBtnModifyText("수정 완료");
    }
  }
  //여행 제목 수정
  const setTripTitleFunc = () => {
    setTripTitle(tripTitleInput);
  }
  //장소 검색창 닫았을 때
  const closeSearchWrapFunc = ()=>{
    setActiveMyPlaceIndex([]);
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
    setActivePlaceIndex(-1);
    removeInfoWindow(infoWindows, setInfoWindows);
    const searchObj = {keyword: keyword, reqPage: placeReqPage};
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
    setActiveInnIndex(-1);
    removeInfoWindow(innInfoWindows, setInnInfoWindows);
    const searchObj = {keyword: keyword, reqPage: innReqPage};
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
    setActiveMyPlaceIndex([]);
    if(place.type === "place"){
      setActiveInnIndex(-1);
      setActivePlaceIndex(index);
      showInfoWindow(infoWindows, infoWindows[index], place);
    }
    if(place.type === "inn"){
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
  //내 장소 스크롤 이벤트
  useEffect(()=>{
    if(activeMyPlaceRef.current){
      // console.log(activeMyPlaceRef.current.offsetTop);
      // console.log(activeMyPlaceRef.current.parentNode.parentNode.parentNode.offsetTop - tripsPlanWrap.current.offsetTop);
      tripsPlanWrap.current.scrollTop = activeMyPlaceRef.current.parentNode.parentNode.parentNode.offsetTop - tripsPlanWrap.current.offsetTop + activeMyPlaceRef.current.offsetTop;
    }
  },[activeMyPlaceIndex]);
  //일정 추가 함수
  const addPlaceFunc = (place, index)=>{
    if(place.type === "place"){
      myInfoWindows.push(infoWindows[index])
      setMyInfoWindows([...myInfoWindows]);
    }
    if(place.type === "inn"){
      myInfoWindows.push(innInfoWindows[index])
      setMyInfoWindows([...myInfoWindows]);
    }
    place.tripDay = tripDays[selectPlaceListIndex];
    place.tripRoute = selectPlaceList[selectPlaceListIndex].length === 0 ? 1 : selectPlaceList[selectPlaceListIndex].length+1;
    selectPlaceList[selectPlaceListIndex].push(place);
    setSelectPlaceList([...selectPlaceList]);
    trip.selectPlaceList = selectPlaceList;
    setTrip({...trip});
  }
  //비용 추가 함수
  const addCostFunc = ()=>{
    selectPlaceList[selectPlaceListIndex][selectPlaceIndex].tripCost = Number(tripCost);
    setSelectPlaceList([...selectPlaceList]);
    trip.selectPlaceList = selectPlaceList;
    setTrip({...trip});
    setTripCost(0);
    setOpenCostModal(false);
  }
  //할 일 추가 함수
  const addTodoFunc = ()=>{
    selectPlaceList[selectPlaceListIndex][selectPlaceIndex].tripTodo = tripTodo;
    setSelectPlaceList([...selectPlaceList]);
    trip.selectPlaceList = selectPlaceList;
    setTrip({...trip});
    setTripTodo("")
    setOpenTodoModal(false);
  }
  //비용 추가 모달 close 함수
  const closeCostModalFunc = ()=>{
    setTripCost(0);
    setOpenCostModal(false);
  }
  //할 일 추가 모달 close 함수
  const closeTodoModalFunc = ()=>{
    setTripTodo("");
    setOpenTodoModal(false);
  }

  /***** 지도 *****/
  /* 지도 states */
  const [map, setMap] = useState(null);
  const [mapRoutes, setMapRoutes] = useState([]);
  const [linePath, setLinePath] = useState([]);
  const [polylines, setPolylines] = useState([]);
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
  //맵루트 번호 초기화 함수
  function removeMapRoute(){
    for (let i=0; i<mapRoutes.length; i++) {
      mapRoutes[i].setMap(null);
    }   
    mapRoutes.length = 0;
    setMapRoutes([...mapRoutes]);
  }
  //맵루트 라인 초기화 함수들
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
    for(let i=0; i<myInfoWindows.length; i++) {
      myInfoWindows[i].setMap(null);
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

    //맵루트 초기화
    removeMapRoute();
    removeLinePath();
    removePolyline();
    
    //마커 표시
    if(openSearchWrap){
      removeMarker(markers, setMarkers);
      removeMarker(innMarkers, setInnMarkers);

      placeList.forEach((place, index)=>{
        displayMarker("placeMarker", markers, setMarkers, infoWindows, setInfoWindows, setActivePlaceIndex, place, index);
      })
      const innArr = new Array();
      innList.forEach((inn, index)=>{
        const callback = function(result, status) {
          if(status === kakao.maps.services.Status.OK) {
            inn.placeLat = result[0].y;
            inn.placeLng = result[0].x;
            // const inns = {placeLat: result[0].y, placeLng: result[0].x, placeName: inn.partnerName, placeAddress: inn.innAddr, placePhone: inn.partnerTel};
            innArr[index] = inn;
            displayMarker("innMarker", innMarkers, setInnMarkers, innInfoWindows, setInnInfoWindows, setActiveInnIndex, inn, index);
          }
        };
        geocoder.addressSearch(inn.innAddr, callback);
      })
      setInnInfos(innArr);
    }else{
      //마커, 인포윈도우 초기화
      removeMarker(markers, setMarkers);
      removeMarker(innMarkers, setInnMarkers);
      removeMarker(myMarkers, setMyMarkers);
      removeInfoWindow(infoWindows, setInfoWindows);
      removeInfoWindow(innInfoWindows, setInnInfoWindows);
      removeInfoWindow(myInfoWindows, setMyInfoWindows);
      setActivePlaceIndex(-1);
      setActiveInnIndex(-1);
      setActiveMyPlaceIndex([]);
    }

    //내 장소 마커 표시
    if(selectPlaceList.length !== 0){
      selectPlaceList.forEach((list, index)=>{
        for(let i=0; i<list.length; i++){
          const place = list[i];
          if(place.innAddr){
            const callback = function(result, status) {
              if(status === kakao.maps.services.Status.OK) {
                place.placeLat = result[0].y;
                place.placeLng = result[0].x;
              }
              displayMarker("myMarker", myMarkers, setMyMarkers, myInfoWindows, setMyInfoWindows, setActiveMyPlaceIndex, place, [index, i]);
            };
            geocoder.addressSearch(place.innAddr, callback);
          }else{
            displayMarker("myMarker", myMarkers, setMyMarkers, myInfoWindows, setMyInfoWindows, setActiveMyPlaceIndex, place, [index, i]);
          }
        }
      })
    }
    //내 장소 맵루트 표시
    if(selectPlaceList.length !== 0){
      selectPlaceList.forEach((list, index)=>{
        for(let i=0; i<list.length; i++){
          const place = list[i];
          if(place.innAddr){
            const callback = function(result, status) {
              if(status === kakao.maps.services.Status.OK) {
                place.placeLat = result[0].y;
                place.placeLng = result[0].x;
              }
              displayMapRoute(place, index);
            };
            geocoder.addressSearch(place.innAddr, callback);
          }else{
            displayMapRoute(place, index);
          }
        }
      })
    }

    //** 마커 표시 함수 **//
    function displayMarker(type, markers, setMarkers, infoWindows, setInfoWindows, setActiveIndex, place, index){
      bounds.extend(new kakao.maps.LatLng(place.placeLat, place.placeLng));
  
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.placeLat, place.placeLng),
        zIndex: 30
      });
      markers.push(marker);
      setMarkers([...markers]);

      map.setBounds(bounds);

      let infoWindowYAnchor = 1.4;
      if(type === "myMarker"){
        infoWindowYAnchor = 1.65;
      }
      //마커마다 인포윈도우 생성
      const infoWindow = new kakao.maps.CustomOverlay({
        zIndex: 45,
        yAnchor: infoWindowYAnchor
      });
      infoWindows.push(infoWindow);
      setInfoWindows([...infoWindows]);

      //마커 클릭 시 인포윈도우 표시
      kakao.maps.event.addListener(marker, 'click', function() {
        setActivePlaceIndex(-1);
        setActiveInnIndex(-1);
        setActiveMyPlaceIndex(-1);
        setActiveIndex(index);
        showInfoWindow(infoWindows, infoWindow, place);
      })
    }

    //** 맵루트 표시 함수 **//
    function displayMapRoute(place, index){
      let colorIndex = 0;
      for(let i=0; i<index+1; i++){
        colorIndex = colorIndex+1;
        if(i%4 === 0){
            colorIndex = 1;
        }
      }
      //맵루트 생성
      const mapRoute = new kakao.maps.CustomOverlay({
        map: map,
        position: new kakao.maps.LatLng(place.placeLat, place.placeLng),
        content: "<div class='map_route color"+colorIndex+"'>"+(place.tripRoute)+"</div>",
        yAnchor: 2.8,
        zIndex: 40,
        clickable: true
      });
      mapRoutes.push(mapRoute);
      setMapRoutes([...mapRoutes]);

      //장소에 이을 선 좌표 배열 추가
      linePath.push(new kakao.maps.LatLng(place.placeLat, place.placeLng));

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
    }
  }, [map, openSearchWrap, placeList, innList, selectPlaceList])

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
      // console.log(copySelectPlaceList);

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
    }
  }, [tripStartDate, tripEndDate]);

  /***** tripTitle 변경 *****/
  useEffect(() => {
    if(tripTitle !== ""){
      console.log("❤️tripTitle 변경!!");
      const tripObj = {tripNo, tripTitle};
      console.log(tripObj);
      axios.patch(backServer + "/trip/tripTbl", tripObj)
      .then((res) => {
        if(res.data.message === "success"){
          console.log("❤️tripTitle 변경 완료❤️");
        }
      })
      .catch((res) => {
        console.log(res);
      })
    }
  }, [tripTitle])

  /***** tripDays 변경 *****/
  useEffect(()=>{
    if(tripDays.length !== 0){
      console.log("✅tripDays 변경!!");
      const tripObj = {tripNo: tripNo, tripStartDate: dayjs(tripStartDate).format("YYYY-MM-DD"), tripEndDate: dayjs(tripEndDate).format("YYYY-MM-DD")};
      console.log(tripObj);
      axios.patch(backServer + "/trip/tripTbl", tripObj)
      .then((res)=>{
        if(res.data.message === "success"){
          console.log("✅tripDays 변경 완료✅");
        }
      })
      .catch((res)=>{
        console.log(res);
      })
    }
  }, [tripDays])

  /***** tripDetail 변경 *****/
  useEffect(()=>{
    if(trip.selectPlaceList){
      tripDetailList.length = 0;
  
      for(let i=0; i<trip.selectPlaceList.length; i++){
        for(let j=0; j<trip.selectPlaceList[i].length; j++){
          tripDetailList.push({
            tripDetailNo: trip.selectPlaceList[i][j].tripDetailNo,
            delNo: trip.selectPlaceList[i][j].delNo,
            innNo: trip.selectPlaceList[i][j].innNo,
            placeNo: trip.selectPlaceList[i][j].placeNo,
            tripDay: trip.selectPlaceList[i][j].tripDay,
            oldTripDay: trip.selectPlaceList[i][j].oldTripDay,
            oldTripRoute: trip.selectPlaceList[i][j].oldTripRoute,
            tripRoute: trip.selectPlaceList[i][j].tripRoute,
            tripCost: trip.selectPlaceList[i][j].tripCost,
            tripTodo: trip.selectPlaceList[i][j].tripTodo
          })
        }
      }
      setTripDetailList([...tripDetailList]);
  
      const tripObj = {tripNo: tripNo, tripDetailListStr: JSON.stringify(tripDetailList)};
      console.log("😉tripDetailList 변경!!!!!")
      console.log(tripObj);
      console.log(tripDetailList);
      axios.patch(backServer + "/trip/tripDetailTbl", tripObj)
      .then((res)=>{
        if(res.data.message === "success"){
          console.log("😉tripDetailList 변경 완료😉");
          setModifyTrip({tripDetailList});
          for(let i=0; i<selectPlaceList.length; i++){
            for(let j=0; j<selectPlaceList[i].length; j++){
              if(selectPlaceList[i][j].delNo === 1){
                console.log(selectPlaceList[i][j]);
                selectPlaceList[i].splice(j, 1);
              }
            }
          }
          setSelectPlaceList([...selectPlaceList]);
        }
      })
      .catch((res)=>{
        console.log(res);
      })
    }

  }, [trip])

  return(
    <section className="contents trips">
      <h2 className="hidden">여행 일정 만들기</h2>
      <div className="createTrips_wrap">
        {/* 일정 만들기 영역 */}
        <div className="left_area">
          <div className="trips_wrap">
            <div className="trips_input_wrap">
              <div className="set_title_wrap">
                <Input type="text" disabled={!modifyMode ? true : false} data={tripTitle || tripTitleInput} setData={setTripTitleInput} placeholder="여행 제목을 입력해주세요" blurEvent={setTripTitleFunc} />
              </div>
              <div className="set_date_wrap">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker onChange={(newValue)=>{
                      setTripStartDate(newValue);
                    }} format="YYYY-MM-DD" disablePast value={tripStartDate || dayjs(new Date())} disabled={!modifyMode ? true : false} />
                    <DatePicker onChange={(newValue)=>{
                      setTripEndDate(newValue);
                    }} format="YYYY-MM-DD" disablePast value={tripEndDate || dayjs(new Date())} disabled={!modifyMode ? true : false} />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="trips_plan_wrap" ref={tripsPlanWrap}>
              {
                tripDays.map((day, index)=>{
                  let totalCost = 0;
                  if(selectPlaceList[index]){
                    for(let i=0; i<selectPlaceList[index].length; i++){
                      if(!selectPlaceList[index][i].tripCost){
                        selectPlaceList[index][i].tripCost = 0;
                      }
                      totalCost += Number(selectPlaceList[index][i].tripCost);
                    }
                  }
                  return(
                    <SetDayWrap key={"day"+index} modifyMode={modifyMode} trip={trip} setTrip={setTrip} tripDays={tripDays} tripDate={day} dayIndex={index} setOpenSearchWrap={setOpenSearchWrap} selectPlaceList={selectPlaceList} setSelectPlaceList={setSelectPlaceList} selectPlaceListIndex={selectPlaceListIndex} setSelectPlaceListIndex={setSelectPlaceListIndex} setOpenCostModal={setOpenCostModal} setOpenTodoModal={setOpenTodoModal} setModalTitle={setModalTitle} setSelectPlaceIndex={setSelectPlaceIndex} setTripCost={setTripCost} setTripTodo={setTripTodo} totalCost={totalCost} activeMyPlaceIndex={activeMyPlaceIndex} setActiveMyPlaceIndex={setActiveMyPlaceIndex} setActivePlaceIndex={setActivePlaceIndex} setActiveInnIndex={setActiveInnIndex} showInfoWindow={showInfoWindow} myInfoWindows={myInfoWindows} myPlaceRef={myPlaceRef} activeMyPlaceRef={activeMyPlaceRef} />
                  )
                })
              }
            </div>
            <div className="btn_area">
              <Button text={btnModifyText} class="btn_primary" clickEvent={modifyFunc}/>
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
                                      addPlaceFunc(place, index);
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
                                      addPlaceFunc(inn, index);
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
                        <Pagination pageInfo={innPageInfo} reqPage={innReqPage} setReqPage={setInnReqPage} />
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

      <Modal class="modal lg" open={openTodoModal} closeModal={closeTodoModalFunc} title={modalTitle} useCloseBtn={true}>
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
  const modifyMode = props.modifyMode;
  const trip = props.trip;
  const setTrip = props.setTrip;
  const tripDays = props.tripDays;
  const tripDate = props.tripDate;
  const dayIndex = props.dayIndex;
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
  const totalCost = props.totalCost;
  const activeMyPlaceIndex = props.activeMyPlaceIndex;
  const setActiveMyPlaceIndex = props.setActiveMyPlaceIndex;
  const setActivePlaceIndex = props.setActivePlaceIndex;
  const setActiveInnIndex = props.setActiveInnIndex;
  const showInfoWindow = props.showInfoWindow;
  const myInfoWindows = props.myInfoWindows;
  const myPlaceRef = props.myPlaceRef;
  const activeMyPlaceRef = props.activeMyPlaceRef;

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
  const openCostModalFunc = (place, index)=>{
    if(!modifyMode){
      return;
    }
    setOpenCostModal(true);
    setModalTitle(place.placeName);
    setSelectPlaceListIndex(dayIndex);
    setSelectPlaceIndex(index);
    setTripCost(place.tripCost);
  }
  //할 일 추가 버튼 클릭시
  const openTodoModalFunc = (place, index)=>{
    setOpenTodoModal(true);
    setModalTitle(place.placeName);
    setSelectPlaceListIndex(dayIndex);
    setSelectPlaceIndex(index);
    setTripTodo(place.tripTodo);
  }
  //장소 순서 변경 버튼 클릭시(내리기 버튼)
  const tripRouteDownFunc = (index)=>{
    //dayIndex가 마지막이 아니고, index는 마지막일 때(다음 날로 넘겨야할 때)
    if(dayIndex !== selectPlaceList.length-1 && index === selectPlaceList[dayIndex].length-1){
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex+1];
      //순서 변경으로 영향 받는 아래쪽 모든 아이템들에 oldTripDay 주기
      for(let i=0;i<selectPlaceList[dayIndex+1].length;i++){
        selectPlaceList[dayIndex+1][i].oldTripDay = selectPlaceList[dayIndex+1][i].tripDay;
      }
      selectPlaceList[dayIndex+1].splice(0,0,thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
      trip.selectPlaceList = selectPlaceList;
      setTrip({...trip});
    }//index가 마지막이 아닐 때(해당 날짜 안에서 순서가 내려갈 때)
    else if(index !== selectPlaceList[dayIndex].length-1){
      //순서 변경으로 영향 받는 바로 아래 아이템에 oldTripDay 주기
      selectPlaceList[dayIndex][index+1].oldTripDay = selectPlaceList[dayIndex][index+1].tripDay;
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex];
      selectPlaceList[dayIndex].splice(index+1, 0, thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
      trip.selectPlaceList = selectPlaceList;
      setTrip({...trip});
    }
  }
  //장소 순서 변경 버튼 클릭시(올리기 버튼)
  const tripRouteUpFunc = (index)=>{
    //dayIndex가 첫 번째가 아니고 index는 첫 번째인 경우(이전 날로 넘겨야할 때)
    if(dayIndex !== 0 && index === 0){
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex-1];
      //순서 변경으로 영향 받는 아래쪽 모든 아이템들에 oldTripDay 주기
      for(let i=0;i<selectPlaceList[dayIndex].length;i++){
        selectPlaceList[dayIndex][i].oldTripDay = selectPlaceList[dayIndex][i].tripDay;
      }
      selectPlaceList[dayIndex-1].push(thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
      trip.selectPlaceList = selectPlaceList;
      setTrip({...trip});
    }//index가 첫 번째가 아닐 때(해당 날짜 안에서 순서가 올라갈 때)
    else if(index !== 0){
      //순서 변경으로 영향 받는 바로 위 아이템에 oldTripDay 주기
      selectPlaceList[dayIndex][index-1].oldTripDay = selectPlaceList[dayIndex][index-1].tripDay;
      const thisItem = selectPlaceList[dayIndex].splice(index, 1);
      thisItem[0].oldTripDay = thisItem[0].tripDay;
      thisItem[0].tripDay = tripDays[dayIndex];
      selectPlaceList[dayIndex].splice(index-1, 0, thisItem[0]);
      setSelectPlaceList([...selectPlaceList]);
      trip.selectPlaceList = selectPlaceList;
      setTrip({...trip});
    }
  }
  //장소 삭제 버튼 클릭시
  const deletePlaceFunc = (index)=>{
    setActiveMyPlaceIndex([]);
    const thisItem = selectPlaceList[dayIndex].splice(index, 1);
    thisItem[0].delNo = 1;
    selectPlaceList[dayIndex].push(thisItem[0]);
    setSelectPlaceList([...selectPlaceList]);
    trip.selectPlaceList = selectPlaceList;
    setTrip({...trip});
  }
  //할 일 삭제 버튼 클릭시
  const deleteTodoFunc = (index)=>{
    selectPlaceList[dayIndex][index].tripTodo = "";
    setSelectPlaceList([...selectPlaceList]);
    trip.selectPlaceList = selectPlaceList;
    setTrip({...trip});
  }
  //내 장소 클릭 시 함수
  const clickPlaceFunc = (place, index)=>{
    setActiveMyPlaceIndex([dayIndex, index]);
    setActivePlaceIndex(-1);
    setActiveInnIndex(-1);
    showInfoWindow(myInfoWindows, myInfoWindows[index], place);
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
                  <li key={"select_place"+dayIndex+"-"+index} className={activeMyPlaceIndex[0] === dayIndex && activeMyPlaceIndex[1] === index ? "item active" : "item"} ref={activeMyPlaceIndex[0] === dayIndex && activeMyPlaceIndex[1] === index ? activeMyPlaceRef : myPlaceRef} onClick={()=>{clickPlaceFunc(place, index)}}>
                    <div className="tripPlace">
                      <div className={"tripRoute_no color"+colorIndex}>{index+1}</div>
                      <div className="item_box">
                        <div className="item_box_content">
                          <div className="place_name">{place.placeName ? place.placeName : place.partnerName}</div>
                          <div className="place_info">
                            <span>{place.placeCategory ? place.placeCategory : place.innTypeStr}</span>
                            <span>{place.placeAddress ? place.placeAddress : place.innAddr}</span>
                          </div>
                          {
                            place.tripCost !== 0 ? (
                              <div className={!modifyMode ? "trip_cost disabled" : "trip_cost"} onClick={()=>{openCostModalFunc(place, index)}}>{place.tripCost}</div>
                            ) : ""
                          }
                        </div>
                        <div className="item_btn_wrap">
                          {
                            dayIndex === selectPlaceList.length-1 && index === selectPlaceList[dayIndex].length-1 ? "" : (
                              <button type="button" disabled={!modifyMode ? true : false} className="btn_changeOrder down" onClick={()=>{tripRouteDownFunc(index)}}><span className="hidden">내리기</span></button>
                            )
                          }
                          {
                            dayIndex === 0 && index === 0 ? "" : (
                              <button type="button" disabled={!modifyMode ? true : false} className="btn_changeOrder up" onClick={()=>{tripRouteUpFunc(index)}}><span className="hidden">올리기</span></button>
                            )
                          }
                        </div>
                        
                        {
                          place.tripCost && place.tripTodo ? "" : (
                            <div className="btn_area">
                              {!place.tripCost ? (
                                <button type="button" disabled={!modifyMode ? true : false} className="btn_tripCost" onClick={()=>{openCostModalFunc(place, index)}}><i></i><span>비용 추가</span></button>
                              ) : ""}
                              {!place.tripTodo ? (
                                <button type="button" disabled={!modifyMode ? true : false} className="btn_tripTodo" onClick={()=>{openTodoModalFunc(place, index)}}><i></i><span>할 일 추가</span></button>
                              ) : ""}
                            </div>
                          )
                        }
                        <button type="button" disabled={!modifyMode ? true : false} className="btn_delete" onClick={()=>{deletePlaceFunc(index)}}><span className="hidden">삭제</span></button>
                      </div>
                    </div>
                    {place.tripTodo ? (
                      <div className="tripTodo">
                        <div className={"tripRoute_no color"+colorIndex}></div>
                        <div className="item_box">
                          <div className="item_box_content" onClick={()=>{if(modifyMode){openTodoModalFunc(place, index)}}}>{place.tripTodo}</div>
                          <button type="button" disabled={!modifyMode ? true : false} className="btn_delete" onClick={()=>{deletePlaceFunc(index)}}><span className="hidden">삭제</span></button>
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
          <Button text="장소 추가" disabled={!modifyMode ? true : false} class={dayIndex === selectPlaceListIndex ? "btn_secondary md btn_openSearch active" : "btn_secondary md btn_openSearch"} clickEvent={openSearchWrapFunc} />
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

export default ModifyTrips;
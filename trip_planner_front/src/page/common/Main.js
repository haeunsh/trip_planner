import { Input } from "../../component/FormFrm";
import "./main.css";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Main = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [detailPlace, setDetailPlace] = useState("-");
  const [detailPeople, setDetailPeople] = useState("-");
  const [detailCheckIn, setDetailCheckIn] = useState();
  const [detailCheckOut, setDetailCheckOut] = useState();
  const [calcCount, setCalcCount] = useState();
  // const [searchObj, setSearchObj] = useState({});
  const mainHero = useRef();
  const heroInner = useRef();
  const [blogList, setBlogList] = useState([]);
  const [innList, setInnList] = useState([]);
  const [promotionList, setPromotionList] = useState([]);

  //티켓 마우스모션
  const ticketMoveFunc = (e) => {
    let heroWidth = mainHero.current.offsetWidth;
    let heroHeight = mainHero.current.offsetHeight;
    let mouseXpos = e.nativeEvent.offsetX;
    let mouseYpos = e.nativeEvent.offsetY;
    let YrotateDeg = (heroWidth / 2 - mouseXpos) * 0.003;
    let XrotateDeg = (heroHeight / 2 - mouseYpos) * -0.003;
    heroInner.current.style.transform = "rotateX("+XrotateDeg+"deg) rotateY("+YrotateDeg+"deg)"
  }

  const setDetailPlaceFunc = () => {
    setDetailPlace(searchInput);
  }
  const setDetailPeopleFunc = () => {
    setDetailPeople(numberInput);
  }

  //메인 숙소검색하는 티켓
  useEffect(() => {
    let calc = 0;
    if(detailCheckIn && detailCheckOut){
      if(new Date(detailCheckOut) >= new Date(detailCheckIn)){
        calc = (new Date(detailCheckOut) - new Date(detailCheckIn))/(1000*60*60*24);
      }
    }
    setCalcCount(calc);
    setDetailCheckIn(dayjs(detailCheckIn).format("YYYY-MM-DD"));
    setDetailCheckOut(dayjs(detailCheckOut).format("YYYY-MM-DD"));
  }, [detailCheckIn, detailCheckOut])

  const goToInnListFunc = () => {
    const searchObj = {detailPlace, detailPeople, detailCheckIn, detailCheckOut};
    console.log(searchObj);
    navigate("/innList", {state: searchObj});
  }

  //프로모션 리스트 호출(별점 높은 순)
  useEffect(() => {
    axios.get(backServer + "/promotion/main/promotionList")
    .then((res) => {
      console.log(res.data.data);
      if(res.data.message === "success"){
        setPromotionList([...res.data.data]);
      }
    })
    .catch((res) => {
      console.log(res);
    })
  }, [])

  //블로그 리스트 호출
  useEffect(() => {
    axios.get(backServer + "/blog/main/blogList")
    .then((res) => {
      console.log(res.data.data);
      if(res.data.message === "success"){
        setBlogList([...res.data.data]);
      }
    })
    .catch((res) => {
      console.log(res);
    })
  }, [])

  //숙소 리스트 호출(별점 높은 순)
  useEffect(() => {
    axios.get(backServer + "/inn/main/innList")
    .then((res) => {
      console.log(res.data.data);
      if(res.data.message === "success"){
        setInnList([...res.data.data]);
      }
    })
    .catch((res) => {
      console.log(res);
    })
  }, [])

  return (
    <>
      <section className="contents main_hero" ref={mainHero} onMouseMove={ticketMoveFunc}>
        <div className="hero_inner" ref={heroInner}>
          <div className="hero_ticket">
            <div className="search_area">
              <div className="sa_header">
                <div className="dots"></div>
              </div>
              <div className="search_wrap">
                <div className="input_area">
                  <div className="input_wrap">
                    <div className="input_title">
                      <label htmlFor="tripPlaceInput">가는 곳</label>
                    </div>
                    <div className="input_item">
                      <Input type="text" blurEvent={setDetailPlaceFunc} content="tripPlaceInput" data={searchInput} setData={setSearchInput} placeholder="여행지나 숙소를 검색해보세요" />
                    </div>
                  </div>
                  <div className="input_wrap">
                    <div className="input_title">
                      <label htmlFor="tripNumberInput">인원 수</label>
                    </div>
                    <div className="input_item">
                      <Input type="number" blurEvent={setDetailPeopleFunc} content="tripNumberInput" data={numberInput} setData={setNumberInput} placeholder="인원" />
                    </div>
                  </div>
                </div>
                <div className="calendar_area">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <div className="calendar_title">check-in</div>
                      <DatePicker onChange={(newValue)=>{
                        setDetailCheckIn(newValue);
                      }} format="YYYY-MM-DD" disablePast />
                      <div className="calendar_title">check-out</div>
                      <DatePicker onChange={(newValue)=>{
                        setDetailCheckOut(newValue)
                      }} format="YYYY-MM-DD" disablePast />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <div className="dots"></div>
              </div>
            </div>
            <div className="details_area">
              <div className="da_header">
                <span className="trip_planner">TRIP PLANNER</span>
                <div className="dots"></div>
              </div>
              <div className="search_detail_wrap">
                <div className="detail_box">
                  <div className="detail_item">
                    <div className="category"><i className="icon_place"></i>장소</div>
                    <div className="name">{detailPlace}</div>
                  </div>
                  <div className="detail_item">
                    <div className="category"><i className="icon_people"></i>인원</div>
                    <div className="name">{detailPeople}</div>
                  </div>
                  <div className="detail_item">
                    <div className="category"><i className="icon_calendar"></i>날짜</div>
                    <div className="name">{dayjs(detailCheckIn).format("MM/DD")} - {dayjs(detailCheckOut).format("MM/DD")} ({calcCount}박)</div>
                  </div>
                </div>
                <div className="btn_area">
                  <button type="button" className="btn_main_search" onClick={goToInnListFunc}>해당 조건으로 검색하기</button>
                </div>
                <div className="dots"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="contents main_promotion">
        <h3 className="hidden">프로모션</h3>
        <div className="slide_area">
          <Swiper
            className="promotion_slide"
            navigation={true}
            pagination={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            loop={true}
            speed={600}
          >
            {promotionList.map((promotion, i) => {
              return(
                <SwiperSlide key={"promotion"+i}>
                  <Link to={"/promotionView/"+promotion.promotionNO}>
                    <img src={backServer + "/promotion/promotionThumbnail/" + promotion.promotionImg} />
                    <div className="promotion_info">
                      <div className="promotionRegion">{promotion.promotionRegion}</div>
                      <div className="promotionIntro">{promotion.promotionIntro}</div>
                      <div className="promotionName">{promotion.promotionName}</div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </section> */}

      <section className="contents main_blogs">
        <h3>인기 블로그</h3>
        <div className="slide_area">
          <Swiper
            className="blogs_slide"
            navigation={true}
            pagination={true}
            // autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={4}
            slidesPerGroup={4}
            spaceBetween={20}
            // loop={true}
            speed={600}
          >
            {blogList.map((blog, i) => {
              return(
                <SwiperSlide key={"blog"+i}>
                  <Link to={"/blogView/"+blog.blogNo}>
                    <img src={backServer + "/blog/blogThumbnail/" + blog.blogThumbnail} />
                    <div className="blog_info">
                      <div className="blogTitle">{blog.blogTitle}</div>
                      <div className="blogDate">{blog.blogDate}</div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </section>

      <section className="contents main_inns">
        <h3>추천 숙소</h3>
        <div className="slide_area">
          <Swiper
            className="inns_slide"
            navigation={true}
            pagination={true}
            // autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={4}
            slidesPerGroup={4}
            spaceBetween={20}
            // loop={true}
            speed={600}
          >
            {innList.map((inn, i) => {
              return(
                <SwiperSlide key={"inn"+i}>
                  <Link to={"/innDetailView/"+inn.innNo}>
                    <img src={backServer + "/inn/innFileList/" + inn.filepath} />
                    <div className="inn_info">
                      <div className="innType">{inn.innType === 1 ? '호텔' : inn.innType === 2 ? '리조트' : inn.innType === 3 ? '펜션' : '게스트하우스'}</div>
                      <div className="partnerName">{inn.partnerName}</div>
                      <div className="reviewRate">{Math.round(inn.reviewRate*10)*0.1}</div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default Main;

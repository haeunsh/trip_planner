import "./page/common/reset.css";
import "./page/common/common.css";
import InnList from "./page/INN/InnList";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./page/member/Login";
import Main from "./page/common/Main";
import BlogList from "./page/blog/BlogList";
import TourList from "./page/tour/TourList";
import Ref from "./Ref";
import Header from "./page/common/Header";
import Footer from "./page/common/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import MypageMain from "./page/mypage/MypageMain";
import Join from "./page/member/Join";
import BlogWrite from "./page/blog/BlogWrite";
import TourSearch from "./page/tour/TourSearch";
import TourType from "./page/tour/TourType";
import InnReg from "./page/INN/InnReg";
import TourReg from "./page/tour/TourReg";
import PromotionList from "./page/promotion/PromotionList";
import ConsultTalk from "./page/member/ConsultTalk";
import RoomReg from "./page/INN/RoomReg";
import License from "./page/member/License";
import BusinessAuth from "./page/member/BusinessAuth";
import BlogMain from "./page/blog/blogMain";
import ReservationInn from "./page/INN/ReservationInn";
import BlogView from "./page/blog/BlogView";
import InnDetailView from "./page/INN/InnDetailView";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModifyTrips from "./page/mypage/ModifyTrips";
import NoticeMain from "./page/notice/NoticeMain";
import TourView from "./page/tour/TourView";
import MemberMgmt from "./page/admin/MemberMgmt";
import PromotionMain from "./page/promotion/PromotionMain";
import TourBook from "./page/tour/TourBook";
import CreateTrips from "./page/mypage/CreateTrips";
import { CreateTrips_backup } from "./page/mypage/CreateTrips_backup";
function App() {
  //스토리지에 저장된 데이터를 꺼내서 객체형식으로 변환
  const navigate = useNavigate();
  const obj = JSON.parse(window.localStorage.getItem("member"));
  const [isLogin, setIsLogin] = useState(obj ? true : false); //로그인상태를 체크하는 state, obj가 있으면 로그인 true/없으면 false
  const [token, setToken] = useState(obj ? obj.accessToken : ""); //토큰값
  const [expiredTime, setExpiredTime] = useState(
    obj ? new Date(obj.tokenExpired) : ""
  ); //만료시간

  if (obj) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  const login = (accessToken) => {
    //로그인 성공 시 받은 accessToken을 token state에 저장
    setToken(accessToken);
    //로그인 성공한 순간을 기준으로 60분 뒤에 만료 설정 -> 그데이터를 저장
    const tokenExpired = new Date(new Date().getTime() + 60 * 60 * 1000);
    setExpiredTime(tokenExpired);
    //토큰이랑, 만료시간을 객체로 묶은 후 문자열로 변환해서 localStorage에 저장
    const obj = { accessToken, tokenExpired: tokenExpired.toISOString() };
    //localStorage에는 문자열만 저장이 가능하므로 묶은 객체도 문자열로 변환
    const member = JSON.stringify(obj);
    //로컬스토리지에 데이터 저장(access token과 만료시간 뭉쳐서 저장)
    window.localStorage.setItem("member", member);
    //axios헤더에 토큰값 자동설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    setIsLogin(true);

    const remainingTime = tokenExpired.getTime() - new Date().getTime();
    setTimeout(logout, remainingTime);
  };
  const logout = () => {
    //로그인할때 변경한 사항을 모두 원래대로 복원
    setToken("");
    setExpiredTime("");
    window.localStorage.removeItem("member");
    axios.defaults.headers.common["Authorization"] = null;
    setIsLogin(false);
    Swal.fire({
      title: "로그아웃",
      icon: "success",
    });
    navigate("/");
  };
  //페이지가 로드되면,새로고침되면
  useEffect(() => {
    if (isLogin) {
      //로그인이 되어있으면
      //저장해 둔 만료시간을 꺼내서 현재시간과 비교한 후 종료함수 설정
      const remainingTime = expiredTime.getTime() - new Date().getTime();
      setTimeout(logout, remainingTime);
    }
  }, []);

  return (
    <div className="wrap">
      <Header isLogin={isLogin} logout={logout} />
      <main className="container">
        <Routes>
          {/* 메인이니까 첫 번째 자리에 둘게요 */}
          <Route path="/" element={<Main />} />
          <Route
            path="/innDetailView/:innNo"
            element={<InnDetailView isLogin={isLogin} />}
          />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/join" element={<Join />} />
          <Route path="/innList" element={<InnList isLogin={isLogin} />} />
          <Route path="/innReg" element={<InnReg isLogin={isLogin} />} />
          <Route path="/roomReg" element={<RoomReg />} />
          <Route path="/blogList" element={<BlogList isLogin={isLogin} />} />
          <Route
            path="/blogView/:blogNo"
            element={<BlogView isLogin={isLogin} />}
          />
          <Route path="/tourList" element={<TourList isLogin={isLogin} />} />
          <Route
            path="/tourSearch"
            element={<TourSearch isLogin={isLogin} />}
          />
          <Route path="/tourType" element={<TourType isLogin={isLogin} />} />
          <Route
            path="/tour/view/:tourNo"
            element={<TourView isLogin={isLogin} />}
          />
          <Route
            path="/tour/book/:tourNo"
            element={isLogin ? <TourBook isLogin={isLogin} /> : ""}
          />

          <Route path="/ref" element={<Ref />} />
          <Route
            path="/mypage/*"
            element={<MypageMain isLogin={isLogin} logout={logout} />}
          />
          <Route path="/promotionList" element={<PromotionList />} />
          <Route path="/blogWrite" element={<BlogWrite isLogin={isLogin} />} />
          <Route path="/consult" element={<ConsultTalk />} />
          <Route path="/license" element={<License />} />
          <Route
            path="/businessAuth"
            element={<BusinessAuth isLogin={isLogin} />}
          />
          <Route path="/inn/reservationInn" element={<ReservationInn />} />
          <Route
            path="/mypage/myTrips/createTrips"
            element={<CreateTrips isLogin={isLogin} />}
          />
          <Route
            path="/mypage/myTrips/createTrips_backup"
            element={<CreateTrips_backup isLogin={isLogin} />}
          />
          <Route
            path="/mypage/myTrips/modifyTrips/:tripNo"
            element={<ModifyTrips isLogin={isLogin} />}
          />
          <Route path="/notice/*" element={<NoticeMain isLogin={isLogin} />} />
          <Route
            path="/promotion/*"
            element={<PromotionMain isLogin={isLogin} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

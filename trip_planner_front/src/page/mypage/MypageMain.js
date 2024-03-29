import { useEffect, useState } from "react";
import MypageSideMenu from "./MypageSideMenu";
import "./mypage.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import MyTrips from "./MyTrips";
import MyBooks from "./MyBooks";
import MyCoupons from "./MyCoupons";
import MyLikes from "./MyLikes";
import MyReviews from "./MyReviews";
import MyInfo from "./MyInfo";
import axios from "axios";
import Swal from "sweetalert2";

const MypageMain = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  const logout = props.logout;
  const [member, setMember] = useState("");
  const navigate = useNavigate();

  // if (!isLogin) {
  //   Swal.fire({
  //     icon: "warning",
  //     text: "로그인 후 이용이 가능합니다.",
  //     confirmButtonText: "닫기",
  //   }).then(
  //     navigate("/")
  //   );
  // }

  useEffect(() => {
    axios
      .get(backServer + "/member")
      .then((res) => {
        console.log(res.data.data);
        setMember(res.data.data);
        if (res.data.data.memberType === 3) {
          //관리자로 로그인 시
          setMenus([
            { url: "memberMgmt", text: "회원 관리", active: true },
            { url: "partnerMgmt", text: "업체 관리", active: false },
            { url: "promotionMgmt", text: "프로모션 관리", active: false },
            { url: "couponReg", text: "쿠폰 등록", active: false },
          ]);
          navigate("/mypage/memberMgmt");
        } else if (res.data.data.memberType === 2) {
          //업체로 로그인 시
          axios
            .get(backServer + "/partner/" + res.data.data.memberNo)
            .then((res2) => {
              console.log(res2.data);
              if (res2.data.data !== null && res2.data.data.partnerType === 1) {
                //숙소
                setMenus([
                  { url: "innReg", text: "숙소 등록", active: true },
                  { url: "roomReg", text: "방 등록", active: false },
                  { url: "innMgmt", text: "숙소 관리", active: false },
                  { url: "bookMgmt", text: "예약 관리", active: false },
                ]);
                navigate("/mypage/innReg");
              } else if (
                res2.data.data !== null &&
                res2.data.data.partnerType === 2
              ) {
                //투어
                setMenus([
                  { url: "tour/mgmt", text: "투어 예약관리", active: true },
                  { url: "tour/reg", text: "투어 상품등록", active: false },
                  { url: "tour/sale", text: "투어 상품조회", active: false },
                ]);
                navigate("/mypage/tour/mgmt");
              }
              //업체인데 등록한 업체가 없을 경우
              setMenus([{ url: "myInfo", text: "내 정보 수정", active: true }]);
              navigate("/mypage/myInfo");
            })
            .catch((res2) => {
              console.log(res2);
            });
        } else {
          //회원으로 로그인 시
          navigate("/mypage/myBooks");
        }
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);

  const [menus, setMenus] = useState([
    { url: "myBooks", text: "내 예약", active: true },
    { url: "myTrips", text: "내 여행", active: false },
    { url: "myCoupons", text: "쿠폰함", active: false },
    { url: "myLikes", text: "찜 리스트", active: false },
    { url: "myReviews", text: "내 리뷰 보기", active: false },
    { url: "myInfo", text: "내 정보 수정", active: false },
  ]);

  return (
    <section className="contents mypage">
      <div className="side_wrap">
        <h2>마이페이지</h2>
        <MypageSideMenu menus={menus} setMenus={setMenus} />
      </div>
      <div className="content_wrap">
        <Routes>
          <Route path="/myBooks" element={<MyBooks />} />
          <Route path="/myTrips" element={<MyTrips />} />
          <Route path="/myCoupons" element={<MyCoupons />} />
          <Route path="/myLikes" element={<MyLikes />} />
          <Route path="/myReviews" element={<MyReviews />} />
          <Route path="/myInfo" element={<MyInfo />} />
        </Routes>
      </div>
    </section>
  );
};

export default MypageMain;
import { useState } from "react";
import "./myTour.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TourFrm from "./TourFrm";

const TourReg = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  // 이름,유형,주소,판매수량,판매기간 -> 사용자에게 받아야하는 정보 -> state생성(데이터 전송용)
  const [tourName, setTourName] = useState("");
  const [tourType, setTourType] = useState("");
  const [tourAddr, setTourAddr] = useState("");
  const [salesCount, setSalesCount] = useState("");
  const [salesPeriod, setSalesPeriod] = useState("");
  // 사용자 화면 출력용 state(화면 전송시 사용하지 않음)
  const [tourImg, setTourImg] = useState(null);
  const [tourIntro, setTourIntro] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [intronail, setIntronail] = useState(null);

  const reg = () => {
    // console.log(tourName);
    // console.log(tourType);
    // console.log(tourAddr);
    // console.log(thumbnail);
    // console.log(intronail);
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (tourName !== "" && tourType !== "" && tourAddr !== "") {
      if (tourName.length > 16) {
        Swal.fire({
          title: "상품 이름은 16자 이하로 작성해주세요 (한글 기준)",
          icon: "warning",
        });
        return;
      } else if (salesCount !== "" && isNaN(salesCount)) {
        Swal.fire({
          title: "판매 수량은 숫자로 입력해주세요.",
          icon: "warning",
        });
        return;
      } else if (salesPeriod !== "" && !datePattern.test(salesPeriod)) {
        Swal.fire({
          title: "판매 기간은 2024-12-31 형식으로 입력해주세요.",
          icon: "warning",
        });
        return;
      }

      // 전송용 form객체 생성
      const form = new FormData();
      form.append("tourName", tourName);
      form.append("tourType", tourType);
      form.append("tourAddr", tourAddr);
      form.append("salesCount", salesCount === "" ? 999999 : salesCount);
      form.append(
        "salesPeriod",
        salesPeriod === "" ? "2099-01-01" : salesPeriod
      );
      // 섬네일은 첨부한 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      if (intronail !== null) {
        form.append("intronail", intronail);
      }

      axios
        .post(backServer + "/tour/reg", form, {
          headers: {
            contentType: "multipart/form-data",
            processData: false,
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            const tourNo = res.data.data; // 등록한 투어의 tourNo를 서버 응답에서 받아옴
            Swal.fire("이용권 등록을 위해 이용권 등록 페이지로 이동합니다.");
            navigate("/mypage/tour/ticket/" + tourNo);
          } else {
            Swal.fire("입력값을 다시 확인해주세요.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      Swal.fire("필수 입력 항목입니다.");
    }
  };

  return (
    <section className="contents">
      <div className="tour-reg-wrap">
        <div className="tour-reg-title">
          <h2>투어 상품 등록</h2>
        </div>
        <TourFrm
          tourName={tourName}
          setTourName={setTourName}
          tourType={tourType}
          setTourType={setTourType}
          tourAddr={tourAddr}
          setTourAddr={setTourAddr}
          salesCount={salesCount}
          setSalesCount={setSalesCount}
          salesPeriod={salesPeriod}
          setSalesPeriod={setSalesPeriod}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          intronail={intronail}
          setIntronail={setIntronail}
          tourImg={tourImg}
          setTourImg={setTourImg}
          tourIntro={tourIntro}
          setTourIntro={setTourIntro}
          buttonFunction={reg}
          type="reg"
        />
      </div>
    </section>
  );
};

export default TourReg;

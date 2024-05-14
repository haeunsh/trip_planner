import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../component/FormFrm";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

const MyCoupons = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [reqPage, setReqPage] = useState(1);
  const [myCouponList, setMyCouponList] = useState([]);
  const [btnMoreShow, setBtnMoreShow] = useState(false);
  const [selectOptions, setSelectOptions] = useState([{value: 0, text: "전체"}, {value: 1, text: "숙소"}, {value: 2, text: "투어"}, {value: 3, text: "프로모션"}, {value: 4, text: "종합"}]);
  const [selectData, setSelectData] = useState(0);
  const changeSelectData = (e) => {
    setSelectData(e.target.value);
    myCouponList.length = 0;
    setMyCouponList([...myCouponList]);
  };

  // 내 쿠폰 리스트 불러오기
  useEffect(() => {
    const optionObj = {couponRange: selectData};
    axios
      .post(backServer + "/mypage/myCouponList/" + reqPage, optionObj)
      .then((res) => {
        console.log(res.data.data);
        if(res.data.message === "success"){
          myCouponList.push(...res.data.data);
          setMyCouponList([...myCouponList]);
          if(res.data.data.length < 5){
            setBtnMoreShow(false);
          }else{
            setBtnMoreShow(true);
          }
        }
      })
      .catch((res) => {
        console.log(res);
      })
  }, [reqPage, selectData]);

  useEffect(() => {
    myCouponList.length = 0;
    setMyCouponList([...myCouponList]);
    setReqPage(1);
  }, [selectData]);

  return(
    <div className="myCoupons_wrap">
      <div className="title_area">
        <h3>내 쿠폰함</h3>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select value={selectData} onChange={changeSelectData} inputProps={{MenuProps: {disableScrollLock: true}}} >
            {
              selectOptions.map((item, i) => {
                return <MenuItem key={"option"+i} value={item.value}>{item.text}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        {/* <Select options={selectOptions} data={selectData} setData={setSelectData} /> */}
      </div>
      <div className="myCoupons_content">
        <ul className="myCoupons_list">
          {myCouponList.map((item, i) => {
            console.log(item);
            return(
              <MyCouponsListItem key={"myCoupons"+i} item={item}  />
            );
          })}
        </ul>
        {
          btnMoreShow ? (
            <div className="btn_area">
              <Button class="btn_primary outline" text="더보기" clickEvent={() => {setReqPage(reqPage+1)}} />
            </div>
          ) : ""
        }
      </div>
    </div>
  );
}

// 쿠폰 리스트 아이템
const MyCouponsListItem = (props) => {
  const item = props.item;
  console.log(item.couponStatusStr);
  
  function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return(
    <li>
      <div className={item.couponStatusStr === "사용완료" ? "couponItem completed" : item.couponStatusStr === "사용불가" || new Date(item.expiredDate).toLocaleDateString("ko-KR") < new Date().toLocaleDateString("ko-KR") ? "couponItem disabled" : "couponItem"}>
        <div className="coupon_info">
          <div className="inner">
            <div className="item_top_wrap">
              {
                item.couponRangeStr === "숙소" ? (
                  <span className="badge type1">{item.couponRangeStr}</span>
                )
                : item.couponRangeStr === "투어" ? (
                  <span className="badge type2">{item.couponRangeStr}</span>
                )
                : item.couponRangeStr === "프로모션" ? (
                  <span className="badge type3">{item.couponRangeStr}</span>
                )
                : (
                  <span className="badge type4">{item.couponRangeStr}</span>
                )
              }
              
              <div className="couponNo">COUPON NO. {item.couponNo}</div>
            </div>
            <div className="item_name">{item.couponName}</div>
            <div className="item_details">
              {
                item.discountRate === 0 ? (
                  <div className="discount">{priceToString(item.discountAmount)}<span>원</span></div>
                ) : (
                  <div className="discount">{item.discountRate}<span>%</span></div>
                )
              }
              <div className="expiredDate">~ {item.expiredDate}까지</div>
            </div>
          </div>
        </div>
          {
            item.couponStatusStr === "사용가능" ? (
              <div className="coupon_status">
                <div className="inner">
                  <span className="status">
                  {
                    new Date(item.expiredDate).toLocaleDateString("ko-KR") < new Date().toLocaleDateString("ko-KR") ? (
                      <span className="status">기간 만료</span>
                    ) : "사용가능"
                  }
                  </span>
                </div>
              </div>
            ) : item.couponStatusStr === "사용불가" ? (
              <div className="coupon_status">
                <div className="inner">
                  <span className="status">{item.couponStatusStr}</span>
                  {
                    new Date(item.expiredDate).toLocaleDateString("ko-KR") < new Date().toLocaleDateString("ko-KR") ? (
                      <span className="status">기간 만료</span>
                    ) : ""
                  }
                </div>
              </div>
            ) : item.couponStatusStr === "사용완료" ? (
              <div className="coupon_status">
                <div className="inner">
                  <span className="status">{item.couponStatusStr}</span>
                </div>
              </div>
            ) : ""
          }
      </div>
    </li>
  )
}

export default MyCoupons;
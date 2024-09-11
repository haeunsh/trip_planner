import "./myTrips.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../../component/FormFrm";
import Swal from "sweetalert2";
import Modal from "../../component/Modal";

const MyTrips = ()=>{
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [comingTripReqPage, setComingTripReqPage] = useState(1);
  const [pastTripReqPage, setPastTripReqPage] = useState(1);
  const [myBlogReqPage, setMyBlogReqPage] = useState(1);
  const [comingTripList, setComingTripList] = useState([]);
  const [pastTripList, setPastTripList] = useState([]);
  const [myBlogList, setMyBlogList] = useState([]);
  const [btnMoreShow1, setBtnMoreShow1] = useState(true);
  const [btnMoreShow2, setBtnMoreShow2] = useState(true);
  const [btnMoreShow3, setBtnMoreShow3] = useState(true);
  const [openShareTripModal, setOpenShareTripModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [tabs, setTabs] = useState([
    { tabName: "다가오는 여행", active: true },
    { tabName: "지난 여행", active: false },
    { tabName: "내 여행기", active: false },
  ]);
  const tabClickFunc = (index)=>{
    tabs.forEach((item)=>{
      item.active = false;
    })
    tabs[index].active = true;
    setTabs([...tabs]);
  }

  // 다가오는 여행 리스트 조회
  useEffect(()=>{
    axios
      .get(backServer + "/trip/comingList/" + comingTripReqPage)
      .then((res)=>{
        console.log(res.data.data);

        comingTripList.push(...res.data.data);
        setComingTripList([...comingTripList]);

        if(res.data.data.length < 5){
          setBtnMoreShow1(false);
        }
      })
      .catch((res)=>{
        console.log(res);
      })
  }, [comingTripReqPage]);

  // 지난 여행 리스트 조회
  useEffect(()=>{
    axios
      .get(backServer + "/trip/pastList/" + pastTripReqPage)
      .then((res)=>{
        console.log(res.data.data);

        pastTripList.push(...res.data.data);
        setPastTripList([...pastTripList]);

        if(res.data.data.length < 5){
          setBtnMoreShow2(false);
        }
      })
      .catch((res)=>{
        console.log(res);
      })
  }, [pastTripReqPage]);

  // 내 블로그 리스트 조회
  useEffect(()=>{
    axios
      .get(backServer + "/blog/myBlogList/" + myBlogReqPage)
      .then((res)=>{
        console.log(res.data.data);

        myBlogList.push(...res.data.data);
        setMyBlogList([...myBlogList]);

        if(res.data.data.length < 6){
          setBtnMoreShow3(false);
        }
      })
      .catch((res)=>{
        console.log(res);
      })
  }, [myBlogReqPage]);

  const closeShareTripModalFunc = ()=>{
    setUserEmail("");
    setOpenShareTripModal(false);
  }

  const addUserIdFunc = ()=>{

  }

  return(
    <>
      <div className="myTrips_wrap">
        <h3 className="hidden">내 여행</h3>
        <div className="myTrips_tab">
          <div className="tab_btns">
            {tabs.map((tab, index)=>{
              return(
                <button key={"tab" + index} type="button" className={tab.active === true ? "tab_btn active" : "tab_btn"} onClick={()=>{tabClickFunc(index)}}>{tab.tabName}</button>
              );
            })}
          </div>
          <div className="tab_contents">
            {tabs.map((tab, index)=>{
              return(
                <div key={"tab" + index} className={tab.active === true ? "tab_content active" : "tab_content"}>
                  {
                    tab.active === true ? (
                      tab.tabName === "다가오는 여행" ? (
                        <>
                          <Link to="/mypage/myTrips/createTrips" className="creatTrips_btn">
                            <i className="icon_plus"></i>
                            <div className="text">
                              <strong>여행 일정 만들기</strong>
                              <span>새로운 여행을 떠나보세요!</span>
                            </div>
                          </Link>

                          <h4>내가 만든 여행</h4>
                          <ul className="myTrips_list">
                            {comingTripList.map((item, i)=>{
                              return(
                                <TripListItem key={"myTrips"+i} item={item} itemType="coming" backServer={backServer} thisIndex={i} comingTripList={comingTripList} setComingTripList={setComingTripList} setOpenShareTripModal={setOpenShareTripModal} />
                              );
                            })}
                          </ul>
                          {
                            btnMoreShow1 ? (
                              <div className="btn_area">
                                <Button class="btn_primary outline" text="더보기" clickEvent={()=>{setComingTripReqPage(comingTripReqPage+1)}} />
                              </div>
                            ) : ""
                          }
                        </>
                      ) : tab.tabName === "지난 여행" ? (
                        <>
                          <ul className="myTrips_list">
                            {pastTripList.map((item, i)=>{
                              return(
                                <TripListItem key={"myTrips"+i} item={item} itemType="past" backServer={backServer} thisIndex={i} pastTripList={pastTripList} setPastTripList={setPastTripList} />
                              );
                            })}
                          </ul>
                          {
                            btnMoreShow2 ? (
                              <div className="btn_area">
                                <Button class="btn_primary outline" text="더보기" clickEvent={()=>{setPastTripReqPage(pastTripReqPage+1)}} />
                              </div>
                            ) : ""
                          }
                        </>
                      ) : (
                        <>
                          <ul className="myBlogs_list">
                            {myBlogList.map((item, i)=>{
                              return(
                                <BlogItem key={"myBlog"+i} item={item} backServer={backServer} />
                              )
                            })}
                          </ul>
                          {
                            btnMoreShow3 ? (
                              <div className="btn_area">
                                <Button class="btn_primary outline" text="더보기" clickEvent={()=>{setMyBlogReqPage(myBlogReqPage+1)}} />
                              </div>
                            ) : ""
                          }
                        </>
                      )
                    ) : ""
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal class="modal" open={openShareTripModal} closeModal={closeShareTripModalFunc} title="여행일정 공유하기" useCloseBtn={true}>
        <Input type="text" data={userEmail} setData={setUserEmail} placeholder="일정을 공유할 이용자의 이메일 주소를 입력해주세요" />

        <div className="btn_area">
          <Button class="btn_primary" text="확인" clickEvent={addUserIdFunc} />
        </div>
      </Modal>
    </>
  );
}

const TripListItem = (props)=>{
  const item = props.item;
  const itemType = props.itemType;
  const thisIndex = props.thisIndex;
  const comingTripList = props.comingTripList;
  const setComingTripList = props.setComingTripList;
  const pastTripList = props.pastTripList;
  const setPastTripList = props.setPastTripList;
  const [openMenu, setOpenMenu] = useState(false);
  const setOpenShareTripModal = props.setOpenShareTripModal;
  const backServer = props.backServer;
  
  const menuOpenFunc = ()=>{
    openMenu ? setOpenMenu(false) : setOpenMenu(true);
  }
  const deleteTripFunc = ()=>{
    Swal.fire({icon: "info", text: "여행 일정을 삭제하시겠습니까?", showCancelButton: true, confirmButtonText: "삭제", cancelButtonText: "취소"})
    .then((res)=>{
      if(res.isConfirmed){
        axios.delete(backServer + "/trip/" + item.tripNo)
        .then((res)=>{
          if(res.data.message === "success"){
            Swal.fire({icon: "success", text: "여행 일정이 삭제되었습니다.", confirmButtonText: "닫기"});
            if(itemType === "coming"){
              comingTripList.splice(comingTripList[thisIndex], 1);
              setComingTripList([...comingTripList]);
            }else if(itemType === "past"){
              pastTripList.splice(pastTripList[thisIndex], 1);
              setPastTripList([...pastTripList]);
            }
          }
        })
        .catch((res)=>{
          console.log(res);
          Swal.fire({icon: "warning", text: "문제가 발생했습니다. 잠시 후 다시 시도해주세요.", confirmButtonText: "닫기"});
        })
      }
    })
  }
  const shareTripFunc = ()=>{
    setOpenShareTripModal(true);
  }

  return(
    <li>
      <Link to={"/mypage/myTrips/modifyTrips/"+item.tripNo}>
        <div className="trip_info">
          <div className="trip_title">{item.tripTitle}</div>
          <div className="trip_date">{item.tripStartDate.replaceAll("-",".")} - {item.tripEndDate.replaceAll("-",".")}</div>
          <div className="btm_info">
            <span className="trip_place_count">{item.placeCount !== 0 ? item.placeName + " 외 " + (item.placeCount-1) + "개 장소" : "0개 장소"}</span>
            {/* <span className="book_inn">예약한 숙소: 1</span> */}
            {/* <span className="book_tour">예약한 투어: 1</span> */}
          </div>
        </div>
      </Link>
      <div className="btn_wrap">
        <button type="button" className="btn_delete" onClick={deleteTripFunc}><span className="hidden">삭제</span></button>
        {/* <button type="button" className="btn_share"><span className="hidden">공유하기</span></button> */}
        {/* <div className="small_menu_wrap">
          <button className="btn_menu" onClick={menuOpenFunc}><span className="hidden">메뉴</span></button>
          {
            openMenu ? (
              <ul className="menu_list">
                <li><button type="button" onClick={shareTripFunc}>공유하기</button></li>
                <li><button type="button" onClick={deleteTripFunc}>삭제</button></li>
              </ul>
            ) : ""
          }
        </div> */}
      </div>
    </li>
  )
}

const BlogItem = (props)=>{
  const item = props.item;
  const backServer = props.backServer;

  return(
    <li className="blogItem">
      <Link to={"/blogView/"+item.blogNo}>
        <div className="blog_thumb">
          {
            item.blogThumbnail !== "null" ? (
              <img src={backServer+"/blog/blogThumbnail/"+item.blogThumbnail} alt="블로그 썸네일"></img>
            ) : ""
          }  
        </div>
        <div className="blog_title">{item.blogTitle}</div>
        <div className="blog_date">{item.blogDate}</div>
      </Link>
    </li>
  );
}

export default MyTrips;
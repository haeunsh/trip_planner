import { useRef, useState } from "react";
import "./member.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";
import { Button, Input } from "../../component/FormFrm";

const Login = (props) => {
  const loginFunction = props.login;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const login = () => {
    if (memberEmail !== "" && memberPw !== "") {
      const obj = { memberEmail, memberPw };
      axios
        .post(backServer + "/member/login", obj)
        .then((res) => {
          if (res.data.message === "success") {
            loginFunction(res.data.data);
            Swal.fire({
              title: "로그인 성공",
              icon: "success",
            });
            navigate("/");
          } else if (res.data.message === "block") {
            Swal.fire({
              title: "이용정지중입니다",
              icon: "warning",
            });
          } else {
            Swal.fire({
              title: "로그인 실패",
              text: "아이디/비밀번호를 확인하세요",
              icon: "warning",
            });
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };
  const join = () => {
    navigate("/license");
  };

  const passwordRef = useRef(null);

  const handleShowPw = () => {
    const password = passwordRef.current;
    const pwIcon = document.querySelector("#showPw");

    if (password.type === "password") {
      password.type = "text";
      pwIcon.innerText = "visibility";
    } else {
      password.type = "password";
      pwIcon.innerText = "visibility_off";
    }
  };

  const kakaoLogin = () => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    document.body.appendChild(script);

    script.onload = () => {
      window.Kakao.init("ddeb625775a0919685ee69a92e0fd14c");
      window.Kakao.Auth.login({
        scope: "account_email",
        success: function (authObj) {
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: (res) => {
              const kakaoMemberEmail = res.kakao_account.email;
              console.log(kakaoMemberEmail);
              axios
                .post(backServer + "/kakaoLogin/" + kakaoMemberEmail)
                .then((res) => {
                  if (res.data.message === "success") {
                    loginFunction(res.data.data);
                    navigate("/");
                  }
                })
                .catch((res) => {
                  console.log("카카오 로그인 실패");
                });
            },
          });
        },
      });
    };
  };
  const loginKeyDownEvnet = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };
  console.clear();
  return (
    <section className="contents login">
      <h2>로그인</h2>
      <div className="login_input_area">
        <div className="input_wrap">
          <div className="input_title">
            <label htmlFor="memberEmail">이메일</label>
          </div>
          <div className="input_item">
            <Input
              type="text"
              content="memberEmail"
              placeholder="abc@google.com"
              data={memberEmail}
              setData={setMemberEmail}
              keyDownEvent={loginKeyDownEvnet}
            />
          </div>
        </div>
        <div className="input_wrap">
          <div className="input_title">
            <label htmlFor="memberPw">비밀번호</label>
          </div>
          <div className="input_item" id="password-input">
            <Input
              type="password"
              content="memberPw"
              data={memberPw}
              setData={setMemberPw}
              keyDownEvent={loginKeyDownEvnet}
              inputRef={passwordRef}
            />
            <span id="showPw" className="material-icons" onClick={handleShowPw}>
              visibility_off
            </span>
          </div>
        </div>
        {/*
        <div className="btn_area">
          <Button class="kakao" clickEvent={kakaoLogin}></Button>
          <Button class="naver" clickEvent={login}></Button>
        </div>
  */}
        <div className="btn_area col">
          <Button text="회원가입" class="btn_text" clickEvent={join}></Button>
          <Button text="로그인" class="btn_primary" clickEvent={login}></Button>
        </div>
      </div>
    </section>
  );
};

export default Login;

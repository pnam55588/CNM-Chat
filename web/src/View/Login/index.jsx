import React, { useState } from "react";
import clsx from "clsx";
import Style from "./login.module.scss";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { postApiNoneToken } from "../../API";
import Swal from "sweetalert2";
import { checkPassword, checkPhoneValid, setUserStorage } from "../../Utils";
import Loading from "../../components/Loading";



export default function Login() {
  const navigate = useNavigate();

  const [isLoginPhone, setIsLoginPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordErr, setPasswordErr] = useState("");

  const handeleCheckPassword = (e) => {
    if (checkPassword(e.target.value)) {
      setPassword(e.target.value);
      setPasswordErr('')
    } else {
      setPasswordErr(
        "Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and no special characters."
      );
    }
  };
  

  const handleLogin = async () => {
    if (checkPhoneValid(phone)) {
      let data = {
        phone: phone,
        password: password,
      };
      try {
        setLoading(true);
        const result = await postApiNoneToken("/auth/login", data);
        if (result.data.error) {
          Swal.fire({
            icon: "error",
            text: result.data.error,
          });
        } else {
          setUserStorage(result.data);
          navigate("/chat-app/chat");
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          text: error.response.data.error,
        });
      }
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: "Invalid phone. Please re-enter!!!",
      });
    }
  };

  return (
    <>
      {loading ? <Loading /> : null}
      <div className={clsx(Style.wrapLogin)}>
        <div
          className={clsx(
            Style.wrap,
             !isLoginPhone ? Style.action : ""
          )}
        >
          {/* <Button id="buttonStyle3">Login with email</Button> */}
          <Button
            id="buttonStyle3"
            onClick={() => {
              setIsLoginPhone(!isLoginPhone);
            }}
          >
            Login with phone
          </Button>
          <span className={clsx(Style.or)}>Or</span>
          <Button
            id="buttonStyle3"
            onClick={() => {
              navigate("/chat-app/sign-up");
            }}
          >
            Sign Up
          </Button>
        </div>
        <div
          className={clsx(Style.wrapEmail, isLoginPhone ? Style.action : "")}
        >
          <FaArrowLeftLong
            size={35}
            className={clsx(Style.iconArrow)}
            onClick={() => {
              setIsLoginPhone(!isLoginPhone);
            }}
          />
          <Form.Control
            id="inputText-01"
            type="text"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            placeholder="Phone"
          />
          <Form.Control
            id="inputText-01"
            type="password"
            onChange={(e) => {
              handeleCheckPassword(e)
            }}
            placeholder="Password"
          />
          {passwordErr && <div style={{ color: "red", width:'23%', marginBottom:'2%' }}>{passwordErr}</div>}
          <Button id="buttonStyle3" onClick={() => handleLogin()}>
            Login
          </Button>
        </div>
      </div>
      
    </>
  );
}

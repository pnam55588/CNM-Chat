import React, { useState } from "react";
import clsx from "clsx";
import Style from "./login.module.scss";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";
import {postApiNoneToken } from "../../API";
import Swal from "sweetalert2";
import { checkEmailValid, checkPhoneValid, setUserStorage } from "../../Utils";

export default function Login() {
  const navigate = useNavigate();

  const [isLoginEmail, setIsLoginEmail] = useState(false);
  const [isLoginPhone, setIsLoginPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (checkPhoneValid(phone)) {
      let data = {
        phone: phone,
        password: password,
      };
      try {
        const result = await postApiNoneToken("/auth/login", data);
        if (result.data.error) {
          Swal.fire({
            icon: "error",
            text: result.data.error,
          });
        } else {
          setUserStorage(result.data)
          navigate("/chat-app/chat");
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          text: error.response.data.error,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "Invalid phone. Please re-enter!!!",
      });
    }
  };

  return (
    <div className={clsx(Style.wrapLogin)}>
      <div
        className={clsx(
          Style.wrap,
          !isLoginEmail || isLoginPhone ? Style.action : ""
        )}
      >
        <Button id="buttonStyle1">Login with email</Button>
        <Button
          id="buttonStyle1"
          onClick={() => {
            setIsLoginEmail(!isLoginEmail);
          }}
        >
          Login with phone
        </Button>
        <span className={clsx(Style.or)}>Or</span>
        <Button
          id="buttonStyle1"
          onClick={() => {
            navigate("/chat-app/sign-up");
          }}
        >
          Sign Up
        </Button>
      </div>
      <div className={clsx(Style.wrapEmail, isLoginEmail ? Style.action : "")}>
        <FaArrowLeftLong
          size={35}
          className={clsx(Style.iconArrow)}
          onClick={() => {
            setIsLoginEmail(!isLoginEmail);
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
            setPassword(e.target.value);
          }}
          placeholder="Password"
        />
        <Button id="buttonStyle1" onClick={() => handleLogin()}>
          Login
        </Button>
      </div>
    </div>
  );
}

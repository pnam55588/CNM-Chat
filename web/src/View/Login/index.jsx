import React, { useState } from "react";
import clsx from "clsx";
import Style from "./login.module.scss";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function Login() {
  const navigate = useNavigate();
  const [isLoginEmail, setIsLoginEmail] = useState(false);
  const [isLoginPhone, setIsLoginPhone] = useState(false);

  return (
    <div className={clsx(Style.wrapLogin)}>
      <div
        className={clsx(
          Style.wrap,
          !isLoginEmail || isLoginPhone ? Style.action : ""
        )}
      >
        <Button id="buttonStyle1">Login with phone</Button>
        <Button
          id="buttonStyle1"
          onClick={() => {
            setIsLoginEmail(!isLoginEmail);
          }}
        >
          Login with email
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
            setIsLoginEmail(!isLoginEmail)
          }}
        />
        <Form.Control id="inputText-01" placeholder="Email" />
        <Form.Control id="inputText-01" placeholder="Password" />
        <Button id="buttonStyle1">Login</Button>
      </div>
    </div>
  );
}

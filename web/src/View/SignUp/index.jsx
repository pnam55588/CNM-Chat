import React, { useState } from "react";
import clsx from "clsx";
import Style from "./signUp.module.scss";
import { Button, Form } from "react-bootstrap";
import { FaSnapchat, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { checkEmailValid } from "../../Utils";
import Swal from "sweetalert2";
import ErrorNotification from "../Modal/ErrorNotification";
import { postApiNoneToken } from "../../API";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [messageErr, setMessageErr] = useState("");

  const handleSignUp = async () => {
    if (checkEmailValid(email)) {
      let data = {
        name: name,
        email: email,
        password: password,
      };
      const result = await postApiNoneToken(data)
      if(result.status===400){
        Swal.fire({
          icon: "error",
          text: result.data.error,
        });
      }else if(result.data!==null){
        navigate('/chat-app/login')
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "Invalid email. Please re-enter!!!",
      });
    }
  };
  return (
    <div className={clsx(Style.wrapSignUp)}>
      <FaArrowLeftLong
        size={35}
        className={clsx(Style.iconArrow)}
        onClick={() => {
          navigate("/chat-app/login");
        }}
      />
      <FaSnapchat size={150} />
      <Form.Control
        id="inputText-01"
        type="text"
        placeholder="Name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Form.Control
        id="inputText-01"
        type="text"
        placeholder="Email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Form.Control
        id="inputText-01"
        type="password"
        placeholder="Password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button
        id="buttonStyle1"
        onClick={() => {
          handleSignUp();
        }}
      >
        Sign Up
      </Button>
    </div>
  );
}

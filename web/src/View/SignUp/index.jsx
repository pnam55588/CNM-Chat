import React, { useState } from "react";
import clsx from "clsx";
import Style from "./signUp.module.scss";
import { Button, Form } from "react-bootstrap";
import { FaSnapchat, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { checkEmailValid, checkPhoneValid } from "../../Utils";
import Swal from "sweetalert2";
import { postApiNoneToken } from "../../API";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (checkPhoneValid(phone)) {
      let data = {
        phone: phone,
        name: name,
        password: password,
      };
      try {
        const result = await postApiNoneToken("/auth/register", data);
        if (result.data.error) {
          Swal.fire({
            icon: "error",
            text: result.data.error,
          });
        } else {
          navigate("/chat-app/login");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          text: error.request.data,
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
        placeholder="Phone"
        onChange={(e) => {
          setPhone(e.target.value);
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

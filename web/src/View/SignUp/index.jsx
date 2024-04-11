import React, { useState } from "react";
import clsx from "clsx";
import Style from "./signUp.module.scss";
import { Button, Form } from "react-bootstrap";
import { FaSnapchat, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { checkPassword, checkPhoneValid, setUserStorage } from "../../Utils";
import Swal from "sweetalert2";
import { getAPiNoneToken, getApiWithToken, postApiNoneToken } from "../../API";
import auth from "../../firebase/setup";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import ModalAuth from "../Modal/ModalAuth";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [comfirmation, setComfirmation] = useState(null);
  const [otp, setOtp] = useState("");
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);

  const sendOtp = async () => {
    try {
      let phoneNumber = "+84" + phone;
      const recapcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const comfirm = await signInWithPhoneNumber(auth, phoneNumber, recapcha);
      setComfirmation(comfirm);
      setIsVerifyOtp(true);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: "Invalid phone number. Please re-enter!!!",
      });
    }
  };
  const verifyOtp = async () => {
    try {
      await comfirmation.confirm(otp);
      navigate("/chat-app/chat");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Invalid OTP. Please re-enter!!!",
      });
    }
  };

  const handleCheckPhoneExit = async (value) => {
    if (checkPhoneValid(value)) {
      getAPiNoneToken(`/users/search?phone=${value}`)
        .then((result) => {
          Swal.fire({
            icon: "error",
            text: "Phone already exists",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handeleCheckPassword = (e) => {
    if (checkPassword(e.target.value)) {
      setPassword(e.target.value);
      setPasswordErr("");
    } else {
      setPasswordErr(
        "Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and no special characters."
      );
    }
  };

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
          setUserStorage(result.data);
          sendOtp();
          // navigate("/chat-app/chat");
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
    <>
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
          placeholder="Phone"
          onChange={(e) => {
            setPhone(e.target.value);
            handleCheckPhoneExit(e.target.value);
          }}
        />
        <Form.Control
          id="inputText-01"
          type="text"
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          // disabled={isVerifyOtp ? "" : "disabled"}
        />
        <Form.Control
          id="inputText-01"
          type="password"
          placeholder="Password"
          onChange={(e) => handeleCheckPassword(e)}
        />
        {passwordErr && (
          <div style={{ color: "red", width: "23%", marginBottom: "2%" }}>
            {passwordErr}
          </div>
        )}
        <div id="recaptcha" class="g-recaptcha"></div>
        <Button
          id="buttonStyle3"
          onClick={() => {
            handleSignUp();
          }}
          // disabled={isVerifyOtp ? "" : "disabled"}
        >
          Sign Up
        </Button>
      </div>
      <ModalAuth show={isVerifyOtp} verifyOtp={verifyOtp} setOtp={setOtp} />
    </>
  );
}

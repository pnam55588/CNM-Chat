import React, { useState } from "react";
import { useNavigate } from "react-router";
import { IoLogoSnapchat } from "react-icons/io";
import { BsChatSquareText } from "react-icons/bs";
import { RiFolderUserLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import clsx from "clsx";
import style from "./menuMain.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { selectMenu } from "../../features/Menu/menuSlice";
import Profile from "../Profile";
import { RiLogoutCircleLine } from "react-icons/ri";
import { disconnectSocket } from "../../Utils/socket";

export default function MenuMain() {
  const menuActive = useSelector((state) => state.menuActive.active);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div className={clsx(style.menu)}>
        <IoLogoSnapchat size={50} color="white" />
        <span
          className={clsx(menuActive === "allChats" ? style.active : "")}
          onClick={() => {
            dispatch(selectMenu("allChats"));
          }}
        >
          <BsChatSquareText size={30} color="white" />
          All chats
        </span>
        <span
          className={clsx(menuActive === "friends" ? style.active : "")}
          onClick={() => {
            dispatch(selectMenu("friends"));
          }}
        >
          <RiFolderUserLine size={35} color="white" />
          Friends
        </span>
        <span
          onClick={() => {
            setModalShow(!modalShow);
          }}
        >
          <FaRegUser size={35} color="white" />
          Profile
        </span>
        <span
          onClick={() => {
            localStorage.removeItem("user");
            navigate('/chat-app/login')
          }}
        >
          <RiLogoutCircleLine size={40} onClick={()=>disconnectSocket()}/>
        </span>
      </div>
      <Profile show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

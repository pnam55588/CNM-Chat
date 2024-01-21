import React, { useState } from "react";
import clsx from "clsx";
import style from "./chat.module.scss";
import { IoCallOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { Form, InputGroup } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import { HiLink } from "react-icons/hi2";
import ChatInfo from "../../components/ChatInfo";
import SendingContent from "../../components/SendingContent";
import ReceivingContent from "../../components/ReceivingContent";

export default function Chat() {
  const [openChatInfo, setOpenChatInfo] = useState(false);
  return (
    <div className={clsx(style.chat)}>
      <div style={{ width: openChatInfo ? "70%" : "100%" }}>
        <div className={clsx(style.recipient)}>
          <div className={clsx(style.name)}>
            <h4>recipient</h4>
            <p>Online</p>
          </div>
          <div>
            <IoCallOutline size={35} cursor={"pointer"} />
            <CiMenuKebab
              size={35}
              cursor={"pointer"}
              onClick={() => {
                setOpenChatInfo(!openChatInfo);
              }}
            />
          </div>
        </div>
        <div className={clsx(style.chatFrame)}>
          <div id="scroll-style-01" className={clsx(style.conversation)}>
            <SendingContent/>
            <ReceivingContent/>
            <SendingContent/>
            <SendingContent/>
            <ReceivingContent/>
            <ReceivingContent/>
          </div>
          <div className={clsx(style.inputWrap)}>
            <InputGroup className={clsx(style.InputGroup)}>
              <InputGroup.Text
                className={clsx(style.basicaddon1)}
                id="basic-addon1"
              >
                <HiLink size={25} cursor={"pointer"} />
                <input type="file" hidden />
              </InputGroup.Text>
              <Form.Control
                placeholder="Your Message"
                aria-label="yourMessage"
                aria-describedby="basic-addon1"
              />
              <InputGroup.Text
                className={clsx(style.basicaddon1)}
                id="basic-addon1"
              >
                <IoIosSend size={35} cursor={"pointer"} />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "30%",
          display: openChatInfo ? "block" : "none",
        }}
      >
        <ChatInfo />
      </div>
    </div>
  );
}

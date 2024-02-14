import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import style from "./chat.module.scss";
import { IoCallOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { Button, Image } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import { HiLink } from "react-icons/hi2";
import ChatInfo from "../../components/ChatInfo";
import SendingContent from "../../components/SendingContent";
import ReceivingContent from "../../components/ReceivingContent";
import InputEmoji from "react-input-emoji";
import { useSelector, useDispatch } from "react-redux";
import welcome from "./../../image/welcome_v2.jpg";
import { postApiWithToken } from "../../API";
import { getUserStorage } from "../../Utils";
import {
  getCurrentMessage,
  handleSetCurrentMessage,
} from "../../features/Message/messageSlice";
import {
  getMessageSocket,
  initiateConversationsocket,
  sendMessageSocket,
  socket,
} from "../../Utils/socket";

export default function Chat() {
  const [openChatInfo, setOpenChatInfo] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef(null);
  const user = getUserStorage().user;

  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const recipient = useSelector(
    (state) => state.conversationReducer.userRecipient
  );
  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );

  const handleSendMessage = async () => {
    const dt = {
      conversationId: selectedConversation._id,
      user: getUserStorage().user._id,
      text: inputMessage,
    };
    const result = await postApiWithToken("/conversation/sendMessage", dt);
    if (result.status === 200) {
      setInputMessage("");
      const message = {
        conversationId: selectedConversation._id,
        user: getUserStorage().user._id,
        receiverIds: selectedConversation.users
          .filter((user) => user._id !== getUserStorage().user._id).map(user=>user._id),
        text: inputMessage,
      };
      sendMessageSocket(message);
      await dispatch(getCurrentMessage(selectedConversation._id));
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [currentMessage, selectedConversation]);

  useEffect(() => {
    getMessageSocket()
      .then((result) => {
        console.log(result);
        dispatch(handleSetCurrentMessage(result));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user._id]);

  return (
    <div className={clsx(style.chat)}>
      {selectedConversation !== null ? (
        <>
          <div style={{ width: openChatInfo ? "70%" : "100%" }}>
            <div className={clsx(style.recipient)}>
              <div className={clsx(style.name)}>
                <h4>{recipient?.name}</h4>
                <p>{recipient?.isOnline ? "Online" : "Offline"}</p>
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
                {currentMessage?.map((item, index) => {
                  if (item.user._id === getUserStorage().user._id) {
                    return (
                      <span key={index} ref={scrollRef}>
                        <SendingContent data={item} />
                      </span>
                    );
                  } else {
                    return (
                      <span key={index} ref={scrollRef}>
                        <ReceivingContent data={item} sender={item.user} />
                      </span>
                    );
                  }
                })}
              </div>
              <div className={clsx(style.inputWrap)}>
                <Button className={clsx(style.basicaddon1)} id="basic-addon1">
                  <HiLink size={25} cursor={"pointer"} />
                  <input type="file" hidden />
                </Button>
                <InputEmoji
                  cleanOnEnter
                  placeholder="Type a message"
                  onChange={setInputMessage}
                  value={inputMessage}
                  onEnter={() => handleSendMessage()}
                />
                <Button className={clsx(style.basicaddon1)} id="basic-addon1">
                  <IoIosSend
                    size={35}
                    cursor={"pointer"}
                    onClick={() => handleSendMessage()}
                  />
                </Button>
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
        </>
      ) : (
        <Image src={welcome} width={"100%"} />
      )}
    </div>
  );
}

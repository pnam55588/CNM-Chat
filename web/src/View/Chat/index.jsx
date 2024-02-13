import React, { useRef, useState } from "react";
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
import { getCurrentMessage } from "../../features/Message/messageSlice";

export default function Chat() {
  const [openChatInfo, setOpenChatInfo] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const dispatch = useDispatch()
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const recipient = useSelector(
    (state) => state.conversationReducer.userRecipient
  );
  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );
  const handleSendMessage=async()=>{
    const dt ={
      conversationId: selectedConversation._id,
      senderId: getUserStorage().user._id,
      text: inputMessage
    }
    const result = await postApiWithToken('/conversation/sendMessage', dt)
    if(result.status===200){
      setInputMessage('')
      await dispatch(getCurrentMessage(`/conversation/getMessages/${selectedConversation._id}`))
    }
  }

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
              <div
                id="scroll-style-01"
                className={clsx(style.conversation)}
              >

                {
                  currentMessage?.map((item, index)=>{
                    if(item.user._id===getUserStorage().user._id){
                      return(
                        <SendingContent data={item}/>
                      )
                    }else{
                      return(
                        <ReceivingContent data={item} />
                      )
                    }
                  })
                }
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
                  onEnter={()=>handleSendMessage()}
                />
                <Button className={clsx(style.basicaddon1)} id="basic-addon1">
                  <IoIosSend size={35} cursor={"pointer"} onClick={()=>handleSendMessage()}/>
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
        <Image src={welcome} width={'100%'}/>
      )}
    </div>
  );
}

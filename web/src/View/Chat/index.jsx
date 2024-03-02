import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import style from "./chat.module.scss";
import { IoCallOutline } from "react-icons/io5";
import { CiEdit, CiMenuKebab } from "react-icons/ci";
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
import { newConversationSocket, sendMessageSocket } from "../../Utils/socket";
import { FaFileImage } from "react-icons/fa6";
import ModalChandeGroupName from "../Modal/ModalChangeGroupName";

export default function Chat() {
  const [openChatInfo, setOpenChatInfo] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [urlImages, setUrlImages] = useState([]);
  const [notiAddMember, setNotiAddMember] = useState("");
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const inputFileReference = useRef(null);
  const inputImageReference = useRef(null);
  const usersOnline = useSelector((state) => state.userReducer.usersOnline);
  const [changeGroupName, setChangeGroupName] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const allConversation = useSelector(
    (state) => state.conversationReducer.allConversation
  );
  const recipient = useSelector(
    (state) => state.conversationReducer.userRecipient
  );
  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );

  const isOnline = Object.keys(usersOnline).find((id) => id === recipient?._id);

  const handleNotiAddMember = (noti) => {
    setNotiAddMember(noti);
  };

  const uploadFile = async () => {
    const selectedFiles = inputFileReference.current.files;
    var list = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const url = URL.createObjectURL(selectedFiles[i]);
      list.push(url);
    }
    console.log(list);
  };

  const uploadImage = async () => {
    const selectedFiles = inputImageReference.current.files;
    var list = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const url = URL.createObjectURL(selectedFiles[i]);
      list.push(url);
    }
    setUrlImages(list);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    formData.append("conversationId", selectedConversation._id);
    formData.append("user", getUserStorage().user._id);
    try {
      const result = await postApiWithToken(
        `/conversation/sendImages`,
        formData
      );
      if (result.status === 200) {
        const message = {
          conversationId: selectedConversation._id,
          user: getUserStorage().user._id,
          receiverIds: selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
          images: result.data.images,
        };
        sendMessageSocket(message);
        await dispatch(getCurrentMessage(selectedConversation._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          .filter((user) => user._id !== getUserStorage().user._id)
          .map((user) => user._id),
        text: inputMessage,
      };
      if (currentMessage.length <= 0) {
        newConversationSocket(selectedConversation, message);
      } else {
        sendMessageSocket(message);
      }
      await dispatch(getCurrentMessage(selectedConversation._id));
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [currentMessage, selectedConversation]);

  return (
    <div className={clsx(style.chat)}>
      {selectedConversation !== null ? (
        <>
          <div style={{ width: openChatInfo ? "70%" : "100%" }}>
            <div className={clsx(style.recipient)}>
              <div className={clsx(style.name)}>
                {selectedConversation.isGroup ? (
                  <div className="d-flex align-items-center">
                    <h4>{selectedConversation.name}</h4>
                    <CiEdit
                      size={25}
                      cursor={"pointer"}
                      onClick={() => setChangeGroupName(true)}
                    />
                    <ModalChandeGroupName
                      show={changeGroupName}
                      onHide={() => setChangeGroupName(false)}
                      groupName={selectedConversation.name}
                      conversationId={selectedConversation._id}
                    />
                  </div>
                ) : (
                  <h4>{recipient?.name}</h4>
                )}
                <p>
                  {(recipient && recipient.isOnline) || isOnline
                    ? "Online"
                    : "Offline"}
                </p>
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
                {selectedConversation.isGroup && notiAddMember ? (
                  <p className={clsx(style.notiAddMember)}>{notiAddMember}</p>
                ) : null}
              </div>
              <div className={clsx(style.inputWrap)}>
                <Button
                  className={clsx(style.basicaddon1)}
                  id="basic-addon1"
                  onClick={() => {
                    inputFileReference.current.click();
                  }}
                  onChange={() => {
                    uploadFile();
                  }}
                >
                  <HiLink size={25} cursor={"pointer"} />
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf, .doc, .docx, .txt"
                    ref={inputFileReference}
                  />
                </Button>
                <InputEmoji
                  cleanOnEnter
                  placeholder="Type a message"
                  onChange={setInputMessage}
                  value={inputMessage}
                  onEnter={() => handleSendMessage()}
                />
                <Button
                  className={clsx(style.basicaddon1)}
                  id="basic-addon1"
                  onClick={() => {
                    inputImageReference.current.click();
                  }}
                  onChange={() => {
                    uploadImage();
                  }}
                >
                  <FaFileImage size={25} cursor={"pointer"} />
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/jpeg, image/png"
                    ref={inputImageReference}
                  />
                </Button>
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
            <ChatInfo handleNotiAddMember={handleNotiAddMember} />
          </div>
        </>
      ) : (
        <Image src={welcome} width={"100%"} />
      )}
    </div>
  );
}

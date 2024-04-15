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
import { newConversationSocket, sendMessageSocket, socket } from "../../Utils/socket";
import { FaFileImage, FaLocationDot } from "react-icons/fa6";
import ModalChandeGroupName from "../Modal/ModalChangeGroupName";
import Loading from "../../components/Loading";
import { RiVideoUploadFill } from "react-icons/ri";
import { LuAlertCircle } from "react-icons/lu";
import { getBlocks } from "../../features/User/userSlice";

export default function Chat() {
  const [openChatInfo, setOpenChatInfo] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [notiAddMember, setNotiAddMember] = useState("");
  const [changeGroupName, setChangeGroupName] = useState(false);
  const [loadingInput, setLoadingInput] = useState(false);

  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const usersOnline = useSelector((state) => state.userReducer.usersOnline);
  const blocked = useSelector((state) => state.userReducer.blocked);
  const loading = useSelector((state) => state.menuActive.loading);

  const inputFileReference = useRef(null);
  const inputImageReference = useRef(null);
  const inputVideoReference = useRef(null);

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
  const isBlocked = blocked?.some((id) => id === recipient?._id);

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
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("file", selectedFiles[i]);
    }
    formData.append("conversationId", selectedConversation._id);
    formData.append("user", getUserStorage().user._id);
    try {
      const result = await postApiWithToken(`/conversation/sendFile`, formData);
      if (result.status === 200) {
        sendMessageSocket({
          ...result.data,
          receiverIds: selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
        });
        await dispatch(getCurrentMessage(selectedConversation._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    const selectedFiles = inputImageReference.current.files;
    var list = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const url = URL.createObjectURL(selectedFiles[i]);
      list.push(url);
    }
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
        sendMessageSocket({
          ...result.data,
          receiverIds: selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
        });
        await dispatch(getCurrentMessage(selectedConversation._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadVideo = async () => {
    const selectedFiles = inputVideoReference.current.files;
    const formData = new FormData();
    formData.append("file", selectedFiles[0]);
    formData.append("conversationId", selectedConversation._id);
    formData.append("user", getUserStorage().user._id);
    try {
      setLoadingInput(true);
      const result = await postApiWithToken(
        `/conversation/sendVideo`,
        formData
      );
      if (result.status === 200) {
        sendMessageSocket({
          ...result.data,
          receiverIds: selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
        });
        await dispatch(getCurrentMessage(selectedConversation._id));
        setLoadingInput(false);
      }
    } catch (error) {
      setLoadingInput(false);
      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const dt = {
        conversationId: selectedConversation._id,
        user: getUserStorage().user._id,
        text: inputMessage,
      };
      const result = await postApiWithToken("/conversation/sendMessage", dt);
      if (result.status === 200) {
        if (currentMessage.length <= 0) {
          newConversationSocket(selectedConversation, {
            ...result.data,
            receiverIds: selectedConversation.users
              .filter((user) => user._id !== getUserStorage().user._id)
              .map((user) => user._id),
          });
        } else {
          sendMessageSocket({
            ...result.data,
            receiverIds: selectedConversation.users
              .filter((user) => user._id !== getUserStorage().user._id)
              .map((user) => user._id),
          });
        }
        setInputMessage("");
        await dispatch(getCurrentMessage(selectedConversation._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const success = async (pos) => {
    var crd = pos.coords;
    const location = {
      latitude: crd.latitude,
      longitude: crd.longitude,
    };
    const data = {
      conversationId: selectedConversation._id,
      user: getUserStorage().user._id,
      location: location,
    };
    try {
      setLoadingInput(true);
      const result = await postApiWithToken(`/conversation/sendLocation`, data);
      if (result.status === 200) {
        sendMessageSocket({
          ...result.data,
          receiverIds: selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
        });
        await dispatch(getCurrentMessage(selectedConversation._id));
        setLoadingInput(false);
      }
    } catch (error) {
      setLoadingInput(false);
      console.log(error);
    }
  };

  const errors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleUnBlock = async () => {
    try {
      const dt = {
        senderId: getUserStorage().user._id,
        receiverId: recipient._id,
      };
      const result = await postApiWithToken("/users/unblock", dt);
      if(result.status===200){
        await dispatch(getBlocks(`/users/${getUserStorage().user._id}`));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [
    currentMessage,
    selectedConversation,
    inputFileReference,
    inputImageReference,
    inputVideoReference,
  ]);

  return (
    <div className={clsx(style.chat)}>
      {selectedConversation !== null ? (
        <>
          <div style={{ width: openChatInfo ? "70%" : "100%" }}>
            <div className={clsx(style.recipient)}>
              <div className={clsx(style.name)}>
                {selectedConversation?.isGroup ? (
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
              {loading ? <Loading /> : null}
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
                {selectedConversation?.isGroup && notiAddMember ? (
                  <p className={clsx(style.notiAddMember)}>{notiAddMember}</p>
                ) : null}
              </div>
              {isBlocked ? (
                <div className={clsx(style.blockWrap)}>
                  <LuAlertCircle size={25} /> Bỏ chặn để gửi tin nhắn tới người
                  này. <span onClick={()=>handleUnBlock()}>Bỏ chặn</span>
                </div>
              ) : (
                <div className={clsx(style.inputWrap)}>
                  <Button
                    className={clsx(style.basicaddon1)}
                    id="basic-addon1"
                    onClick={() => handleGetLocation()}
                  >
                    <FaLocationDot size={25} cursor={"pointer"} />
                  </Button>
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
                  <Button
                    className={clsx(style.basicaddon1)}
                    id="basic-addon1"
                    onClick={() => inputVideoReference.current.click()}
                    onChange={() => uploadVideo()}
                  >
                    <RiVideoUploadFill size={30} cursor={"pointer"} />
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="video/*"
                      ref={inputVideoReference}
                    />
                  </Button>

                  <InputEmoji
                    cleanOnEnter
                    placeholder="Type a message"
                    onChange={setInputMessage}
                    value={inputMessage}
                    onEnter={() => handleSendMessage()}
                    disabled={isBlocked ? true : false}
                  ></InputEmoji>

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
              )}
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

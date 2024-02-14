import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./cardChat.module.scss";
import { Card } from "react-bootstrap";
import { getUserStorage } from "../../Utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getRecipient,
  selectConversation,
} from "../../features/Conversations/conversationsSlice";
import { getCurrentMessage } from "../../features/Message/messageSlice";
import { socket } from "../../Utils/socket";import { getApiWithToken } from "../../API";
import moment from "moment";


export default function CardChat({ data }) {
  const [userRecipient, setUserRecipient] = useState({});
  const [lastMessage, setLastMessage] = useState('')
  const [lastTime, setLastTime] = useState("");
  const usersOnline = useSelector((state) => state.userReducer.usersOnline);
  const isOnline = Object.keys(usersOnline).find(
    (id) => id === userRecipient._id
  );
  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = getUserStorage().user._id;
    getLastMessage()
    const recipient = data.users.find((user) => user._id !== userId);
    setUserRecipient(recipient);
  }, [data]);

  useEffect(()=>{
    getLastMessage()
  },[currentMessage])

  const getLastMessage=async()=>{
    const result = await getApiWithToken(`/conversation/getMessages/${data._id}`)
    if(result.status===200){
      const last = result.data[result.data?.length - 1];
          if (last?.user._id === getUserStorage().user._id) {
            setLastMessage(`You: ${last?.text}`);
          } else {
            setLastMessage(last?.text);
          }
          setLastTime(last?.createdAt);
    }
  }

  const handleSelectedConversation = async () => {
    await dispatch(selectConversation(data));
    await dispatch(getRecipient(`/users/${userRecipient._id}`));
    await dispatch(getCurrentMessage(data._id));
  };
  return (
    <Card
      className={clsx(
        style.cardChat,
        selectedConversation?._id === data._id ? style.action : ""
      )}
      onClick={() => handleSelectedConversation()}
    >
      <Card.Img
        className={clsx(style.cardImage)}
        src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
      />
      {userRecipient.isOnline || isOnline ? (
        <div className={clsx(style.online)}></div>
      ) : null}
      <Card.Body className={clsx(style.cardBody)}>
        <Card.Title className={clsx(style.cardTitle)}>
          {userRecipient.name}
          <span>{moment(lastTime).calendar()}</span>
        </Card.Title>

        <Card.Text className={clsx(style.cardText)}>
          <span>{lastMessage}</span>
          <span>2</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

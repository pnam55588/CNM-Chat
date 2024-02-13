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

export default function CardChat({ data }) {
  const [userRecipient, setUserRecipient] = useState({});
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = getUserStorage().user._id;
    const recipient = data.users.find((user) => user._id !== userId);
    setUserRecipient(recipient);
  }, [data]);

  const handleSelectedConversation = async () => {
    await dispatch(selectConversation(data));
    await dispatch(getRecipient(`/users/${userRecipient._id}`));
    await dispatch(getCurrentMessage(`/conversation/getMessages/${data._id}`));
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
      {userRecipient.isOnline ? (
        <div className={clsx(style.online)}></div>
      ) : null}
      <Card.Body className={clsx(style.cardBody)}>
        <Card.Title className={clsx(style.cardTitle)}>
          {userRecipient.name}
          <span>4m</span>
        </Card.Title>

        <Card.Text className={clsx(style.cardText)}>
          <span>Last Message...</span>
          <span>2</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

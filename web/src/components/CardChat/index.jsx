import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./cardChat.module.scss";
import { Card } from "react-bootstrap";
import { getUserStorage } from "../../Utils";
import { useDispatch } from "react-redux";
import { getConversationById } from "../../features/Conversations/conversationsSlice";

export default function CardChat({ data }) {
  const [userRecipient, setUserRecipient] = useState({});
  const dispatch = useDispatch()

  useEffect(() => {
    const userId = getUserStorage().user._id;
    const recipient = data.users.find((user) => user._id !== userId);
    setUserRecipient(recipient);
  }, []);

  const handleSelectedConversation = async () => {
  };
  return (
    <Card
      className={clsx(style.cardChat)}
      onClick={() => handleSelectedConversation()}
    >
      <Card.Img
        className={clsx(style.cardImage)}
        src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
      />
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

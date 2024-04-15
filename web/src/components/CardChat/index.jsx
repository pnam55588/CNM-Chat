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
import { getApiWithToken } from "../../API";
import moment from "moment";
import { setLoading } from "../../features/Menu/menuSlice";

export default function CardChat({ data }) {
  const [userRecipient, setUserRecipient] = useState({});
  const [lastMessage, setLastMessage] = useState("");
  const [lastTime, setLastTime] = useState("");
  const [isOnline, setIsOnline] = useState(null);
  const usersOnline = useSelector((state) => state.userReducer.usersOnline);

  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = getUserStorage().user._id;
    getLastMessage();
    const recipient = data.users.find((user) => user._id !== userId);
    setIsOnline(Object.keys(usersOnline).includes(recipient._id));
    setUserRecipient(recipient);
  }, [data]);

  useEffect(() => {
    getLastMessage();
  }, [currentMessage]);

  const getLastMessage = async () => {
    const result = await getApiWithToken(
      `/conversation/getMessages/${data._id}`
    );
    if (result.status === 200) {
      const last = result.data[result.data?.length - 1];
      if (last?.user._id === getUserStorage().user._id) {
        if (last?.text) {
          setLastMessage(`You: ${last?.text}`);
        } else if (last?.images.length > 0) {
          setLastMessage(`You: Bạn vừa gửi ${last.images.length} ảnh`);
        } else if (last?.file) {
          setLastMessage(`You: Bạn vừa gửi file`);
        } else if (last?.video) {
          setLastMessage(`You: Bạn vừa gửi video`);
        } else if (last?.location) {
          setLastMessage(`You: Bạn chia sẻ vị trí`);
        }
      } else {
        if (last?.text) {
          setLastMessage(last?.text);
        } else if (last?.images.length > 0) {
          setLastMessage(`Vừa gủi ${last.images.length} ảnh`);
        } else if (last?.file) {
          setLastMessage(`Vừa gửi file`);
        } else if (last?.video) {
          setLastMessage(`Vừa gửi video`);
        } else if (last?.location) {
          setLastMessage(`Vừa chia sẻ vị trí`);
        }
      }
      setLastTime(last?.createdAt);
    }
  };

  const handleSelectedConversation = async () => {
    try {
      dispatch(setLoading(true));
      await dispatch(selectConversation(data));
      await dispatch(getRecipient(`/users/${userRecipient._id}`));
      await dispatch(getCurrentMessage(data._id));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
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
        src={
          data.isGroup
            ? data.image ||
              "https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png"
            : userRecipient.avatar ||
              "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
        }
      />
      {isOnline ? <div className={clsx(style.online)}></div> : null}
      <Card.Body className={clsx(style.cardBody)}>
        <Card.Title className={clsx(style.cardTitle)}>
          {data.isGroup ? data.name : userRecipient.name}
          <span>{moment(lastTime).calendar()}</span>
        </Card.Title>

        <Card.Text className={clsx(style.cardText)}>
          <span>{lastMessage}</span>
          {/* <span>2</span> */}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

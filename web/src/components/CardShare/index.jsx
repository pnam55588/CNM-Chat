import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./cardShare.module.scss";
import { Card, Form } from "react-bootstrap";
import { getUserStorage } from "../../Utils";

export default function CardShare({ data, select, handleSelectContacts, setUserRecipient_id }) {
  const [userRecipient, setUserRecipient] = useState({});

  useEffect(() => {
    const userId = getUserStorage().user._id;
    const recipient = data.users.find((user) => user._id !== userId);
    setUserRecipient(recipient);
  }, [data]);

  return (
    <Card
      className={clsx(style.cardChat)}
      onClick={() =>{handleSelectContacts(data);setUserRecipient_id(userRecipient._id) } }
    >
      <Form.Check
        style={{ marginRight: "5%" }}
        type="radio"
        id={`radio-${data._id}`}
        checked={select===data}
      />
      <Card.Img
        className={clsx(style.cardImage)}
        src={
          data.isGroup
            ? "https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png"
            : userRecipient.avatar
            ? userRecipient.avatar
            : "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
        }
      />
      <Card.Body className={clsx(style.cardBody)}>
        <Card.Title className={clsx(style.cardTitle)}>
          {data.isGroup ? data.name : userRecipient.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

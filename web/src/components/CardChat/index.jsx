import clsx from "clsx";
import React from "react";
import style from "./cardChat.module.scss";
import { Card } from "react-bootstrap";

export default function CardChat() {
  return (
    <Card className={clsx(style.cardChat)}>
      <Card.Img
        className={clsx(style.cardImage)}
        src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
      />
      <Card.Body className={clsx(style.cardBody)}>
        <Card.Title className={clsx(style.cardTitle)}>
          Recipient
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

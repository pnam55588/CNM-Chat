import clsx from "clsx";
import React, { useEffect } from "react";
import style from "./receivingContent.module.scss";
import { Image } from "react-bootstrap";
import moment from "moment";

export default function ReceivingContent({ data, sender }) {
  const senderName= sender.name
  return (
    <div className={clsx(style.receivingContent)}>
      <div className={clsx(style.name)}>{senderName.charAt(0).toUpperCase()}</div>
      <div className={clsx(style.content)}>
        <p>{data.text}</p>
        <p>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

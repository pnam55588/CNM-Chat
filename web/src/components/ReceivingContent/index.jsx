import clsx from "clsx";
import React from "react";
import style from "./receivingContent.module.scss";
import { Image } from "react-bootstrap";
import moment from "moment";

export default function ReceivingContent({data}) {
  return (
    <div className={clsx(style.receivingContent)}>
      <Image
        className={clsx(style.contentImg)}
        src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
      />
      <div className={clsx(style.content)}>
        <p>
          {data.text}
        </p>
        <p>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

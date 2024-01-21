import clsx from "clsx";
import React from "react";
import style from "./receivingContent.module.scss";
import { Image } from "react-bootstrap";

export default function ReceivingContent() {
  return (
    <div className={clsx(style.receivingContent)}>
      <Image
        className={clsx(style.contentImg)}
        src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
      />
      <div className={clsx(style.content)}>
        <p>
          dfsdf sdfsdf dsf sdf sfs dfsd fsd fdsf dsf dsfds fsdf dsf sdfsd
          fsdfdsf sdfwet sefsdg dfsd fsfdsfsdfsd fsdfwef sfdf đsfdsfset f dfsdfs
          dsfds
        </p>
        <p>Time</p>
      </div>
    </div>
  );
}

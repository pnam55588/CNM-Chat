import clsx from "clsx";
import React, { useEffect } from "react";
import style from "./receivingContent.module.scss";
import { Image } from "react-bootstrap";
import moment from "moment";
import { FaFileAlt, FaFileVideo } from "react-icons/fa";

export default function ReceivingContent({ data, sender }) {
  const senderName = sender.name;
  return (
    <div className={clsx(style.receivingContent)}>
      <div className={clsx(style.name)}>
        {senderName.charAt(0).toUpperCase()}
      </div>
      <div className={clsx(style.content)}>
        <p>{data?.text}</p>
        {data?.images.map((item, index) => (
          <Image className={clsx(style.imgSend)} src={item} key={index} />
        ))}
        {data.file ? (
          <div className={clsx(style.fileWrap)}>
            <FaFileAlt />
            <a href={data.file}>{data.file}</a>
          </div>
        ) : null}
        {data.video ? (
          <div className={clsx(style.fileWrap)}>
            <FaFileVideo />
            <a href={data.video}>{data.video}</a>
          </div>
        ) : null}
        <p className={clsx(style.time)}>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

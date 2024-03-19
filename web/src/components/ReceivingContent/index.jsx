import clsx from "clsx";
import React, { useEffect } from "react";
import style from "./receivingContent.module.scss";
import { Image } from "react-bootstrap";
import moment from "moment";
import { FaFileAlt, FaFileVideo } from "react-icons/fa";

export default function ReceivingContent({ data, sender }) {
  const senderName = sender.name;
  const KEY = "AIzaSyC3r4cYivNbIducKrIS_ebFyZDTKrb5DrA";
  return (
    <div className={clsx(style.receivingContent)}>
      <div className={clsx(style.name)}>
        {senderName.charAt(0).toUpperCase()}
      </div>
      <div className={clsx(style.content)}>
        <p>{data?.text}</p>
        <div className={clsx(style.grid_container, data.images?.length>=2? style.more2:'')}>
          {data.images?.map((item, index) => (
            <div key={index} className={clsx(style.grid_item)}>
              <Image src={item} alt={`Image ${index}`} />
            </div>
          ))}
        </div>
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
        {
          data.location ? (
            <iframe src={`https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${data.location.latitude},${data.location.longitude}`}></iframe>
          ):null
        }
        <p className={clsx(style.time)}>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

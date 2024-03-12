import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./sendingContent.module.scss";
import moment from "moment";
import { Image } from "react-bootstrap";
import { FaFileAlt, FaFileVideo } from "react-icons/fa";

export default function SendingContent({ data }) {
  const [fileStyle, setFileStyle] = useState("");
  const KEY = "AIzaSyC3r4cYivNbIducKrIS_ebFyZDTKrb5DrA";
  useEffect(() => {
    if (data.file) {
      const storeName = data.file.substring(
        data.file.lastIndexOf("."),
        data.file.length
      );
      setFileStyle(storeName);
    }
  }, [data.file]);
  return (
    <div className={clsx(style.sendingContent)}>
      <div className={clsx(style.content)}>
        <p>{data.text}</p>
        <div className={clsx(style.grid_container, data.images?.length>=2? style.more2:'')}>
          {data.images?.map((item, index) => (
            <div key={index} className={clsx(style.grid_item)}>
              <Image src={item} alt={`Image ${index}`} />
            </div>
          ))}
        </div>
        {data.video ? (
          <div className={clsx(style.file)}>
            <a className={clsx(style.linkFile)} href={data.video}>
              {data.video}
            </a>
            <FaFileVideo />
          </div>
        ) : null}
        {data.file ? (
          <div className={clsx(style.file)}>
            <a className={clsx(style.linkFile)} href={data.file}>
              {data.file}
            </a>
            <FaFileAlt />
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

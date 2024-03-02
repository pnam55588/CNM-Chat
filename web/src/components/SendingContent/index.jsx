import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./sendingContent.module.scss";
import moment from "moment";
import { Image } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";

export default function SendingContent({ data }) {
  const [fileStyle, setFileStyle] = useState("");
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
        {data.images
          ? data.images.map((item, index) => (
              <Image className={clsx(style.imgSend)} src={item} key={index} />
            ))
          : null}
        {data.file ? (
          <div className={clsx(style.file)}>
            <a className={clsx(style.linkFile)} href={data.file}>
              {data.file}
            </a>
            <FaFileAlt />
          </div>
        ) : null}
        <p className={clsx(style.time)}>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

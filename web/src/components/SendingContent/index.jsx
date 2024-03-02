import clsx from "clsx";
import React from "react";
import style from "./sendingContent.module.scss";
import moment from "moment";
import { Image } from "react-bootstrap";

export default function SendingContent({ data }) {
  return (
    <div className={clsx(style.sendingContent)}>
      <div className={clsx(style.content)}>
        <p>{data.text}</p>
        {
          // data?.images.map((item,index)=>(
          //   <Image className={clsx(style.imgSend)} src={item} key={index}/>
          // ))
          data.images
            ? data.images.map((item, index) => (
                <Image className={clsx(style.imgSend)} src={item} key={index} />
              ))
            : null
        }
        <p className={clsx(style.time)}>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

import clsx from "clsx";
import React from "react";
import style from "./sendingContent.module.scss";
import moment from "moment";

export default function SendingContent({ data }) {
  return (
    <div className={clsx(style.sendingContent)}>
      <p>{data.text}</p>
      <p>{moment(data.createdAt).calendar()}</p>
    </div>
  );
}

import clsx from "clsx";
import React from "react";
import style from "./chatInfo.module.scss";
import { Accordion } from "react-bootstrap";
import { TbPhoto } from "react-icons/tb";
import { MdPhotoCameraFront } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";

export default function ChatInfo() {
  return (
    <div className={clsx(style.chatinfo)}>
      <h2>Chat Info</h2>
      <Accordion className={clsx(style.Accordion)}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span>
              <TbPhoto size={35} /> Photos
            </span>
          </Accordion.Header>
          <Accordion.Body>Photos</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <span>
              <MdPhotoCameraFront size={35} /> Videos
            </span>
          </Accordion.Header>
          <Accordion.Body>Videos</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <span>
              <FaFileLines size={35}/> Files
            </span>
          </Accordion.Header>
          <Accordion.Body>Files</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

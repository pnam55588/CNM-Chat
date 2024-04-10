import clsx from "clsx";
import React, { useState } from "react";
import style from "./receivingContent.module.scss";
import { Dropdown, Image } from "react-bootstrap";
import moment from "moment";
import { FaFileAlt } from "react-icons/fa";
import ModalImage from "../../View/Modal/ModalImage";
import { postApiWithToken } from "../../API";
import { removeMessageSocket } from "../../Utils/socket";
import { useSelector, useDispatch } from "react-redux";
import { getUserStorage } from "../../Utils";
import { getCurrentMessage } from "../../features/Message/messageSlice";


export default function ReceivingContent({ data, sender }) {
  const senderName = sender.name;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const KEY = "AIzaSyC3r4cYivNbIducKrIS_ebFyZDTKrb5DrA";
  const dispatch = useDispatch();
  const selectedConversation = useSelector( state => state.conversationReducer.selectedConversation);
  const showImage = (imageUrl) => {
    const imageContent = <Image src={imageUrl } alt="Image" style={{width:'100%'}}/>;
    setModalContent(imageContent);
    setIsModalOpen(true);
  };
  const showVideo = (videoUrl) => {
    const videoContent = <video controls width={460}><source src={videoUrl} type="video/mp4" /></video>;
    setModalContent(videoContent);
    setIsModalOpen(true);
  };
  return (
    <div className={clsx(style.receivingContent)}>
      <ModalImage 
        modalContent={modalContent}
        show={isModalOpen}
        onHide={()=>setIsModalOpen(false)}
      />
      <div className={clsx(style.name)}>
        {senderName.charAt(0).toUpperCase()}
      </div>
      <div className={clsx(style.content)}>
        <p>{data?.text}</p>
        <div
          className={clsx(
            style.grid_container,
            data.images?.length >= 2 ? style.more2 : ""
          )}
        >
          {data.images?.map((item, index) => (
            <div key={index} className={clsx(style.grid_item)}>
              <Image src={item} alt={`Image ${index}`} onClick={()=>showImage(item)}/>
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
          <div className={clsx(style.fileWrap)} onClick={()=>showVideo(data.video)}>
            <video controls >
              <source 
                src={data.video}
                type="video/mp4"
              />
            </video>
          </div>
        ) : null}
        {data.location ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${data.location.latitude},${data.location.longitude}`}
          ></iframe>
        ) : null}
        <p className={clsx(style.time)}>{moment(data.createdAt).calendar()}</p>
      </div>
    </div>
  );
}

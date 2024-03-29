import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./chatInfo.module.scss";
import { Accordion, Button, Col, Container, Image, Row } from "react-bootstrap";
import { TbPhoto } from "react-icons/tb";
import { MdGroups, MdPhotoCameraFront } from "react-icons/md";
import { FaFileLines, FaFileVideo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { LuUserPlus2 } from "react-icons/lu";
import ModalAddMembers from "../../View/Modal/ModalAddMembers";
import { getUserStorage } from "../../Utils";
import { RiChatDeleteFill } from "react-icons/ri";
import { deleteApiWithToken } from "../../API";
import Swal from "sweetalert2";
import {
  getAllConversations,
  selectConversation,
} from "../../features/Conversations/conversationsSlice";

export default function ChatInfo(props) {
  const [members, setMembers] = useState([]);
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);

  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );
  useEffect(() => {
    if (selectedConversation.isGroup) {
      setMembers(selectedConversation.users);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (currentMessage) {
      const file = [];
      const video = [];
      const image = [];
      currentMessage.map((item) => {
        if (item?.file) {
          file.push(item.file);
        } else if (item?.video) {
          video.push(item.video);
        } else if (item?.images) {
          item.images?.map((img) => {
            image.push(img);
          });
        }
      });
      setFiles(file);
      setVideo(video);
      setImages(image);
    }
  }, [currentMessage]);

  const handleDeleteConversation = async () => {
    try {
      const result = await deleteApiWithToken(
        `/conversation/deleteConversation/${selectedConversation._id}`
      );
      if (result.status === 200) {
        await dispatch(getAllConversations(getUserStorage().user._id));
        await dispatch(selectConversation(null));
        props.onHide();
        Swal.fire({
          icon: "success",
          text: result.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <Accordion.Body
            id="scroll-style-01"
            className={clsx(style.accordionBoby)}
          >
            <div className={clsx(style.grid_container)}>
              {images?.map((item, index) => (
                <div key={index} className={clsx(style.grid_item)}>
                  <Image src={item} alt={`Image ${index}`} />
                </div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <span>
              <MdPhotoCameraFront size={35} /> Videos
            </span>
          </Accordion.Header>
          <Accordion.Body
            id="scroll-style-01"
            className={clsx(style.accordionBoby)}
          >
            <div className={clsx(style.grid_container_video)}>
              {video?.map((item, index) => (
                <div key={index} className={clsx(style.grid_item)}>
                  <video controls>
                    <source src={item} type="video/mp4"></source>
                  </video>
                </div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <span>
              <FaFileLines size={35} /> Files
            </span>
          </Accordion.Header>
          <Accordion.Body
            id="scroll-style-01"
            className={clsx(style.accordionBoby)}
          >
            {files?.map((item, index) => (
              <div key={index} className={clsx(style.linkWrap)}>
                <FaFileAlt />
                <a href={item}>{item}</a>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
        {selectedConversation.isGroup ? (
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <span>
                <MdGroups size={35} /> Members
              </span>
            </Accordion.Header>
            <Accordion.Body
              id="scroll-style-01"
              className={clsx(style.accordionBoby)}
            >
              <Button
                className={clsx(style.addMembers)}
                onClick={() => setOpenAddMembers(true)}
              >
                <LuUserPlus2 size={30} /> Add Members
              </Button>
              {members?.map((item, index) => (
                <div className={clsx(style.cardF)} key={index}>
                  <Image
                    className={clsx(style.cardImgF)}
                    src={
                      item.avatar
                        ? item.avatar
                        : "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                    }
                  />
                  <p>{item.name}</p>
                  {item._id === selectedConversation?.admin ? (
                    <p className={clsx(style.admin)}>(Admin)</p>
                  ) : null}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
      </Accordion>
      {selectedConversation.isGroup &&
      selectedConversation.admin !== getUserStorage().user._id ? (
        <span className={clsx(style.leaveGroup)}>
          <FaSignOutAlt size={25} />
          Leave group
        </span>
      ) : selectedConversation.isGroup &&
        selectedConversation.admin === getUserStorage().user._id ? (
        <span
          className={clsx(style.leaveGroup)}
          onClick={() => handleDeleteConversation()}
        >
          <RiChatDeleteFill size={25} />
          Delete group
        </span>
      ) : null}
      <ModalAddMembers
        show={openAddMembers}
        onHide={() => setOpenAddMembers(false)}
        members={members}
        conversationId={selectedConversation._id}
        handleNotiAddMember={props.handleNotiAddMember}
      />
    </div>
  );
}

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./chatInfo.module.scss";
import { Accordion, Button, Dropdown, Image } from "react-bootstrap";
import { TbPhoto } from "react-icons/tb";
import { MdCameraAlt, MdGroups, MdPhotoCameraFront } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { LuUserPlus2 } from "react-icons/lu";
import ModalAddMembers from "../../View/Modal/ModalAddMembers";
import { getUserStorage } from "../../Utils";
import { RiChatDeleteFill } from "react-icons/ri";
import {
  deleteApiWithToken,
  postApiWithToken,
  putApiWithToken,
} from "../../API";
import Swal from "sweetalert2";
import {
  getAllConversations,
  selectConversation,
} from "../../features/Conversations/conversationsSlice";
import { updateGroup } from "../../Utils/socket";
import ModalChandeGroupName from "../../View/Modal/ModalChangeGroupName";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <TfiLayoutMenuSeparated />
  </a>
));

export default function ChatInfo(props) {
  const [members, setMembers] = useState([]);
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);
  const [openChangeImg, setOpenChangeImg] = useState(false);

  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const currentMessage = useSelector(
    (state) => state.messageReducer.currentMessage
  );
  const isAdmin = selectedConversation?.admin === getUserStorage().user._id;
  useEffect(() => {
    if (selectedConversation?.isGroup) {
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
        Swal.fire({
          icon: "success",
          text: "Delete group success",
        });
        updateGroup(
          result.data,
          selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = async (value) => {
    try {
      const dt = {
        conversationId: selectedConversation._id,
        userId: value,
        adminId: getUserStorage().user._id,
      };
      const result = await putApiWithToken("/conversation/removeMember", dt);
      if (result.status === 200) {
        await dispatch(selectConversation(result.data));
        Swal.fire({
          icon: "success",
          text: "Remove member success",
        });
        updateGroup(
          result.data,
          selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAdmin = async (id) =>{
    try {
      const dt = {
        conversationId: selectedConversation._id,
        adminId: selectedConversation.admin,
        userId: id
      }
      const result = await putApiWithToken("/conversation/changeGroupAdmin", dt)
      if(result.status===200){
        await dispatch(selectConversation(result.data));
        Swal.fire({
          icon:'success',
          title: "Change admin success"
        })
        updateGroup(
          result.data,
          selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOutGroup = async () => {
    try {
      const dt = {
        conversationId: selectedConversation._id,
        userId: getUserStorage().user._id,
      };
      const result = await postApiWithToken("/conversation/outGroup", dt);
      if (result.status === 200) {
        await dispatch(getAllConversations(getUserStorage().user._id));
        await dispatch(selectConversation(null));
        Swal.fire({
          icon: "success",
          text: "Out group success",
        });
        updateGroup(
          result.data,
          selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id)
        );
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error.response.data,
      });
    }
  };

  return (
    <div className={clsx(style.chatinfo)}>
      <h2>Chat Info</h2>
      {selectedConversation?.isGroup ? (
        <div className={style.imageWrap}>
          <Image
            className={style.imageGroup}
            src={
              selectedConversation.image
                ? selectedConversation.image
                : "https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png"
            }
          />
          <Button
            className={style.btnCamera}
            onClick={() => setOpenChangeImg(true)}
          >
            <MdCameraAlt size={25} />
          </Button>
        </div>
      ) : null}
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
        {selectedConversation?.isGroup ? (
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
                <div className={style.cardWrap}>
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
                    ) : item._id === getUserStorage().user._id ? (
                      <p className={clsx(style.admin)}>(Me)</p>
                    ) : null}
                  </div>
                  {isAdmin && item._id !== selectedConversation?.admin ? (
                    // <IoMdClose onClick={() => handleRemoveMember(item._id)} />
                    <Dropdown className={style.menu}>
                      <Dropdown.Toggle as={CustomToggle} />
                      <Dropdown.Menu size="sm" title="">
                        <Dropdown.Item
                          onClick={() => handleRemoveMember(item._id)}
                        >
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item onClick={()=>handleChangeAdmin(item._id)}>Change admin</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : null}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ) : null}
      </Accordion>
      {selectedConversation?.isGroup &&
      selectedConversation.admin !== getUserStorage().user._id ? (
        <span
          className={clsx(style.leaveGroup)}
          onClick={() => handleOutGroup()}
        >
          <FaSignOutAlt size={25} />
          Leave group
        </span>
      ) : selectedConversation?.isGroup &&
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
        conversation={selectedConversation}
        handleNotiAddMember={props.handleNotiAddMember}
      />
      <ModalChandeGroupName
        show={openChangeImg}
        onHide={() => setOpenChangeImg(false)}
        changeGroupImage={true}
        imageGroup={selectedConversation.image}
        conversationId={selectedConversation._id}
      />
    </div>
  );
}

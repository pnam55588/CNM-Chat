import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./sendingContent.module.scss";
import moment from "moment";
import { Dropdown, Image } from "react-bootstrap";
import { FaFileAlt, FaFileVideo } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import ModalImage from "../../View/Modal/ModalImage";
import { postApiWithToken } from "../../API";
import { removeMessageSocket } from "../../Utils/socket";
import { useSelector, useDispatch } from "react-redux";
import { getUserStorage } from "../../Utils";
import { getCurrentMessage } from "../../features/Message/messageSlice";

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
    <CiMenuKebab />
  </a>
));

export default function SendingContent({ data }) {
  const [fileStyle, setFileStyle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const dispatch = useDispatch();
  const KEY = "AIzaSyC3r4cYivNbIducKrIS_ebFyZDTKrb5DrA";

  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );

  useEffect(() => {
    if (data.file) {
      const storeName = data.file.substring(
        data.file.lastIndexOf("."),
        data.file.length
      );
      setFileStyle(storeName);
    }
  }, [data.file]);
  const showImage = (imageUrl) => {
    const imageContent = (
      <Image src={imageUrl} alt="Image" style={{ width: "100%" }} />
    );
    setModalContent(imageContent);
    setIsModalOpen(true);
  };
  const showVideo = (videoUrl) => {
    const videoContent = <video controls width={460}><source src={videoUrl} type="video/mp4" /></video>;
    setModalContent(videoContent);
    setIsModalOpen(true);
  };
  const handleRemoveMess = async () => {
    try {
      const result = await postApiWithToken(
        `/conversation/removeMessage/${data._id}`
      );
      if (result.status === 200) {
        dispatch(getCurrentMessage(selectedConversation._id))
        removeMessageSocket({
          ...data,
          receiverIds: selectedConversation.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={clsx(style.sendingContent)}>
      <ModalImage
        modalContent={modalContent}
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      />
      <div className={clsx(style.content)}>
        <p>{data.text}</p>
        <div
          className={clsx(
            style.grid_container,
            data.images?.length >= 2 ? style.more2 : ""
          )}
        >
          {data.images?.map((item, index) => (
            <div key={index} className={clsx(style.grid_item)}>
              <Image
                src={item}
                alt={`Image ${index}`}
                onClick={() => showImage(item)}
              />
            </div>
          ))}
        </div>
        {data.video ? (
          <div className={clsx(style.file)} onClick={()=>showVideo(data.video)}>
            <video controls>
              <source src={data.video} type="video/mp4" />
            </video>
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
        {data.location ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${KEY}&q=${data.location.latitude},${data.location.longitude}`}
          ></iframe>
        ) : null}
        <p className={clsx(style.time)}>{moment(data.createdAt).calendar()}</p>
      </div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} />
        <Dropdown.Menu size="sm" title="">
          <Dropdown.Item onClick={() => handleRemoveMess()}>
            Delete message
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

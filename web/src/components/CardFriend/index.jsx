import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import style from "./cardFriend.module.scss";
import { getApiWithToken, postApiWithToken } from "../../API";
import { CiMenuKebab } from "react-icons/ci";
import ModalOtherUser from "../../View/Modal/ModalOtherUser";
import { getUserStorage } from "../../Utils";
import { useDispatch, useSelector } from "react-redux";
import { getBlocks } from "../../features/User/userSlice";
import Swal from "sweetalert2";
import { selectMenu } from "../../features/Menu/menuSlice";
import { getAllConversations } from "../../features/Conversations/conversationsSlice";
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

export default function CardFriend({ data, tab }) {
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const dispatch = useDispatch();
  const blocked = useSelector((state) => state.userReducer.blocked);

  const handleBlock = async () => {
    const dt = {
      senderId: getUserStorage().user._id,
      receiverId: data,
    };
    const result = await postApiWithToken("/users/block", dt);
    if (result.status === 200) {
      await dispatch(getBlocks(`/users/${getUserStorage().user._id}`));
      Swal.fire({
        text: "Blocked this user.",
      });
    }
  };

  const handleUnBlock = async () => {
    const dt = {
      senderId: getUserStorage().user._id,
      receiverId: data,
    };
    const result = await postApiWithToken("/users/unblock", dt);
    if (result.status === 200) {
      await dispatch(getBlocks(`/users/${getUserStorage().user._id}`));
      Swal.fire({
        text: "Unblocked this user. You can text normally.",
      });
    }
  };

  const handeleCreateconversation = async () => {
    const dt = {
      userId: getUserStorage().user._id,
      recipientId: data,
    };
    try {
      
      const result = await postApiWithToken("/conversation/createConversation", dt);
      if(result.status===200){
        await dispatch(getAllConversations(getUserStorage().user._id))
        await dispatch(selectMenu('allChats'))
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getApiWithToken(`/users/${data}`);
      setUser(result.data);
    };
    fetchData();
  }, []);
  return (
    <div className={clsx(style.cardF)}>
      <div
        className={clsx(style.wrap)}
        onClick={() => handeleCreateconversation()}
      >
        <Image
          className={clsx(style.cardImgF)}
          src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
        />
        <span>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </span>
      </div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} />
        <Dropdown.Menu size="sm" title="">
          <Dropdown.Item onClick={() => setShow(true)}>Profile</Dropdown.Item>
          {!blocked?.includes(data) ? (
            <Dropdown.Item onClick={() => handleBlock()}>Block</Dropdown.Item>
          ) : (
            <Dropdown.Item onClick={() => handleUnBlock()}>
              UnBlock
            </Dropdown.Item>
          )}
          <Dropdown.Item>Delete friendship</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ModalOtherUser show={show} onHide={handleClose} user={user} />
    </div>
  );
}

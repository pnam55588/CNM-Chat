import clsx from "clsx";
import React, { useState } from "react";
import style from "./cardUser.module.scss";
import { Button, Image } from "react-bootstrap";
import { getUserStorage } from "../../Utils";
import { postApiWithToken } from "../../API";
import Swal from "sweetalert2";
import {useSelector} from 'react-redux'

export default function CardUser({ data }) {
  const [textButton, setTextButton] = useState("Invitation");
  const currentFriends = useSelector(state => state.userReducer.contacts)

  const handleInvitation = (receiverId) => {
    const senderId = getUserStorage().user._id;
    let data = {
      senderId: senderId,
      receiverId: receiverId,
    };
    postApiWithToken("/users/addFriend", data)
      .then((result) => {
        if (result.status === 200) {
          Swal.fire({
            icon: "success",
            text: result.data,
          });
          setTextButton('Cancel')
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        Swal.fire({
          icon: "error",
          text: err.response.data,
        });
      });
  };
  return (
    <div className={clsx(style.cardUser)}>
      <span>
        <Image
          className={clsx(style.cardUserImg)}
          src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
        />
        <div className={clsx(style.cardUserInf)}>
          <p>{data.name}</p>
          <p>{data.email}</p>
        </div>
      </span>
      {!currentFriends?.some((f) => f._id === data._id) ? (
        <Button onClick={() => handleInvitation(data._id)}>{textButton}</Button>
      ) : null}
    </div>
  );
}

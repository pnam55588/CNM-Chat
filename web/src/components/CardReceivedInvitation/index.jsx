import clsx from "clsx";
import React, { useEffect, useState } from "react";
import style from "./cardReceived.module.scss";
import { Button, Image } from "react-bootstrap";
import { getApiWithToken, postApiWithToken } from "../../API";
import { getUserStorage } from "../../Utils";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getPenddingRequests } from "../../features/User/userSlice";

export default function CardReceivedInvitation({ data }) {
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  const handleAcceptFriend = async () => {
    const dt = {
      receiverId: getUserStorage().user._id,
      senderId: data,
    };
    try {
      const result = await postApiWithToken("/users/acceptFriend", dt);
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: result.data,
        });
        try {
          await dispatch(
            getPenddingRequests(`/users/${getUserStorage().user._id}`)
          );
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectFriend = async () => {
    const dt = {
      receiverId: getUserStorage().user._id,
      senderId: user._id,
    };
    try {
      const result = await postApiWithToken("/users/rejectFriend", dt);
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: result.data,
        });
        try {
          await dispatch(
            getPenddingRequests(`/users/${getUserStorage().user._id}`)
          );
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getApiWithToken(`/users/${data}`);
        setUser(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  return (
    <div className={clsx(style.receivedCard)}>
      <span>
        <Image
          className={clsx(style.cardUserImg)}
          src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
        />
        <div className={clsx(style.cardUserInf)}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      </span>
      <div className={clsx(style.btngroup)}>
        <Button onClick={() => handleAcceptFriend()}>Agree</Button>
        <Button onClick={() => handleRejectFriend()}>Rejected</Button>
      </div>
    </div>
  );
}

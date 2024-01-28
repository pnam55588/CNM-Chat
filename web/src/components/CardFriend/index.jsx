import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import style from "./cardFriend.module.scss";
import { getApiWithToken } from "../../API";

export default function CardFriend({ data }) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const result = await getApiWithToken(`/users/${data}`);
      setUser(result.data);
    };
    fetchData();
  }, []);
  return (
    <div className={clsx(style.cardF)}>
      <Image
        className={clsx(style.cardImgF)}
        src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
      />
      <span>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </span>
    </div>
  );
}

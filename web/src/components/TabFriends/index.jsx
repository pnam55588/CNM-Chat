import clsx from "clsx";
import React from "react";
import style from "./tabFriends.module.scss";
import { PiUserList } from "react-icons/pi";
import { IoMailOpen } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { selectTab } from "../../features/Menu/menuSlice";

export default function TabFriends() {
  const tabActive = useSelector((state) => state.menuActive.tab);
  const dispatch = useDispatch();
  return (
    <div className={clsx(style.tabFriends)}>
      <span
        className={clsx(tabActive === "friendList" ? style.active : "")}
        onClick={() => {
          dispatch(selectTab("friendList"));
        }}
      >
        <PiUserList size={50} />
        Friend List
      </span>
      <span
        className={clsx(tabActive === "invitation" ? style.active : "")}
        onClick={() => {
          dispatch(selectTab("invitation"));
        }}
      >
        <IoMailOpen size={50} />
        Friendship invitation
      </span>
    </div>
  );
}

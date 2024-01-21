import React from "react";
import clsx from "clsx";
import style from "./layoutChat.module.scss";
import MenuMain from "../../components/MenuMain";
import Search from "../../components/Search";
import { useSelector } from "react-redux";
import CardChat from "../../components/CardChat";
import TabFriends from "../../components/TabFriends";
import Chat from "../../View/Chat";
import Friends from "../../View/Friends";
import Invitation from "../../View/Invitation";

export default function LayoutChat() {
  const menuActive = useSelector((state) => state.menuActive.active);
  const tabActive = useSelector((state) => state.menuActive.tab);
  return (
    <div className={clsx(style.mainWrap)}>
      <div className={clsx(style.menuWrap)}>
        <MenuMain />
      </div>
      <div className={clsx(style.chatWrap)}>
        <div className={clsx(style.tabMenu)}>
          <Search />
          <div id="scroll-style-01" className={clsx(style.listTab)}>
            {menuActive === "allChats" ? (
              <>
                <CardChat />
                <CardChat />
                <CardChat />
                <CardChat />
                <CardChat />
                <CardChat />
                <CardChat />
                <CardChat />
                <CardChat />
              </>
            ) : (
              <TabFriends />
            )}
          </div>
        </div>
        <div className={clsx(style.screenMain)}>
          {menuActive === "allChats" ? (
            <Chat />
          ) : menuActive === "friends" && tabActive === "friendList" ? (
            <Friends/>
          ) : (
            <Invitation/>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import clsx from "clsx";
import style from "./layoutChat.module.scss";
import MenuMain from "../../components/MenuMain";
import Search from "../../components/Search";
import { useSelector, useDispatch } from "react-redux";
import CardChat from "../../components/CardChat";
import TabFriends from "../../components/TabFriends";
import Chat from "../../View/Chat";
import Friends from "../../View/Friends";
import Invitation from "../../View/Invitation";
import { getUserStorage } from "../../Utils";
import {
  getMessageSocket,
  getUsersOnline,
  initiateSocket,
  socket,
} from "../../Utils/socket";
import { getAllConversations } from "../../features/Conversations/conversationsSlice";
import { handleGetUsersOnline } from "../../features/User/userSlice";
import { handleSetCurrentMessage } from "../../features/Message/messageSlice";

export default function LayoutChat() {
  const menuActive = useSelector((state) => state.menuActive.active);
  const tabActive = useSelector((state) => state.menuActive.tab);
  const allConversations = useSelector(
    (state) => state.conversationReducer.allConversation
  );
  const dispatch = useDispatch();
  const user = getUserStorage().user;

  useEffect(() => {
    if (!socket) {
      initiateSocket(user._id);
    }
  }, [user._id]);

  useEffect(() => {
    getUsersOnline()
      .then((result) => {
        dispatch(handleGetUsersOnline(result));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [socket]);

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    try {
      await dispatch(
        getAllConversations(`/conversation/getConversations/${user._id}`)
      );
    } catch (error) {
      console.log(error);
    }
  };

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
                {allConversations?.map((item, index) => (
                  <CardChat key={index} data={item} />
                ))}
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
            <Friends />
          ) : (
            <Invitation />
          )}
        </div>
      </div>
    </div>
  );
}

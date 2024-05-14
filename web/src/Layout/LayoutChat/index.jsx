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
import { initiateSocket, socket } from "../../Utils/socket";
import {
  getAllConversations,
  handleNewConversation,
  selectConversation,
  setNotification,
} from "../../features/Conversations/conversationsSlice";
import {
  getBlocks,
  getContacts,
  handleGetUsersOnline,
} from "../../features/User/userSlice";
import {
  getCurrentMessage,
  handleSetCurrentMessage,
} from "../../features/Message/messageSlice";

export default function LayoutChat() {
  const menuActive = useSelector((state) => state.menuActive.active);
  const tabActive = useSelector((state) => state.menuActive.tab);
  const allConversations = useSelector(
    (state) => state.conversationReducer.allConversation
  );
  const selectedConversation = useSelector(
    (state) => state.conversationReducer.selectedConversation
  );
  const dispatch = useDispatch();
  const user = getUserStorage().user;

  useEffect(() => {
    if (user._id) {
      initiateSocket(user._id);
    }
  }, [user._id]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("receiveMessage", (res) => {
      dispatch(handleSetCurrentMessage(res));
    });
    socket.on("usersOnline", (res) => {
      dispatch(handleGetUsersOnline(res));
    });
    socket.on("receiveNewConversation", (res) => {
      dispatch(handleNewConversation(res));
    });
    socket.on("receiveRemoveMessage", (res) => {
      dispatch(getCurrentMessage(res.conversationId))
    });
    socket.on("receiveUpdateGroup", (res)=>{
      getConversations();
      dispatch(selectConversation(res.conversation))
      dispatch(setNotification(res.message))
    })
    socket.on("receiveNewGroup", res =>{
      getConversations()
      dispatch(handleNewConversation(res))
    })
    getConversations();
    getAllContacts();
    getBlocked();
    return () => {
      socket.off("receiveMessage");
      socket.off("usersOnline");
      socket.off("receiveNewConversation");
      socket.off("receiveRemoveMessage");
      socket.off("receiveUpdateGroup")
      socket.off("receiveNewGroup")
    };
  }, [socket]);

  const getConversations = async () => {
    try {
      await dispatch(getAllConversations(user._id));
    } catch (error) {
      console.log(error);
    }
  };

  const getAllContacts = async () => {
    try {
      await dispatch(getContacts(getUserStorage().user._id));
    } catch (error) {
      console.log(error);
    }
  };

  const getBlocked = async () => {
    try {
      await dispatch(getBlocks(`/users/${getUserStorage().user._id}`));
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

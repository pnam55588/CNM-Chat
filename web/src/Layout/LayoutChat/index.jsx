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
  disconnectSocket,
  // getMessageSocket,
  getReceiveNewConverstionsocket,
  // getUsersOnline,
  initiateSocket,
  socket,
} from "../../Utils/socket";
import {
  getAllConversations,
  handleNewConversation,
} from "../../features/Conversations/conversationsSlice";
import {
  getBlocks,
  getContacts,
  handleGetUsersOnline,
} from "../../features/User/userSlice";
import { handleSetCurrentMessage } from "../../features/Message/messageSlice";

export default function LayoutChat() {
  const menuActive = useSelector((state) => state.menuActive.active);
  const tabActive = useSelector((state) => state.menuActive.tab);
  const usersOnline = useSelector((state) => state.userReducer.usersOnline);
  const allConversations = useSelector(
    (state) => state.conversationReducer.allConversation
  );
  const dispatch = useDispatch();
  const user = getUserStorage().user;

  useEffect(() => {
    if (user._id) {
      initiateSocket(user._id);
      // handleUsersOnline();
      // handleGetMessageSocket();
      handleNewConverstionsocket();
    }
  }, [user._id]);

  // const handleUsersOnline = async () => {
  //   await getUsersOnline()
  //     .then((result) => {
  //       dispatch(handleGetUsersOnline(result));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  const handleNewConverstionsocket = async () => {
    await getReceiveNewConverstionsocket()
      .then((result) => {
        dispatch(handleNewConversation(result));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const handleGetMessageSocket = async () => {
  //   await getMessageSocket()
  //     .then((result) => {
  //       dispatch(handleSetCurrentMessage(result));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    socket.on("receiveMessage", (res) => {
      dispatch(handleSetCurrentMessage(res));
    });
    socket.on("usersOnline", (res) => {
      dispatch(handleGetUsersOnline(res));
    });
    getConversations();
    getAllContacts();
    getBlocked();
  }, []);

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

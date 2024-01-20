import React from 'react'
import clsx from 'clsx'
import style from './layoutChat.module.scss'
import MenuMain from '../../components/MenuMain';
import Search from '../../components/Search';
import { useSelector } from 'react-redux';
import CardChat from '../../components/CardChat';
import TabFriends from '../../components/TabFriends';
import Chat from '../../View/Chat';

export default function LayoutChat() {
  const menuActive = useSelector((state) => state.menuActive.active);
  return (
    <div className={clsx(style.mainWrap)}>
      <div className={clsx(style.menuWrap)}>
        <MenuMain/>
      </div>
      <div className={clsx(style.chatWrap)}>
        <div className={clsx(style.tabMenu)}>
          <Search/>
          <div className={clsx(style.listTab)}>
            {
              menuActive==='allChats'?(
                <>
                <CardChat/>
                <CardChat/>
                <CardChat/>
                </>
              ):(<TabFriends/>)
            }
          </div>
        </div>
        <div className={clsx(style.screenMain)}>
          <Chat/>
        </div>
      </div>
    </div>
  )
}

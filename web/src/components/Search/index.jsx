import React, { useState } from "react";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LuUserPlus2 } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import clsx from "clsx";
import style from "./search.module.scss";
import ModalAddFriend from "../../View/Modal/ModalAddFriend";
import ModalNewGroup from "../../View/Modal/ModalNewGroup";

export default function Search() {
  const [addF, setAddF] = useState(false)
  const [newGroup, setNewGroup] = useState(false)

  return (
    <>
    <div className={clsx(style.search)}>
      <InputGroup className={clsx(style.searchWrap)}>
        <InputGroup.Text className={clsx(style.searchIcon)} id="basic-addon1">
          <CiSearch size={25} />
        </InputGroup.Text>
        <Form.Control
          className={clsx(style.searchInput)}
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 250 }}
        overlay={<Tooltip id="button-tooltip">Add Friend</Tooltip>}
      >
        <div className={clsx(style.overlayTriggerContainer)}>
          <LuUserPlus2 size={30} onClick={()=>setAddF(!addF)}/>
        </div>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip id="button-tooltip">New Group</Tooltip>}
      >
        <div className={clsx(style.overlayTriggerContainer)}>
          <AiOutlineUsergroupAdd size={30} onClick={()=>setNewGroup(!newGroup)}/>
        </div>
      </OverlayTrigger>
    </div>
    <ModalAddFriend show={addF} onHide={() => setAddF(false)} />
    <ModalNewGroup show={newGroup} onHide={() => setNewGroup(false)}/>
    </>
  );
}

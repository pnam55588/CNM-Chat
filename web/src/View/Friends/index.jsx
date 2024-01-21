import clsx from "clsx";
import React from "react";
import style from "./friends.module.scss";
import { PiUserList } from "react-icons/pi";
import { Form, Image, InputGroup } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";

export default function Friends() {
  return (
    <div className={clsx(style.friends)}>
      <div className={clsx(style.tabTop)}>
        <span>
          <PiUserList size={50} />
          Friend List
        </span>
      </div>
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
        <Form.Select
          className={clsx(style.selectWrap)}
          aria-label="Default select example"
        >
          <option value="2">
            Two
          </option>
          <option value="3">Three</option>
        </Form.Select>
      </div>
      <div id="scroll-style-01" className={clsx(style.list)}>
        <div className={clsx(style.cardF)}>
            <Image className={clsx(style.cardImgF)} src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"/>
            <p>Name</p>
        </div>
        <div className={clsx(style.cardF)}>
            <Image className={clsx(style.cardImgF)} src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"/>
            <p>Name</p>
        </div>
      </div>
    </div>
  );
}

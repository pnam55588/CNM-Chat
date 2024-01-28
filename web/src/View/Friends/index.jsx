import clsx from "clsx";
import React, { useEffect } from "react";
import style from "./friends.module.scss";
import { PiUserList } from "react-icons/pi";
import { Form, Image, InputGroup } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { getContacts } from "../../features/User/userSlice";
import { getUserStorage } from "../../Utils";
import CardFriend from "../../components/CardFriend";

export default function Friends() {
  const contacts = useSelector((state) => state.userReducer.contacts);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getContacts(`/users/${getUserStorage().user._id}`));
    };
    fetchData()
  }, []);
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
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      </div>
      <div id="scroll-style-01" className={clsx(style.list)}>
        {contacts?.map((item, index) => (
          <CardFriend data={item} key={index}/>
        ))}
      </div>
    </div>
  );
}

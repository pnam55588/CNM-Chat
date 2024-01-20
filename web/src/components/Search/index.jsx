import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { LuUserPlus2 } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import clsx from "clsx";
import style from "./search.module.scss";

export default function Search() {
  return (
    <div className={clsx(style.search)}>
      <InputGroup className={clsx(style.searchWrap)}>
        <InputGroup.Text className={clsx(style.searchIcon)} id="basic-addon1">
          <CiSearch size={25}/>
        </InputGroup.Text>
        <Form.Control
          className={clsx(style.searchInput)}
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
      <LuUserPlus2 size={30} />
      <AiOutlineUsergroupAdd size={30} />
    </div>
  );
}

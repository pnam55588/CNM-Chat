import clsx from "clsx";
import React from "react";
import { Form, Image, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { LuUserPlus2 } from "react-icons/lu";
import style from "./modalAddFriend.module.scss";
import CardUser from "../../../components/CardUser";
import { CiSearch } from "react-icons/ci";

export default function ModalAddFriend(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: "none", paddingBottom: 0 }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <LuUserPlus2 size={30} />
          Add Friend
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={clsx(style.body)}>
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
        <div id="scroll-style-01" className={clsx(style.list)}>
          <div className={clsx(style.cardWrap)}>
            <CardUser/>
            <Button>Invitation</Button>
          </div>
          <div className={clsx(style.cardWrap)}>
            <CardUser/>
            <Button>Invitation</Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

import clsx from "clsx";
import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import style from "./modalOtherUser.module.scss";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdBlock } from "react-icons/md";

export default function ModalOtherUser(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        className={clsx(style.modalHeader)}
      ></Modal.Header>
      <Modal.Body className={clsx(style.modalBody)}>
        <span>
          <Image
            className={clsx(style.modalImg)}
            src={
              "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
            }
          />
        </span>
        <div className={clsx(style.profile)}>
          <p>
            <strong>Profile</strong>
          </p>
          <p>{props.user.name}</p>
          <p>{props.user.email}</p>
        </div>
        <div className={clsx(style.grpButton)}>
          <p><MdBlock size={30}/>{" "}Block messages from this person.</p>
          <p><RiDeleteBinLine size={30}/>{" "}Deleted from your friends list.</p>
        </div>
      </Modal.Body>
      <Modal.Footer className={clsx(style.modalBody)}>
        <Button>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

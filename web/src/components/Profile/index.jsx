import React, { useRef, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import clsx from "clsx";
import style from "./profile.module.scss";
import { MdCameraAlt } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

export default function Profile(props) {
  const inputFileReference = useRef(null);
  const [urlImage, setUrlImage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const uploadImage = async () => {
    const selectedFile = inputFileReference.current.files[0];
    const url = URL.createObjectURL(selectedFile);
    await setUrlImage(url);
  };
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
              urlImage
                ? urlImage
                : "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
            }
          />
          <Button
            onClick={() => {
              inputFileReference.current.click();
            }}
            onChange={() => uploadImage()}
          >
            <MdCameraAlt size={25} />
            <input type="file" hidden ref={inputFileReference} />
          </Button>
        </span>
        <Form.Control
          id="inputText-02"
          type="text"
          placeholder="User Name"
          disabled={!isUpdate}
        />
        <Form.Control
          id="inputText-02"
          type="text"
          placeholder="Email"
          disabled={!isUpdate}
        />
      </Modal.Body>
      <Modal.Footer className={clsx(style.modalBody)}>
        {!isUpdate ? (
          <Button
            onClick={() => {
              setIsUpdate(!isUpdate);
            }}
          >
            <CiEdit size={30} /> Update
          </Button>
        ) : (
          <div className={clsx(style.btnGroup)}>
            <Button>Update</Button>
            <Button
              onClick={() => {
                setIsUpdate(!isUpdate);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

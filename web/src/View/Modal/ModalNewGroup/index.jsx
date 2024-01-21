import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdCameraAlt } from "react-icons/md";
import style from "./modalNewGroup.module.scss";
import { IoMdClose } from "react-icons/io";

export default function ModalNewGroup(props) {
  const inputFileReference = useRef(null);
  const [urlImage, setUrlImage] = useState("");
  const uploadImage = async () => {
    const selectedFile = inputFileReference.current.files[0];
    const url = URL.createObjectURL(selectedFile);
    await setUrlImage(url);
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: "none", paddingBottom: 0 }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <AiOutlineUsergroupAdd size={30} />
          New Group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={clsx(style.groupWrap)}>
        <div className="d-flex w-100">
          <Button
            onClick={() => {
              inputFileReference.current.click();
            }}
            onChange={() => uploadImage()}
          >
            {urlImage ? (
              <Image
                className={clsx(style.image)}
                src={urlImage ? urlImage : ""}
              />
            ) : (
              <MdCameraAlt size={40} />
            )}
            <input type="file" hidden ref={inputFileReference} />
          </Button>
          <Form.Control placeholder="Enter group name ..."></Form.Control>
        </div>
        <div className={clsx(style.list)}>
          <Row>
            <Col id="scroll-style-01" style={{overflow:'auto',height:'30rem'}} lg={6} md={6}>
              <div className={clsx(style.cardF)}>
                <Form.Check // prettier-ignore
                  type="checkbox"
                />
                <Image
                  className={clsx(style.cardImgF)}
                  src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                />
                <p>Name</p>
              </div>
              <div className={clsx(style.cardF)}>
                <Form.Check // prettier-ignore
                  type="checkbox"
                />
                <Image
                  className={clsx(style.cardImgF)}
                  src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                />
                <p>Name</p>
              </div>
            </Col>
            <Col id="scroll-style-01" style={{overflow:'auto'}} lg={6} md={6} className={clsx(style.selectWrap)}>
              <div className={clsx(style.cardF)}>
                <span>
                  <Image
                    className={clsx(style.cardImgF)}
                    src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                  />
                  <p>Name</p>
                </span>
                <IoMdClose />
              </div>
              <div className={clsx(style.cardF)}>
                <span>
                  <Image
                    className={clsx(style.cardImgF)}
                    src="https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                  />
                  <p>Name</p>
                </span>
                <IoMdClose />
              </div>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className={clsx(style.modalFooter)}>
        <Button onClick={props.onHide}>Cancel</Button>
        <Button>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}

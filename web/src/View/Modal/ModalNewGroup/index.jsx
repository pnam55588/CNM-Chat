import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdCameraAlt } from "react-icons/md";
import style from "./modalNewGroup.module.scss";
import { IoMdClose } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { postApiWithToken } from "../../../API";
import { getUserStorage } from "../../../Utils";
import {
  getAllConversations,
  selectConversation,
} from "../../../features/Conversations/conversationsSlice";
import { selectMenu } from "../../../features/Menu/menuSlice";
import Swal from "sweetalert2";

export default function ModalNewGroup(props) {
  const inputFileReference = useRef(null);
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.userReducer.contacts);
  const [urlImage, setUrlImage] = useState("");
  const [inputNameGroup, setInputNameGroup] = useState("");
  const [selectContacts, setSelectContacts] = useState([]);

  const uploadImage = async () => {
    const selectedFile = inputFileReference.current.files[0];
    const url = URL.createObjectURL(selectedFile);
    await setUrlImage(url);
  };

  const handleSelectContacts = (item) => {
    if (selectContacts.includes(item)) {
      const update = selectContacts.filter((i) => i !== item);
      setSelectContacts(update);
    } else {
      setSelectContacts([...selectContacts, item]);
    }
  };

  const handleNewGroup = async () => {
    try {
      const dt = {
        adminId: getUserStorage().user._id,
        groupName: inputNameGroup,
        userIds: selectContacts,
      };
      const result = await postApiWithToken("/conversation/createGroup", dt);
      if (result.status === 200) {
        await dispatch(getAllConversations(getUserStorage().user._id));
        await dispatch(selectMenu("allChats"));
        await dispatch(selectConversation(result.data._id));
        props.onHide();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon:'error',
        text: error.response.data
      })
    }
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
        <div className="d-flex align-items-center w-100">
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
          <Form.Control
            id="inputText-02"
            name="groupName"
            value={inputNameGroup}
            onChange={(e) => setInputNameGroup(e.target.value)}
            placeholder="Enter group name ..."
          ></Form.Control>
        </div>
        <div className={clsx(style.list)}>
          <Row>
            <Col
              id="scroll-style-01"
              style={{ overflow: "auto", height: "30rem" }}
              lg={6}
              md={6}
            >
              {contacts?.map((item, index) => (
                <div
                  className={clsx(style.cardF)}
                  key={index}
                  onClick={() => handleSelectContacts(item)}
                >
                  <Form.Check // prettier-ignore
                    type="checkbox"
                    id={`checkbox-${item._id}`}
                    checked={selectContacts.includes(item)}
                  />
                  <Image
                    className={clsx(style.cardImgF)}
                    src={
                      item.avatar
                        ? item.avatar
                        : "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                    }
                  />
                  <p>{item.name}</p>
                </div>
              ))}
            </Col>
            <Col
              id="scroll-style-01"
              style={{ overflow: "auto" }}
              lg={6}
              md={6}
              className={clsx(style.selectWrap)}
            >
              {selectContacts?.map((item, index) => (
                <div className={clsx(style.cardF)} key={index}>
                  <span>
                    <Image
                      className={clsx(style.cardImgF)}
                      src={
                        item.avatar
                          ? item.avatar
                          : "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                      }
                    />
                    <p>{item.name}</p>
                  </span>
                  <IoMdClose
                    onClick={() => {
                      const update = selectContacts.filter((i) => i !== item);
                      setSelectContacts(update);
                    }}
                  />
                </div>
              ))}
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className={clsx(style.modalFooter)}>
        <Button
          onClick={() => {
            props.onHide();
            setSelectContacts([]);
          }}
          id="buttonStyle2"
        >
          Cancel
        </Button>
        <Button
          disabled={
            (inputNameGroup.trim().length === 0 && selectContacts.length < 2)
              ? "disabled"
              : ""
          }
          onClick={() => handleNewGroup()}
          id="buttonStyle1"
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

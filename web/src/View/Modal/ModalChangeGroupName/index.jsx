import React, { useRef, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { putApiWithToken } from "../../../API";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  getAllConversations,
  selectConversation,
} from "../../../features/Conversations/conversationsSlice";
import { getUserStorage } from "../../../Utils";
import { updateGroup } from "../../../Utils/socket";
import style from "./modalChangeGroupName.module.scss";

export default function ModalChandeGroupName(props) {
  const inputFileReference = useRef(null);
  const [urlImage, setUrlImage] = useState();
  const [inputAvatar, setInputAvatar] = useState();
  const [inputNameGroup, setInputNameGroup] = useState(props.groupName);
  const dispatch = useDispatch();

  const uploadImage = async () => {
    const selectedFile = inputFileReference.current.files[0];
    setInputAvatar(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    await setUrlImage(url);
  };
  const handleChangeGroupName = async () => {
    try {
      const dt = {
        conversationId: props.conversationId,
        name: inputNameGroup,
      };
      const result = await putApiWithToken(`/conversation/changeGroupName`, dt);
      if (result.status === 200) {
        if (result.status === 200) {
          await dispatch(selectConversation(result.data));
          await dispatch(getAllConversations(getUserStorage().user._id));
          updateGroup(
            result.data,
            result.data.users
              .filter((user) => user._id !== getUserStorage().user._id)
              .map((user) => user._id)
          );
          props.onHide();
          Swal.fire({
            icon: "success",
            text: "Change group name success",
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        text: error.response.data,
      });
    }
  };
  const handleChangeGroupImage = async () => {
    const dt = new FormData();
    dt.append("file", inputAvatar);
    try {
      const result = await putApiWithToken(
        `/conversation/changeGroupImage/${props?.conversationId}`,
        dt
      );
      if (result.status === 200) {
        if (result.status === 200) {
          await dispatch(selectConversation(result.data));
          await dispatch(getAllConversations(getUserStorage().user._id));
          updateGroup(
            result.data,
            result.data.users
              .filter((user) => user._id !== getUserStorage().user._id)
              .map((user) => user._id)
          );
          props.onHide();
          Swal.fire({
            icon: "success",
            text: "Change group name success",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          <CiEdit size={30} />
          {props?.changeGroupImage ? "Change Group Image" : "Change Group Name"}
        </Modal.Title>
      </Modal.Header>
      {!props?.changeGroupImage ? (
        <>
          <Modal.Body className="d-flex justify-content-center ">
            <Form.Control
              id="inputText-02"
              name="groupName"
              value={inputNameGroup}
              onChange={(e) => setInputNameGroup(e.target.value)}
            ></Form.Control>
          </Modal.Body>
          <Modal.Footer>
            <Button id="buttonStyle2" onClick={() => props.onHide()}>
              Cancel
            </Button>
            <Button onClick={() => handleChangeGroupName()} id="buttonStyle1">
              Update
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Body className={style.wrap}>
            <Image
              className={style.modalImg_2}
              src={
                urlImage ||
                props.imageGroup ||
                "https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png"
              }
            />
            <Button
              onClick={() => {
                inputFileReference.current.click();
              }}
              onChange={() => uploadImage()}
              className={style.btnUpload}
            >
              Upload images from your computer
              <input
                type="file"
                accept="image/jpeg, image/png"
                hidden
                ref={inputFileReference}
              />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button id="buttonStyle2" onClick={() => props.onHide()}>
              Cancel
            </Button>
            <Button id="buttonStyle1" onClick={() => handleChangeGroupImage()}>
              Update
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

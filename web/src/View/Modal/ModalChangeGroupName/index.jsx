import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { getApiWithToken, putApiWithToken } from "../../../API";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getAllConversations, selectConversation } from "../../../features/Conversations/conversationsSlice";
import { getUserStorage } from "../../../Utils";

export default function ModalChandeGroupName(props) {
  const [inputNameGroup, setInputNameGroup] = useState(props.groupName);
  const dispatch = useDispatch();
  const handleChangeGroupName = async () => {
    try {
      const dt = {
        conversationId: props.conversationId,
        name: inputNameGroup,
      };
      const result = await putApiWithToken(`/conversation/changeGroupName`, dt);
      if (result.status === 200) {
        const result1 = await getApiWithToken(
          `/conversation/${props.conversationId}`
        );
        if (result1.status === 200) {
          await dispatch(selectConversation(result1.data));
          await dispatch(getAllConversations(getUserStorage().user._id))
          props.onHide();
          Swal.fire({
            icon: "success",
            text: result.data,
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
          Change Group Name
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
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
    </Modal>
  );
}

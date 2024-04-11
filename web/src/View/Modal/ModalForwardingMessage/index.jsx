import React, { useState } from "react";
import { Button, Form, Modal, Image } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import CardShare from "../../../components/CardShare";
import { postApiWithToken } from "../../../API";
import {
  getRecipient,
  selectConversation,
} from "../../../features/Conversations/conversationsSlice";
import { sendMessageSocket } from "../../../Utils/socket";
import { getUserStorage } from "../../../Utils";
import { getCurrentMessage } from "../../../features/Message/messageSlice";
import { FaFileAlt } from "react-icons/fa";

export default function ModalForwardingMessage(props) {
  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);
  const [userRecipient_id, setUserRecipient_id] = useState(null);
  const allConversations = useSelector(
    (state) => state.conversationReducer.allConversation
  );
  const handleSelectContacts = (item) => {
    setSelect(item);
  };
  const handleForwardingMess = async () => {
    try {
      const dt = {
        message: {
          conversationId: props.shareContent.conversationId,
          user: getUserStorage().user,
          text: props.shareContent.text || null,
          images: props.shareContent.images || null,
          video: props.shareContent.video || null,
          file: props.shareContent.file || null,
          location: props.shareContent.location || null,
        },
        conversationForwardId: select._id,
      };
      const result = await postApiWithToken(`/conversation/forwardMessage`, dt);
      if (result.status === 200) {
        await dispatch(selectConversation(select));
        await dispatch(getRecipient(`/users/${userRecipient_id}`));
        await dispatch(getCurrentMessage(select._id));
        sendMessageSocket({
          ...{
            conversationId: props.shareContent.conversationId,
            user: getUserStorage().user,
            text: props.shareContent.text || null,
            images: props.shareContent.images || null,
            video: props.shareContent.video || null,
            file: props.shareContent.file || null,
            location: props.shareContent.location || null,
          },
          receiverIds: select.users
            .filter((user) => user._id !== getUserStorage().user._id)
            .map((user) => user._id),
        });
        props.onHide();
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
        <Modal.Title id="contained-modal-title-vcenter">
          Share message
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          id="scroll-style-01"
          style={{
            height: "20rem",
            overflow: "auto",
          }}
        >
          {allConversations?.map((item, index) => (
            <CardShare
              key={index}
              data={item}
              handleSelectContacts={handleSelectContacts}
              select={select}
              setUserRecipient_id={setUserRecipient_id}
            />
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid black",
            padding: "2%",
            marginTop: "5%",
          }}
        >
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>
              <strong>Shared Content</strong>
            </Form.Label>
            {props.shareContent.text ? (
              <Form.Control
                as="textarea"
                rows={2}
                value={props.shareContent?.text}
                disabled
              />
            ) : props.shareContent.images.length > 0 ? (
              <div
                id="scroll-style-01"
                style={{ widows: "100%", overflow: "auto" }}
              >
                {props.shareContent.images.map((item, index) => (
                  <Image
                    style={{
                      height: "100px",
                      width: "100px",
                      marginRight: "5px",
                    }}
                    key={index}
                    src={item}
                  />
                ))}
              </div>
            ) : props.shareContent.video ? (
              <video
                style={{
                  height: "100px",
                  width: "100%",
                }}
                controls
              >
                <source src={props.shareContent.video} type="video/mp4" />
              </video>
            ) : props.shareContent.file ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaFileAlt size={90} />
                <a
                  style={{ fontSize: "14px", padding: "0 4%" }}
                  href={props.shareContent.file}
                >
                  {props.shareContent.file}
                </a>
              </div>
            ) : null}
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.onHide();
            setSelect({});
          }}
          id="buttonStyle2"
        >
          Cancel
        </Button>
        <Button
          disabled={!select ? "disabled" : ""}
          onClick={() => handleForwardingMess()}
          id="buttonStyle1"
        >
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

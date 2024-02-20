import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import style from "./modalAddMembers.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { getApiWithToken, putApiWithToken } from "../../../API";
import Swal from "sweetalert2";
import { selectConversation } from "../../../features/Conversations/conversationsSlice";

export default function ModalAddMembers(props) {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.userReducer.contacts);
  const [selectContacts, setSelectContacts] = useState([]);
  const [listRender, setListRender] = useState([]);

  const handleSelectContacts = (item) => {
    if (selectContacts.includes(item)) {
      const update = selectContacts.filter((i) => i !== item);
      setSelectContacts(update);
    } else {
      setSelectContacts([...selectContacts, item]);
    }
  };

  const handleAddMembers = async () => {
    const dt = {
      conversationId: props.conversationId,
      userIds: selectContacts,
    };
    try {
      const result = await putApiWithToken("/conversation/addMembers", dt);
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          text: result.data,
        });
        try {
          const rs = await getApiWithToken(
            `/conversation/${props.conversationId}`
          );
          if (rs.status === 200) {
            await dispatch(selectConversation(rs.data));
            props.onHide();
          }
          selectContacts.map(contact => {
            props.handleNotiAddMember(`${contact.name} is invited to the group`);
            return null;
          });
        } catch (error) {
          console.log(error);
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

  useEffect(() => {
    if (props.show) {
      const fetchData = async () => {
        const rs = contacts?.filter(
          (item) => !props.members.find((item2) => item._id === item2._id)
        );
        setListRender(rs);
      };
      fetchData();
    }
  }, [props.show]);
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton style={{ border: "none", paddingBottom: 0 }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <AiOutlineUsergroupAdd size={30} />
          Add Members
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={clsx(style.groupWrap)}>
        <div className="d-flex align-items-center w-100">search</div>
        <div className={clsx(style.list)}>
          <Row>
            <Col
              id="scroll-style-01"
              style={{ overflow: "auto", height: "30rem" }}
              lg={12}
              md={12}
            >
              {listRender?.map((item, index) => (
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
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className={clsx(style.modalFooter)}>
        <Button
          onClick={() => {
            props.onHide();
            setSelectContacts([]);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={selectContacts.length < 1 ? "disabled" : ""}
          onClick={() => handleAddMembers()}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

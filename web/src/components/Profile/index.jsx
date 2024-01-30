import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import clsx from "clsx";
import style from "./profile.module.scss";
import { MdCameraAlt } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { getUserStorage } from "../../Utils";
import { putApiWithToken } from "../../API";

export default function Profile(props) {
  const inputFileReference = useRef(null);
  const [urlImage, setUrlImage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [user, setUser] = useState(getUserStorage().user);

  const [inputName, setInputName] = useState("");
  const [inputGender, setInputGender] = useState(user.gender);
  const [inputDoB,setInputDoB] = useState("")
  const [inputPW,setInputPW] = useState("")

  const uploadImage = async () => {
    const selectedFile = inputFileReference.current.files[0];
    const url = URL.createObjectURL(selectedFile);
    await setUrlImage(url);
  };

  const handleUpdateInfo = async () => {
    const data = {
      name: inputName,
      gender: inputGender,
      dateOfBirth: inputDoB,
      password: inputPW
    };
    const result = await putApiWithToken(
      `/users/${getUserStorage().user._id}`,
      data
    );
    if (result.status === 200) {
      setUser(result.data);
    }
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
            disabled={!isUpdate}
          >
            <MdCameraAlt size={25} />
            <input type="file" hidden ref={inputFileReference} />
          </Button>
        </span>
        <Form.Control
          id="inputText-02"
          type="text"
          placeholder="Name"
          disabled={!isUpdate}
          value={user.name}
          onChange={(e) => setInputName(e.target.value)}
        />
        <Form.Control
          id="inputText-02"
          type="date"
          placeholder="Date of Birth"
          disabled={!isUpdate}
          value={user.dateOfBirth}
          onChange={(e) => setInputDoB(e.target.value)}
        />
        <Form.Group>
          <Form.Check
            inline
            label="Female"
            name="gender"
            type={"radio"}
            value={"female"}
            disabled={!isUpdate}
            defaultChecked={user.gender==="female"}
            onSelect={(e)=>setInputGender(e.target.value)}
          />
          <Form.Check
            inline
            label="Male"
            name="gender"
            type={"radio"}
            value={"male"}
            disabled={!isUpdate}
            defaultChecked={user.gender==="male"}
            onSelect={(e)=>setInputGender(e.target.value)}
          />
        </Form.Group>
        <Form.Control
          id="inputText-02"
          type="password"
          placeholder="Password"
          disabled={!isUpdate}
          value={user.password}
          onChange={(e) => setInputPW(e.target.value)}
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
            <Button onClick={() => handleUpdateInfo()}>Update</Button>
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

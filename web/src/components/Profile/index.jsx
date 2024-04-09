import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import clsx from "clsx";
import style from "./profile.module.scss";
import { MdCameraAlt } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { checkPassword, getUserStorage } from "../../Utils";
import { getApiWithToken, postApiWithToken, putApiWithToken } from "../../API";
import Swal from "sweetalert2";
import moment from "moment";

export default function Profile(props) {
  const inputFileReference = useRef(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);
  const [isChangePW, setIsChangePW] = useState(false);

  const [user, setUser] = useState();
  const [urlImage, setUrlImage] = useState();
  const [inputName, setInputName] = useState();
  const [inputGender, setInputGender] = useState();
  const [inputDoB, setInputDoB] = useState();
  const [inputAvatar, setInputAvatar] = useState();
  const [newPW, setNewPW] = useState();
  const [oldPW, setOldPW] = useState()

  const uploadImage = async () => {
    const selectedFile = inputFileReference.current.files[0];
    setInputAvatar(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    await setUrlImage(url);
  };

  const handleUpdateInfo = async () => {
    const data = {
      name: inputName,
      gender: inputGender,
      dateOfBirth: moment(inputDoB).format("YYYY-MM-DD"),
    };
    try {
      const result = await putApiWithToken(
        `/users/${getUserStorage().user._id}`,
        data
      );
      if (result.status === 200) {
        setUser(result.data);
        setIsUpdate(!isUpdate);
        Swal.fire({
          icon: "success",
          text: "Successfully updated user information",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlechangePassword = async () => {
    if (checkPassword(newPW)) {
      const data = {
        oldPassword: oldPW,
        newPassword: newPW,
      };
      try {
        const result = await putApiWithToken(
          `/users/changePassword/${getUserStorage().user._id}`,
          data
        );
        if (result.status === 200) {
          setUser(result.data);
          setIsChangePW(false);
          setIsUpdate(false);
          Swal.fire({
            icon: "success",
            text: "Successfully change password",
          });
          window.location.href='/chat-app/login'
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon:'error',
          title: error.response
        })
      }
    } else {
      Swal.fire({
        icon: "warning",
        title:
          "Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and no special characters.",
      });
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append("file", inputAvatar);
      const result = await postApiWithToken(
        `/users/uploadAvatar/${user._id}`,
        formData
      );
      setUser(result.data);
      setIsUpdate(false);
      setIsUpdateAvatar(false);
      Swal.fire({
        icon: "success",
        text: "Successfully updated avatar information",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.show]);
  const fetchData = async () => {
    try {
      const result = await getApiWithToken(
        `/users/${getUserStorage().user._id}`
      );
      if (result.status === 200) {
        setUser(result.data);
        setInputName(result.data.name);
        setInputDoB(result.data.dateOfBirth);
        setInputGender(result.data.gender);
        setUrlImage(result.data?.avatar);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenderChange = (e) => {
    setInputGender(e.target.value);
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
      {!isUpdateAvatar && !isChangePW ? (
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
              // onClick={() => {
              //   inputFileReference.current.click();
              // }}
              // onChange={() => uploadImage()}
              onClick={() => setIsUpdateAvatar(!isUpdateAvatar)}
              disabled={isUpdate ? "" : "disabled"}
            >
              <MdCameraAlt size={25} />
            </Button>
          </span>
          <Form.Control
            id="inputText-02"
            type="text"
            placeholder="Name"
            name="name"
            disabled={isUpdate ? "" : "disabled"}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <Form.Group className="mb-4">
            <Form.Check
              inline
              label="Female"
              name="gender"
              type={"radio"}
              value={"female"}
              disabled={isUpdate ? "" : "disabled"}
              defaultChecked={inputGender === "female"}
              onChange={handleGenderChange}
            />
            <Form.Check
              inline
              label="Male"
              name="gender"
              type={"radio"}
              value={"male"}
              disabled={isUpdate ? "" : "disabled"}
              defaultChecked={inputGender === "male"}
              onChange={handleGenderChange}
            />
          </Form.Group>
          <Form.Control
            id="inputText-02"
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            disabled={isUpdate ? "" : "disabled"}
            value={moment(inputDoB).format("YYYY-MM-DD")}
            onChange={(e) => setInputDoB(e.target.value)}
          />
          <span
            className={style.changePW}
            onClick={() => {
              setIsChangePW(true);
              setInputAvatar(false);
            }}
          >
            Change Password
          </span>
        </Modal.Body>
      ) : isUpdateAvatar && !isChangePW ? (
        <Modal.Body className={clsx(style.modalBody)}>
          <Image
            className={clsx(style.modalImg_2)}
            src={
              urlImage
                ? urlImage
                : "https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
            }
          />
          <Button
            className={clsx(style.btnUpload)}
            onClick={() => {
              inputFileReference.current.click();
            }}
            onChange={() => uploadImage()}
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
      ) : isChangePW && !isUpdateAvatar ? (
        <div className={style.modalBody}>
          <h5 className="m-3">Change Password</h5>
          <Form.Label style={{ float: "left", width: "90%" }}>
            Old Password
          </Form.Label>
          <Form.Control
            id="inputText-02"
            type="password"
            placeholder="Old password"
            name="Old password"
            value={oldPW}
            onChange={(e)=>setOldPW(e.target.value)}
          />
          <Form.Label style={{ float: "left", width: "90%" }}>
            New Password
          </Form.Label>
          <Form.Control
            id="inputText-02"
            type="password"
            placeholder="New password"
            name="New password"
            value={newPW}
            onChange={(e) => setNewPW(e.target.value)}
          />
        </div>
      ) : null}

      <Modal.Footer className={clsx(style.modalFooter)}>
        {!isUpdate && !isChangePW ? (
          <Button
            onClick={() => {
              setIsUpdate(!isUpdate);
            }}
          >
            <CiEdit size={30} /> Update
          </Button>
        ) : isUpdate && !isChangePW ? (
          <div className={clsx(style.btnGroup)}>
            {isUpdateAvatar ? (
              <Button
                id="buttonStyle1"
                className="with-fit-content"
                onClick={() => handleUpdateAvatar()}
              >
                Update Avatar
              </Button>
            ) : (
              <Button id="buttonStyle1" onClick={() => handleUpdateInfo()}>
                Update
              </Button>
            )}
            <Button
              onClick={() => {
                setIsUpdate(false);
                setIsUpdateAvatar(false);
                setIsChangePW(false);
                setUrlImage(user.avatar);
              }}
              id="buttonStyle2"
            >
              Cancel
            </Button>
          </div>
        ) : isChangePW ? (
          <div className={clsx(style.btnGroup)}>
            <Button
              id="buttonStyle2"
              onClick={() => {
                setIsUpdate(false);
                setIsUpdateAvatar(false);
                setIsChangePW(false);
              }}
            >
              Cancel
            </Button>
            <Button id="buttonStyle1" onClick={() => handlechangePassword()}>
              Change Password
            </Button>
          </div>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}

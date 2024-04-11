import clsx from "clsx";
import React, { useState } from "react";
import { Form, InputGroup, Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { LuUserPlus2 } from "react-icons/lu";
import style from "./modalAddFriend.module.scss";
import CardUserSearch from "../../../components/CardUserSearch";
import { CiSearch } from "react-icons/ci";
import { getApiWithToken } from "../../../API";
import { checkPhoneValid } from "../../../Utils";
import Swal from "sweetalert2";
import search from "./../../../image/search.jpg";

export default function ModalAddFriend(props) {
  const [inputSearch, setInputSearch] = useState("");
  const [listSearch, setListSearch] = useState([]);

  const handleSearch = () => {
    if (checkPhoneValid(inputSearch)) {
      getApiWithToken(`/users/search?phone=${inputSearch}`)
        .then((result) => {
          setListSearch(result.data);
        })
        .catch((err) => {
          console.log(err);
          setListSearch([]);
          Swal.fire({
            icon: "warning",
            title: err.response.data,
          });
        });
    } else {
      getApiWithToken(`/users/search?name=${inputSearch}`)
        .then((result) => {
          setListSearch(result.data);
        })
        .catch((err) => {
          console.log(err);
          setListSearch([]);
          Swal.fire({
            icon: "warning",
            title: err.response.data,
          });
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
      <Modal.Header closeButton style={{ border: "none", paddingBottom: 0 }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <LuUserPlus2 size={30} />
          Add Friend
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={clsx(style.body)}>
        <InputGroup className={clsx(style.searchWrap)}>
          <InputGroup.Text className={clsx(style.searchIcon)} id="basic-addon1">
            <CiSearch size={25} />
          </InputGroup.Text>
          <Form.Control
            className={clsx(style.searchInput)}
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            onChange={(e) => {
              setInputSearch(e.target.value);
            }}
          />
        </InputGroup>
        <div id="scroll-style-01" className={clsx(style.list)}>
          {listSearch.length > 0 ? (
            listSearch.map((item, index) => (
              <CardUserSearch key={index} data={item} />
            ))
          ) : (
            <Image style={{ width: "100%", height: "100%" }} src={search} />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button id="buttonStyle2" onClick={props.onHide}>
          Close
        </Button>
        <Button id="buttonStyle1" onClick={() => handleSearch()}>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function ModalAuth(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body style={{ textAlign: "center" }}>
        <h2>Enter OTP</h2>
        <Form.Control
          type="text"
          placeholder="OTP"
          onChange={(e) => props.setOtp(e.target.value)}
          style={{margin:'5% 0%'}}
        />
        <Button
          id="buttonStyle1"
          onClick={props.verifyOtp}
          style={{ marginTop: "10px" }}
        >
          Verify
        </Button>
      </Modal.Body>
    </Modal>
  );
}

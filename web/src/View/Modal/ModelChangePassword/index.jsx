import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function ModelChangePassword(props) {
  return (
    <Modal {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

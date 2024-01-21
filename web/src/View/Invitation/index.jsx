import clsx from "clsx";
import React, { useState } from "react";
import { IoMailOpen } from "react-icons/io5";
import style from "./invitation.module.scss";
import CardUser from "../../components/CardUser";
import { Button } from "react-bootstrap";

export default function Invitation() {
  const [tab, setTab] = useState("received");

  return (
    <div className={clsx(style.invitation)}>
      <div className={clsx(style.tabTop)}>
        <span>
          <IoMailOpen size={50} />
          Friendship invitation
        </span>
      </div>
      <div className={clsx(style.tabRequest)}>
        <div
          className={clsx(
            style.received,
            tab === "received" ? style.active : ""
          )}
          onClick={() => {
            setTab("received");
          }}
        >
          Invitation Received (02)
        </div>
        <div
          className={clsx(
            style.submitted,
            tab === "submitted" ? style.active : ""
          )}
          onClick={() => {
            setTab("submitted");
          }}
        >
          Invite Submitted (01)
        </div>
      </div>
      <div className={clsx(style.list)}>
        {tab === "received" ? (
          <div id="scroll-style-01" className={clsx(style.listReceived)}>
            <div className={clsx(style.receivedCard)}>
              <CardUser />
              <div className={clsx(style.btngroup)}>
                <Button>Agree</Button>
                <Button>Rejected</Button>
              </div>
            </div>
            <div className={clsx(style.receivedCard)}>
              <CardUser />
              <div className={clsx(style.btngroup)}>
                <Button>Agree</Button>
                <Button>Rejected</Button>
              </div>
            </div>
          </div>
        ) : (
          <div id="scroll-style-01" className={clsx(style.listReceived)}>
            <div className={clsx(style.receivedCard)}>
              <CardUser />
              <div className={clsx(style.btngroup)}>
                <Button>Cancel</Button>
              </div>
            </div>
            <div className={clsx(style.receivedCard)}>
              <CardUser />
              <div className={clsx(style.btngroup)}>
                <Button>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMailOpen } from "react-icons/io5";
import style from "./invitation.module.scss";
// import CardUser from "../../components/CardUser";
import { Button } from "react-bootstrap";
import CardReceivedInvitation from "../../components/CardReceivedInvitation";
import { useDispatch, useSelector } from "react-redux";
import { getUserStorage } from "../../Utils";
import { getPenddingRequests } from "../../features/User/userSlice";

export default function Invitation() {
  const [tab, setTab] = useState("received");
  const pendingRequests = useSelector(
    (state) => state.userReducer.pendingRequests
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const getPendding = async () => {
      try {
        await dispatch(
          getPenddingRequests(`/users/${getUserStorage().user._id}`)
        );
      } catch (error) {
        console.log(error);
      }
    };
    getPendding();
  }, []);
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
          Invitation Received (
          {pendingRequests?.length > 0 ? pendingRequests.length : 0})
        </div>
        {/* <div
          className={clsx(
            style.submitted,
            tab === "submitted" ? style.active : ""
          )}
          onClick={() => {
            setTab("submitted");
          }}
        >
          Invite Submitted (01)
        </div> */}
      </div>
      <div className={clsx(style.list)}>
        {tab === "received" ? (
          <div id="scroll-style-01" className={clsx(style.listReceived)}>
            {pendingRequests?.map((item, index) => (
              <CardReceivedInvitation key={index} data={item} />
            ))}
          </div>
        ) : (
          <div id="scroll-style-01" className={clsx(style.listReceived)}>
            <div className={clsx(style.receivedCard)}>
              {/* <CardUser /> */}
              <div className={clsx(style.btngroup)}>
                <Button>Cancel</Button>
              </div>
            </div>
            <div className={clsx(style.receivedCard)}>
              {/* <CardUser /> */}
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

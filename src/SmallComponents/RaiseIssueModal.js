import React, { useState } from "react";
import { Modal, Input, notification } from "antd";
import { TiTick } from "react-icons/ti";
import { raiseIssue } from "../Utility/raiseIssue";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

function RaiseIssueModal({ raiseIssueModal, setRaiseIssueModal }) {
  const [issueData, setIssueData] = useState("");

  const handleIssue = (text) => {
    setIssueData(text);
  };

  const handleOk = () => {
    setRaiseIssueModal(false);
  };

  const handleCancel = () => {
    setRaiseIssueModal(false);
  };

  const handleUpdate = () => {
    if (issueData) {
      setRaiseIssueModal(false);
      raiseIssue(issueData)
        .then((res) => {
          // console.log("HER", res);
          setIssueData("");
          if (res.statusText == "Saved") {
            notification.open({
              message: "Your Issue has been sent to the Admin!",
              icon: <TiTick style={{ fontSize: "1.5rem", color: "#4BB543" }} />,
            });
          } else {
            // console.log(res.data);
            notification.open({
              message: "Something went wrong.",
              icon: (
                <ExclamationCircleOutlined
                  style={{ fontSize: "1.5rem", color: "red" }}
                />
              ),
            });
          }
        })
        .catch((err) => {
          console.log(err);
          notification.open({
            message: "Something went wrong.",
            icon: (
              <ExclamationCircleOutlined
                style={{ fontSize: "1.5rem", color: "red" }}
              />
            ),
          });
        });
    } else {
      notification.open({
        message: "Issue cannot be empty.",
        icon: (
          <ExclamationCircleOutlined
            style={{ fontSize: "1.5rem", color: "red" }}
          />
        ),
      });
    }
  };

  return (
    <div>
      <Modal
        title="This message will be sent to the admin"
        visible={raiseIssueModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div className="footerctn" onClick={handleUpdate}>
            {" "}
            <div className="footerbtn"> Send </div>{" "}
          </div>,
        ]}
      >
        <TextArea
          rows={5}
          placeholder="Please write down the Issue"
          maxLength={300}
          onChange={(e) => handleIssue(e.target.value)}
          minLength={60}
        />
      </Modal>
    </div>
  );
}

export default RaiseIssueModal;

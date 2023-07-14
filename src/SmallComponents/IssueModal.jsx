import { Button, Input, Modal, notification } from "antd";
import { useState } from "react";
import "./IssueModal.css";
import { issueUpdate } from "../Utility/raiseIssue";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { TiTick } from "react-icons/ti";

const { TextArea } = Input;

const IssueModal = ({ issueModalOpen, setIssueModalOpen, id, fetchIssues }) => {
  const [feedback, setFeedback] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const handleUpdate = () => {
    setIssueModalOpen(false);
    issueUpdate(id, feedback)
      .then((res) => {
        // console.log(res);

        if (res.data.msg == "Updated") {
          api.open({
            message: "Issue Resolved.",

            icon: <TiTick style={{ fontSize: "1.5rem", color: "#4BB543" }} />,
          });

          setTimeout(() => {
            fetchIssues();
          }, 2000);
        } else {
          api.open({
            message: "Something went wrong!",

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
        api.open({
          message: "Something went wrong!",

          icon: (
            <ExclamationCircleOutlined
              style={{ fontSize: "1.5rem", color: "red" }}
            />
          ),
        });
      });
  };

  const handleCancel = () => {
    setIssueModalOpen(false);
  };
  return (
    <div>
      {contextHolder}
      <Modal
        title="Issue Feedback"
        visible={issueModalOpen}
        onOk={handleUpdate}
        onCancel={handleCancel}
        footer={[
          <div className="IssueModal__updateBTNCont">
            <div className="IssueModal__updateBTN" onClick={handleUpdate}>
              Resolve
            </div>
          </div>,
        ]}
      >
        <TextArea
          rows="5"
          placeholder="If any feedback you can type it here."
          onChange={(e) => setFeedback(e.target.value)}
        />
      </Modal>
    </div>
  );
};
export default IssueModal;

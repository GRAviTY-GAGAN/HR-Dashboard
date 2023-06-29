import React, { useEffect, useState } from "react";
import "./Issues.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import IssueModal from "../SmallComponents/IssueModal";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import { TiTick } from "react-icons/ti";
import issuesImage from "../assests/undraw_environmental_study_re_q4q8.svg";

const Issues = () => {
  const url =
    process.env.NODE_ENV == "development"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [pendingIssues, setPendingIssues] = useState([]);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issueID, setIssueID] = useState("");
  const [pendingClose, setPendingClose] = useState(false);
  const [resolveClose, setResolveClose] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((store) => store.newReducer.user);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchIssues();
  }, []);

  function fetchIssues() {
    axios
      .get(`${url}/employee/issues`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        // console.log(res);
        filterIssues(res.data.issues);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDeleteResolved() {
    axios
      .delete(`${url}/employee/issues`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.statusText == "Success") {
          fetchIssues();
          api.open({
            message: "Issues deleted successfully",
            // description:
            //   "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
            icon: (
              <TiTick
                style={{
                  color: "#4BB543",
                }}
              />
            ),
          });
        } else {
          api.open({
            message: "Something went wrong.",
            // description:
            //   'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            icon: (
              <ExclamationCircleFilled
                style={{
                  color: "red",
                }}
              />
            ),
          });
          // console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function filterIssues(data) {
    const pending = [];
    const resolved = [];
    data.forEach((issue) => {
      if (issue.status) {
        resolved.push(issue);
      } else {
        pending.push(issue);
      }
    });

    setPendingIssues([...pending]);
    setResolvedIssues([...resolved]);
  }

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "white",
      }}
      spin
    />
  );

  if (user.employeeType == 2) {
    return (
      <div className="Issues__mainCont">
        {contextHolder}
        {resolvedIssues.length > 0 && (
          <div className="Issues__ClearBtnCont">
            <button
              disabled={loading}
              onClick={() => handleDeleteResolved()}
              className="Issues__ClearBtn"
            >
              {loading ? (
                <Spin indicator={antIcon} />
              ) : (
                <div>
                  <DeleteOutlined style={{ fontSize: "20px" }} />
                  &nbsp;Delete Resolved Issues
                </div>
              )}
            </button>
          </div>
        )}
        <div>
          {pendingIssues.length > 0 && (
            <div>
              <div className="Issues__headingCont">
                <div className="Issues__heading">Pending Issues</div>
                {!pendingClose ? (
                  <div onClick={() => setPendingClose(true)}>
                    <CaretUpOutlined style={{ fontSize: "25px" }} />
                  </div>
                ) : (
                  <div onClick={() => setPendingClose(false)}>
                    <CaretDownOutlined style={{ fontSize: "25px" }} />
                  </div>
                )}
              </div>
              <div
                className={`Issues__pendingCont ${pendingClose ? "hide" : ""}`}
              >
                {pendingIssues?.map((issue) => {
                  return (
                    <div key={issue._id} className="Issues__issueCard">
                      <div className="Issues__issueCardSub">
                        <div className="Issue__IssueStatusFlex">
                          {/* <span className="Issue__statusName">Status : </span> */}
                          <span className="Issue__status ">
                            {issue.status ? "Resolved" : "Pending"}
                          </span>
                        </div>
                        <div>
                          <div className="Issue__IssueDesc">{issue.issue}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div>
          <div>
            {resolvedIssues.length > 0 && (
              <div>
                <div className="Issues__headingCont">
                  <div className="Issues__heading">Resolved Issues</div>
                  {!resolveClose ? (
                    <div onClick={() => setResolveClose(true)}>
                      <CaretUpOutlined style={{ fontSize: "25px" }} />
                    </div>
                  ) : (
                    <div onClick={() => setResolveClose(false)}>
                      <CaretDownOutlined style={{ fontSize: "25px" }} />
                    </div>
                  )}
                </div>
                <div
                  className={`Issues__resolveCont ${
                    resolveClose ? "hide" : ""
                  }`}
                >
                  {resolvedIssues?.map((issue) => {
                    return (
                      <div key={issue._id} className="Issues__issueCard">
                        <div className="Issues__issueCardSub">
                          <div className="Issue__IssueStatusFlex">
                            {/* <span className="Issue__statusName">Status : </span> */}
                            <span className="Issue__status resolved">
                              {issue.status ? "Resolved" : "Pending"}
                            </span>
                          </div>
                          <div>
                            <div className="Issue__IssueDesc">
                              <span className="Issue__spanHead">Issue : </span>
                              <span>{issue.issue}</span>
                            </div>
                            <div className="Issue__IssueDesc">
                              <span className="Issue__spanHead">
                                Feedback from HR :{" "}
                              </span>
                              <span>{issue?.feedback}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (user.employeeType == 1) {
    if (pendingIssues.length == 0) {
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1>No Issues Pending</h1>

            <img src={issuesImage} />
          </div>
        </div>
      );
    }

    return (
      <div className="Issues__mainCont">
        <div>
          {pendingIssues?.map((issue) => {
            return (
              <div key={issue._id} className="Issues__issueCard">
                <div className="Issues__issueCardSub">
                  <div>
                    {/* <span className="Issue__statusName">Status : </span> */}
                    <span className="Issue__status">
                      {issue.status ? "Resolved" : "Pending"}
                    </span>
                  </div>
                  <div className="Issue__IssueDesc">{issue.issue}</div>
                </div>
                <div className="Issues__FeedbackBtnCont">
                  <button
                    onClick={() => {
                      setIssueModalOpen(true);
                      setIssueID(issue._id);
                    }}
                    className="Issues__FeedbackBtn"
                  >
                    Feedback
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <IssueModal
            fetchIssues={fetchIssues}
            issueModalOpen={issueModalOpen}
            setIssueModalOpen={setIssueModalOpen}
            id={issueID}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "500px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
};

export default Issues;

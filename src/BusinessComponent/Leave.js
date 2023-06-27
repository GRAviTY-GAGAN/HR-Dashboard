import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../SmallComponents/Card";
import EmployeeLeave from "./Employee/EmployeeLeave";
import "./Leave.css";
import axios from "axios";
import { Spin } from "antd";

import emptyimg from "../assests/emptystateforleave.png";

const Leave = () => {
  const userObj = useSelector((state) => state.reducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const url =
    process.env.NODE_ENV == "developemnt"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const [stopSpinner, setStopSpinner] = useState(false);
  const [allrequest, setAllRequest] = useState([]);
  const [employeeType, setEmployeeType] = useState(userObj.employeeType);
  const [noPendingLeaves, setNoPendingLeaves] = useState(false);

  async function fetchReq() {
    try {
      let response = await axios({
        method: "get",
        // url: `https://hr-dashboard-nimish.herokuapp.com/admin/leave`,
        url: `${url}/admin/leave`,
      });

      // console.log(response);
      setAllRequest(response?.data);
      response && setStopSpinner(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchReq();
    // console.log("user obj from leave.js --> ", userObj);
    setEmployeeType(userObj.employeeType);
    getPending();
  }, []);

  async function getPending() {
    try {
      let responseObj = axios({
        method: "get",
        // url: "https://hr-dashboard-nimish.herokuapp.com/admin/leave/pending",
        url: `${url}/admin/leave/pending`,
      }).then((res) => {
        // console.log(res.data.length);
        if (res.data.length == 0) {
          setNoPendingLeaves(true);
        } else {
          setNoPendingLeaves(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {userObj == "logout" && navigate("/")}
      {employeeType === 1 ? (
        <div className="mainstyle">
          <div className="heading"> Leave Management </div>
          {stopSpinner == false ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "40vh",
                }}
              >
                <h1 style={{ color: "#6075fe", fontWeight: "600" }}>
                  {" "}
                  Loading Leaves{" "}
                  <span>
                    <Spin size="large" />
                  </span>
                </h1>
              </div>
            </div>
          ) : (
            <div style={{ height: "65vh", overflow: "scroll" }}>
              {noPendingLeaves == false ? (
                <div>
                  {allrequest != [] &&
                    allrequest?.map((obj, i) => (
                      <Card key={i} Obj={obj} fetchReq={fetchReq} />
                    ))}
                </div>
              ) : (
                <div>
                  <div
                    className="nopendingleavectn"
                    style={{
                      fontSize: "1.2rem",
                      padding: "10px",
                      fontWeight: "500",
                      color: "#6075fe",
                    }}
                  >
                    No more leaves remaining 🥳
                  </div>
                  <div className="nopendingleavectn">
                    <img className="emptyimg" src={emptyimg}></img>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <EmployeeLeave />
      )}
    </>
  );
};

export default Leave;

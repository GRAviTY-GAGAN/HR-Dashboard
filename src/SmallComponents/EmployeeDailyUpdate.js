import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";

import { Input, DatePicker, notification, Spin } from "antd";
import "./EmployeeDailyUpdate.css";
import "antd/dist/antd.css";
import { TiTick } from "react-icons/ti";
import Todo from "./Todo";

const { TextArea } = Input;

function EmployeeDailyUpdate() {
  const userObj = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const url =
    process.env.NODE_ENV == "development"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  let tempUpdateObj = {
    taskHeading: "",
    taskDescription: "",
    taskCompletedDate: "",
    taskId: "",
  };

  const [updateTaskObj, setupdateTaskObj] = useState({
    taskHeading: "",
    taskDescription: "",
    taskCompletedDate: "",
    taskId: "",
  });

  useEffect(() => {
    let id = uuidv4();
    setUuid(id);
  }, [updateTaskObj]);

  const [spinner, setSpinner] = useState(false);
  const [uuId, setUuid] = useState("");

  function handleHeading(e) {
    setupdateTaskObj({
      ...updateTaskObj,
      taskHeading: e.target.value,
      taskId: uuId,
    });
  }

  function handleDate(date) {
    let tempDate = moment(date).format("DD MM YYYY");
    setupdateTaskObj({ ...updateTaskObj, taskCompletedDate: tempDate });
  }

  function handleDescription(e) {
    let tempText = e.target.value;
    setupdateTaskObj({ ...updateTaskObj, taskDescription: tempText });
  }

  async function updateTaskCompleted() {
    setSpinner(true);
    // let id = uuidv4();
    // setupdateTaskObj({ ...updateTaskObj, taskId:id });

    if (
      updateTaskObj.taskHeading !== "" &&
      updateTaskObj.taskDescription !== "" &&
      updateTaskObj.taskCompletedDate !== "" &&
      updateTaskObj.taskId !== ""
    ) {
      let res = await axios({
        method: "post",
        // url: `https://hr-dashboard-nimish.herokuapp.com/employee/updatetask/${userObj.id}`,
        url: `${url}/employee/updatetask/${userObj.id}`,
        data: updateTaskObj,
      });
      // console.log(res.status === 200);
      setupdateTaskObj(tempUpdateObj);

      if (res.status === 200) {
        // setupdateTaskObj(tempUpdateObj)
        notification.open({
          message: "Your task is updated !",
          icon: <TiTick style={{ fontSize: "1.5rem", color: "#4BB543" }} />,
        });
      }
    } else {
      alert("Please Enter all the details of update task");
    }

    setSpinner(false);
  }

  return (
    <div className="employeeDailyUpdate__empupdate">
      <div className="employeeDailyUpdate__updatetxt">
        <div className="employeeDailyUpdate__UDT"> Update Daily Task </div>

        <div className="empflex">
          Task Heading{" "}
          <span>
            <Input
              value={updateTaskObj.taskHeading}
              placeholder="Heading"
              style={{ width: "16rem" }}
              onChange={(e) => handleHeading(e)}
            />
          </span>
        </div>
        <div className="empflex">
          Date of task
          <span>
            <DatePicker
              style={{ width: "16rem" }}
              placeholder="Date when task completed"
              onSelect={(date) => handleDate(date)}
            />
          </span>
        </div>
        <div className="empflex">
          {" "}
          Description
          <TextArea
            style={{ width: "16rem" }}
            placeholder="Description of the task completed"
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
            onChange={(e) => handleDescription(e)}
            value={updateTaskObj.taskDescription}
          />
        </div>

        <div className="employeeDailyUpdate__sendbtnctn">
          <div onClick={() => updateTaskCompleted()} className="sendbtn">
            {spinner == true ? <Spin tip="updating" /> : "Update"}
            {/* {" "}
            Update{" "} */}
          </div>
        </div>
      </div>
    </div>
  );
}

//

export default EmployeeDailyUpdate;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  SIGNIN,
  ID,
  EMPTYP,
  DEP,
  FNAME,
  LNAME,
  EMAIL,
  PASSWORD,
  CPASSWORD,
  ADDRESS,
  PHONENO,
} from "../redux/types";

import { Button, Form, Input, Select, notification, Spin } from "antd";
import { motion } from "framer-motion";
import "./Signup.css";
import { ExceptionOutlined, SmileOutlined } from "@ant-design/icons";

const { Option } = Select;

const Signup = () => {
  const [highlight, setHighlight] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const [responseToNext, setResponseToNext] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const userObj = useSelector((state) => state.reducer);
  const dispatch = useDispatch();
  // console.log("From signUp useSelector", userObj);

  const url =
    process.env.NODE_ENV == "development"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  useEffect(() => {
    dispatch({
      type: SIGNIN,
    });
  }, []);

  const openNotificationWithIcon = (type, mes, des = "") => {
    api[type]({
      message: mes,
      description: des,
    });
  };

  const verifySignup = async (userDataObj) => {
    // console.log(userDataObj, "USEROBJ");
    try {
      // console.log(userDataObj, "<--- user Object ");

      let response = await axios({
        method: "post",
        // url: "https://hr-dashboard-nimish.herokuapp.com/auth/signup",
        url: `${url}/auth/signup`,
        data: userObj,
      });

      dispatch({
        type: ID,
        id: response.data.id,
      });

      setResponseToNext(true);
    } catch (error) {
      console.log(error, "ERROR");
      openNotificationWithIcon(
        "error",
        "Please try again",
        `${error.response.data.msg}`
      );
      setSpinner(false);
      dispatch({ type: "reset" });
      setTimeout(() => {
        navigate("/signup");
      }, 20);
    }

    // if (response.status === 200) {
    //   setResponseToNext(true);
    // } else {
    //   openNotificationWithIcon(
    //     "error",
    //     "Please try again",
    //     "Incorrect user credentials"
    //   );
    //   setSpinner(false);
    // }
  };

  function handleSignup() {
    // console.log(userObj, "USER");
    setSpinner(true);
    axios
      .post(`${url}/auth/signup`, userObj)
      .then((res) => {
        if (res.statusText == "Success") {
          dispatch({
            type: ID,
            id: res.data.id,
          });
          setResponseToNext(true);
          // openNotificationWithIcon("Success", "User Signedup.");
          api.open({
            message: "User Signedup",
            // description:
            //   'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            icon: (
              <SmileOutlined
                style={{
                  color: "#108ee9",
                }}
              />
            ),
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          // console.log(res, "JAKAJKSD");
          // openNotificationWithIcon("error", "Please try again");
          api.open({
            message: `${res.data.msg}`,
            // description:
            //   "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
            icon: (
              <ExceptionOutlined
                style={{
                  color: "red",
                }}
              />
            ),
          });
        }
      })
      .catch((err) => {
        // openNotificationWithIcon("error", "Please try again");

        let msg = "";

        if (err?.response.data.msg) {
          msg = err?.response.data.msg;
        } else {
          msg = "Please try again";
        }

        api.open({
          message: msg,
          // description:
          //   "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
          icon: (
            <ExceptionOutlined
              style={{
                color: "red",
              }}
            />
          ),
        });
        console.log(err, "HERE");
        dispatch({ type: "reset" });
      })
      .finally(() => {
        setSpinner(false);
        dispatch({ type: "reset" });
      });
  }

  return (
    <div className="login">
      {contextHolder}
      <div className="signup__container signupcont">
        <div className="cont1">
          <p
            onMouseOver={() => {
              setHighlight(true);
            }}
            onMouseOut={() => {
              setHighlight(false);
            }}
            className={`${highlight ? "log highlight" : "log"}`}
            style={{
              marginBottom: "0.6rem",
              marginTop: "0.6rem",
              cursor: "default",
            }}
          >
            Sign up
          </p>
        </div>
        <div className="btnContainer">
          <div
            onClick={() => {
              dispatch({
                type: EMPTYP,
                employeeType: 1,
              });
            }}
            className={`${
              userObj.employeeType === 1 ? "btn btn-active" : "btn"
            }`}
          >
            Admin
          </div>
          <div
            onClick={() => {
              dispatch({
                type: EMPTYP,
                employeeType: 2,
              });
            }}
            className={`${
              userObj.employeeType === 1 ? "btn " : "btn btn-active"
            }`}
          >
            Employee
          </div>
        </div>
        <div className="content">
          <Form
            form={form}
            layout="vertical"
            name="register"
            scrollToFirstError
          >
            <div className="names">
              <div style={{ width: "50%" }}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: "Please select first name!",
                    },
                  ]}
                >
                  <Input
                    required={true}
                    placeholder="First Name"
                    onChange={(e) => {
                      dispatch({ type: FNAME, firstName: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Please select last name!",
                    },
                  ]}
                >
                  <Input
                    required={true}
                    placeholder="Last Name"
                    onChange={(e) => {
                      dispatch({ type: LNAME, lastName: e.target.value });
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                required={true}
                placeholder="Email"
                onChange={(e) => {
                  dispatch({ type: EMAIL, email: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                required={true}
                placeholder="Password"
                onChange={(e) => {
                  dispatch({ type: PASSWORD, password: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                required={true}
                placeholder="Confirm Password"
                onChange={(e) => {
                  dispatch({
                    type: CPASSWORD,
                    confirmPassword: e.target.value,
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[
                {
                  required: true,
                  message: "Please add your department!",
                },
              ]}
            >
              {/* <Input
                required={true}
                placeholder="Enter your department"
                
              /> */}

              <Select
                required={true}
                style={{
                  width: "100%",
                }}
                // onChange={(e) => {
                //   dispatch({ type: DEP, deparatment: e.target.value });
                // }}
                onChange={(e) => {
                  // console.log(e, "from inside select");
                  dispatch({ type: DEP, deparatment: e });
                }}
                allowClear
              >
                <Option value="Engineering">Engineering</Option>
                <Option value="Operations">Operations</Option>
                <Option value="Accounts">Accounts</Option>
                <Option value="Supply Chain">Supply Chain</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please select address!",
                },
              ]}
            >
              <Input
                required={true}
                placeholder="Enter your address"
                onChange={(e) => {
                  dispatch({ type: ADDRESS, address: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please select phone number!",
                },
              ]}
            >
              <Input
                required={true}
                placeholder="Enter your Phone Number"
                onChange={(e) => {
                  dispatch({ type: PHONENO, phoneNumber: e.target.value });
                }}
              />
            </Form.Item>

            <Form.Item>
              <motion.div whileTap={{ scale: 1.05 }}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    // verifySignup(userObj);
                    handleSignup();
                  }}
                >
                  <motion.div whileTap={{ scale: 1.1 }}>
                    {spinner == false ? (
                      "Sign up"
                    ) : (
                      <div>
                        {" "}
                        <Spin tip="Signing In..." />{" "}
                      </div>
                    )}
                  </motion.div>
                </Button>
                {/* {responseToNext === true && (
                  <Navigate
                    to={
                      userObj.employeeType === 1
                        ? "/home/dashboard"
                        : "/home/employee/dashboard"
                    }
                  />
                )} */}
              </motion.div>
            </Form.Item>
          </Form>

          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link to={"/"} className="signup">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Form, Input, Button, Spin, notification } from "antd";
import "./Login.css";
import { motion } from "framer-motion";
import { USER_DETAILS } from "../redux/MyNewReducer/actionTypes";
import { SmileOutlined } from "@ant-design/icons";

const Login = () => {
  const [form] = Form.useForm();
  const [userEmail, setUseremail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [highlight, setHighlight] = useState(false);

  const [spinner, setSpinner] = useState(false);
  const [adminSpinner, setAdminSpinner] = useState(false);
  const [empSpinner, setEmpSpinner] = useState(false);
  const [responseToNext, setResponseToNext] = useState(false);

  const userObj = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, mes, des) => {
    notification[type]({
      message: mes,
      description: des,
    });
  };

  const url =
    process.env.NODE_ENV == "development"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  const verifyLogin = async (userEmail, userPassword) => {
    setSpinner(true);
    // console.log(userEmail, userPassword, "fromFrontEnd");
    userData.email = userEmail;
    userData.password = userPassword;
    setUserData(userData);
    // console.log(userData, "fromfrontend");

    try {
      let response = await axios({
        method: "post",
        // url: "https://hr-dashboard-nimish.herokuapp.com/auth/login",
        url: `${url}/auth/login`,
        data: userData,
      })
        .then((res) => {
          // console.log(res, "LOGIN");
          if (res.status == 200) {
            if (
              res.data?.errorMessage?.length == 0 ||
              res.data?.errorMessage?.length == undefined
            ) {
              setSpinner(false);
              setResponseToNext(true);
              localStorage.setItem(
                "userDetails",
                JSON.stringify(res.data.user)
              );

              localStorage.setItem("token", res.data.token);

              dispatch({
                type: "login",
                payload: res.data.user,
              });
              dispatch({
                type: USER_DETAILS,
                payload: res.data.user,
              });

              api.open({
                message: "Login Successful",
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

              if (res.data.user.employeeType == 1) {
                // userObj.employeeType == 1
                //       ? "/home/dashboard"
                //       : "/home/employee/dashboard"
                setTimeout(() => {
                  navigate("/home/dashboard");
                }, 2000);
              } else {
                setTimeout(() => {
                  navigate("/home/employee/dashboard");
                }, 2000);
              }
            } else {
              openNotificationWithIcon(
                "error",
                "Please try again",
                "Incorrect user credentials"
              );
              setSpinner(false);
            }
            // console.log(res, "from line no 46 response");
          } else {
            //Notification of somethin went wrong please try again
            openNotificationWithIcon(
              "error",
              "Please try again",
              " Something went wrong "
            );
            setSpinner(false);
          }
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => {
          setSpinner(false);
        });
    } catch (error) {
      console.log("error while logging in ", error);
      setSpinner(false);
    }
  };

  const guestLogin = async (em, pass) => {
    if (em == "test@admin.com") {
      setAdminSpinner(true);
    } else {
      setEmpSpinner(true);
    }

    try {
      let response = await axios({
        method: "post",
        // url: "https://hr-dashboard-nimish.herokuapp.com/auth/login",
        url: `${url}/auth/login`,
        data: { email: em, password: pass },
      })
        .then((res) => {
          if (res.status == 200) {
            if (
              res.data?.errorMessage?.length == 0 ||
              res.data?.errorMessage?.length == undefined
            ) {
              setSpinner(false);
              setAdminSpinner(false);
              setEmpSpinner(false);

              setResponseToNext(true);
              dispatch({
                type: "login",
                payload: res.data,
              });
            } else {
              openNotificationWithIcon(
                "error",
                "Please try again",
                "Incorrect user credentials"
              );
              setSpinner(false);
            }
            // console.log(res, "from line no 46 response");
          } else {
            //Notification of somethin went wrong please try again
            openNotificationWithIcon(
              "error",
              "Please try again",
              " Something went wrong "
            );
            setSpinner(false);
          }
        })
        .catch((err) => {
          alert(err);
        });
    } catch (error) {
      console.log("error while logging in ", error);
    }
  };

  return (
    <div className="login">
      {contextHolder}
      <div className="login__container">
        <div className="cont1">
          <p
            onMouseOver={() => {
              setHighlight(true);
            }}
            onMouseOut={() => {
              setHighlight(false);
            }}
            style={{ cursor: "default" }}
            className={`${highlight ? "log highlight" : "log"}`}
          >
            Log In
          </p>
        </div>
        <div className="cont2">
          <Form form={form} layout="vertical">
            <Form.Item>
              <label className="label" style={{ fontSize: "1rem" }}>
                Email
              </label>
              <Input
                style={{ marginTop: "0.6rem" }}
                type="email"
                placeholder="Email address"
                name="email"
                onChange={(e) => setUseremail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              {" "}
              <div className="label password ">
                <label>Password</label>
                <Link to="/forgotPass">
                  <motion.div
                    style={{ fontSize: "0.8rem" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    Forgot password?
                  </motion.div>
                </Link>
              </div>
              <Input
                style={{ marginTop: "0.6rem" }}
                type="password"
                placeholder="password"
                name="password"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              {/* {responseToNext == true && (
                <Navigate
                  to={
                    userObj.employeeType == 1
                      ? "/home/dashboard"
                      : "/home/employee/dashboard"
                  }
                />
              )} */}
              <Button
                onClick={() => verifyLogin(userEmail, userPassword)}
                className="login-button"
                style={{
                  // backgroundColor: "#0284c7",
                  backgroundColor: "#6075fe",
                  color: "white",
                }}
              >
                <motion.div whileTap={{ scale: 1.1 }}>
                  {spinner == false ? (
                    "Log In"
                  ) : (
                    <div>
                      {" "}
                      <Spin tip="Logging In..." />{" "}
                    </div>
                  )}
                </motion.div>
              </Button>

              {/* <Button
                onClick={() => guestLogin("test@admin.com", "test123")}
                className="login-button"
                style={{
                  // backgroundColor: "#0284c7",
                  backgroundColor: "#6075fe",
                  color: "white",
                  marginTop: "1.4rem",
                  marginBottom: "1.4rem",
                }}
              >
                <motion.div whileTap={{ scale: 1.1 }}>
                  {adminSpinner == false ? (
                    "Guest Admin"
                  ) : (
                    <div>
                      {" "}
                      <Spin tip="Logging In..." />{" "}
                    </div>
                  )}
                </motion.div>
              </Button> */}

              {/* <Button
                onClick={() => guestLogin("test@emp.com", "test123")}
                className="login-button"
                style={{
                  // backgroundColor: "#0284c7",
                  backgroundColor: "#6075fe",
                  color: "white",
                }}
              >
                <motion.div whileTap={{ scale: 1.1 }}>
                  {empSpinner == false ? (
                    "Guest Employee"
                  ) : (
                    <div>
                      {" "}
                      <Spin tip="Logging In..." />{" "}
                    </div>
                  )}
                </motion.div>
              </Button> */}
            </Form.Item>
          </Form>
        </div>
        <div className="account">
          <p>
            Don’t have an account?{" "}
            <Link to={"/signup"} className="signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

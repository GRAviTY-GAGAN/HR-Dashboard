import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { Routes, Route } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import Home from "./pages/Home";
import Payroll from "./BusinessComponent/Payroll";
import Dashboard from "./BusinessComponent/Dashboard";
import Leave from "./BusinessComponent/Leave";
import Test from "./BusinessComponent/Test";
import Updates from "./BusinessComponent/Employee/Updates";
import Chat from "./BusinessComponent/Chat";
import PageNotFound from "./PageNotFound";
// import DashboardTable from './BusinessComponent/DashboardTable';
// import PreDashTable from "./BusinessComponent/Employee/PreDashTable";
import DashboardTableOne from "./SmallComponents/DashboardTableOne";

import "./App.css";
import ResetPass from "./pages/ResetPass";
import ForgotPass from "./pages/ForgotPass";
import axios from "axios";
import { USER_DETAILS } from "./redux/MyNewReducer/actionTypes";
import Issues from "./pages/Issues";
// import "antd/dist/antd.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const url =
    process.env.NODE_ENV == "developemnt"
      ? process.env.REACT_APP_LOCAL_URL
      : process.env.REACT_APP_PROD_URL;

  useEffect(() => {
    document.title = "HR-Dashboard";
    if (JSON.parse(localStorage.getItem("userDetails"))) {
      // console.log(JSON.parse(localStorage.getItem("userDetails")));
      const user = JSON.parse(localStorage.getItem("userDetails"));

      fetchEmployeeData(user._id);
    }
  });

  async function fetchEmployeeData(id) {
    await axios
      .get(`${url}/employee/getEmpDetails/${id}`)
      .then((res) => {
        // console.log("FETCHED", res.data);
        dispatch({ type: USER_DETAILS, payload: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // useEffect(()=>{
  //   switch (location?.pathname) {
  //     case "home/dashboard":
  //       navigate("home/dashboard");
  //       return;

  //     case "home/payroll":
  //       navigate("home/payroll");
  //       return;
  //   }
  // })

  return (
    <div>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/forgotPass" element={<ForgotPass />} />
          <Route exact path="/resetPass/:id" element={<ResetPass />} />
          <Route exact path="signup" element={<Signup />} />
          <Route exact path="home" element={<Home />}>
            <Route exact path="employee/dashboard" element={<Dashboard />} />
            <Route exact path="dashboard" element={<Dashboard />} />
            <Route exact path="payroll" element={<Payroll />} />
            <Route exact path="leave" element={<Leave />} />
            <Route exact path="update" element={<Updates />} />
            <Route exact path="test" element={<Test />} />
            <Route exact path="issue" element={<Issues />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;

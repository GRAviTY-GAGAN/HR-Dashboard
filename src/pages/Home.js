import React, { useState } from "react";
import Navbar from "../BusinessComponent/Navbar";
import "./Home.css";
import Sidebar from "../BusinessComponent/Sidebar";
import { Outlet } from "react-router-dom";
import Chat from "../BusinessComponent/Chat";

const Home = () => {
  const [sidebarClose, setSidebarClose] = useState(true);

  const handleCloseSidebar = () => {
    setSidebarClose(!sidebarClose);
  };

  return (
    <div>
      <div className="sidnav">
        <Sidebar
          handleCloseSidebar={handleCloseSidebar}
          sidebarClose={sidebarClose}
        />
        <div>
          <div className="home__navbar">
            <Navbar
              handleCloseSidebar={handleCloseSidebar}
              sidebarClose={sidebarClose}
            />
          </div>
          <Outlet />
        </div>
        {/* <div style={{display: 'flex', justifyContent: 'start'}} className='chat'><Chat /></div> */}
      </div>
    </div>
  );
};

export default Home;

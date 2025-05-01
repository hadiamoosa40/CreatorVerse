import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faChartLine, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css"; // Ensure this file exists

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <h2 className="sidebar-title">Admin Dashboard</h2>

      {/* Navigation Links */}
      <ul className="nav">
        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <FontAwesomeIcon icon={faTachometerAlt} />
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/analytics" className="nav-link">
            <FontAwesomeIcon icon={faChartLine} />
            Analytics
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <FontAwesomeIcon icon={faCog} />
            Settings
          </Link>
        </li>
        <li className="nav-item">
          {/* Change the Link for Logout to /signup */}
          <Link to="/signup" className="nav-link">
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

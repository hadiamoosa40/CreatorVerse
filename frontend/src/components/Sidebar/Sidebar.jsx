import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faImage, faVideo, faCode, faMusic, faCog, faCrown, faSubscript, faBell, faWebAwesome, faPerson, faSignIn, faSigning, faFaceLaugh, fa6 } from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css"; // Ensure this file exists

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <h2 className="sidebar-title">🚀CreaterVerse</h2>

      {/* Navigation Links */}
      <ul className="nav flex-column">
        <li className="nav-item"><Link to="/" className="nav-link"><FontAwesomeIcon icon={faComments} /> Dashboard</Link></li>
        <li className="nav-item"><Link to="/conversation" className="nav-link"><FontAwesomeIcon icon={faComments} /> Conversation</Link></li>
        <li className="nav-item"><Link to="/image-generation" className="nav-link"><FontAwesomeIcon icon={faImage} /> Image Generation</Link></li>
        <li className="nav-item"><Link to="/video-generation" className="nav-link"><FontAwesomeIcon icon={faVideo} /> Video Generation</Link></li>
        <li className="nav-item"><Link to="/music-generation" className="nav-link"><FontAwesomeIcon icon={faMusic} /> Music Generation</Link></li>
        <li className="nav-item"><Link to="/code-generation" className="nav-link"><FontAwesomeIcon icon={faCode} /> Code Generation</Link></li>
        <li className="nav-item"><Link to="/signup" className="nav-link"><FontAwesomeIcon icon={faSignIn} /> SignIn/SignUp</Link></li>
        <li className="nav-item">
  <Link 
    to="/subscription" 
    className="nav-link" 
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: 'blue',
      color: 'white',
      borderRadius: '5px',
      textDecoration: 'none',
      fontSize: '16px'
    }}
  >
    <FontAwesomeIcon 
      icon={faWebAwesome}
      style={{ marginRight: '8px' }} 
    /> 
    Subscription
  </Link>
</li>
      </ul>
    </div>
  );
};

export default Sidebar;

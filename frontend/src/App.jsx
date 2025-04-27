import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import Code from "./components/CodeG/CodeG";
import Music from "./components/MusicG/Music";
import Image from "./components/ImageG/Image";
import Video from "./components/videoG/VideoG";
import Conversation from "./components/Content/Content";
import Upgrade from "./components/Upgrade/upgrade";
import Subscription from "./components/Subscription/Subscription";
import Signup from "./components/SignIn/Signin";

const App = () => {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/image-generation" element={<Image />} />
            <Route path="/video-generation" element={<Video />} />
            <Route path="/music-generation" element={<Music />} />
            <Route path="/code-generation" element={<Code />} />
            <Route path="/upgrade" element={<Upgrade />}/>
            <Route path="/subscription" element={<Subscription />}/>
            <Route path="/signup" element={<Signup/>}/>




          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

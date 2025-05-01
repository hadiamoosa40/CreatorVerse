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
import Success from "./components/Sucess/Success";
import Dashboard from "./components/Admin Dashbaord/Dashboard";
import SettingsPage from "./components/Settings/Setting";
import AnalyticsPage from "./components/Analytics/Analytics";

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
            <Route path="/success" element={<Success />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />





          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

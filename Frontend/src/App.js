import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VideoRecorder from "./pages/VideoRecorder";
import VideoPlayer from "./pages/VideoPlayer";

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/record">Record Video</Link>
          <Link to="/play">Play Video</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/record" element={<VideoRecorder />} />
          <Route path="/play" element={<VideoPlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/videos`)
      .then((response) => response.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {videos.length === 0 ? (
        <p>No videos available. Please record some videos!</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (
            <div key={video.name} className="video-item">
              <h3>{video.name}</h3>
              {/* Video preview */}
              <video controls width="300" src={video.url}></video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

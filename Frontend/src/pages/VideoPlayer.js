import React, { useState, useEffect, useRef } from "react";

const VideoPlayer = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/videos`)
      .then((response) => response.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error("Error fetching videos:", error))
      .finally(() => setLoading(false));
  }, []);



  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (event) => {
    const newTime = event.target.value;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };


  const handleLoadedMetadata = () => {
    const videoDuration = videoRef.current?.duration;
    if (videoDuration && !isNaN(videoDuration)) {
      setDuration(videoDuration);
    }
    setLoading(false);
  };

  const handleVideoSelection = (video) => {
    setSelectedVideo(video);
    setLoading(true);
    setDuration(0); // Reset duration while loading a new video
  };

  return (
    <div>
      <h1>Video Player</h1>
      <div className="vedio-player">
        {loading && <div className="loader" />}
        <select
          onChange={(e) => handleVideoSelection(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a Video
          </option>
          {videos.map((video) => (
            <option key={video.name} value={video.name}>
              {video.name}
            </option>
          ))}
        </select>
        {selectedVideo && (
          <div>
            <video
              ref={videoRef}
              width="600"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onDragStart={handleSeek}
              src={`${process.env.REACT_APP_API_URL}/video/${selectedVideo}`}
              muted={false}
              controls
            />
            <div className="controls">
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default VideoPlayer;

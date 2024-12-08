import React, { useRef, useState } from "react";

const VideoRecorder = () => {
  const videoRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
       video: true,
       audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
       },
       });
    videoRef.current.srcObject = stream;
    console.log("MediaStream Tracks:", stream.getTracks());
      console.log("Audio Tracks:", stream.getAudioTracks());
      console.log("Video Tracks:", stream.getVideoTracks());

    const audio = new Audio();
      audio.srcObject = new MediaStream(stream.getAudioTracks());
      audio.play();

    const recorder = new MediaRecorder(stream,{
      mimeType: 'video/webm',
    });
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      setChunks((prev) => [...prev, event.data]);
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  };

  const saveRecording = async () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    const formData = new FormData();
    formData.append("video", blob, "recorded-video.mp4");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/record`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
    console.log("saved successfully");
    
  };

  return (
    <div>
      <h1>Record Video</h1>
      <div className="recorder">
      <video ref={videoRef} autoPlay></video>
      </div>
      <div className="bts-container">
        <button className="bts" onClick={startRecording}>Start</button>
        <button className="bts" onClick={stopRecording}>Stop</button>
        <button className="bts" onClick={saveRecording}>Save</button>
      </div>
      </div>
  );
};

export default VideoRecorder;

import React from "react";
import "./App.css";
import { AudioRecorder } from "react-audio-voice-recorder";
import axios from "axios";

const App = () => {
  const addAudioElement = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob);

      if (!formData.has("file")) {
        throw new Error("formData is empty!");
      }

      await axios.post("http://localhost:8080/audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div className="app">
      <div className="text">
        <h2>Hi, I'm ChatGPT!</h2>
        <h1>What can I do for you?</h1>
      </div>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={true}
        downloadFileExtension="wav"
      />
    </div>
  );
};

export default App;

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const LiveCamera = () => {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [stressLevel, setStressLevel] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
      const interval = setInterval(captureImage, 5000);
      return () => clearInterval(interval);
    }
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const captureImage = async () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      try {
        const response = await fetch("https://mental-wellness-production.up.railway.app/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("API Response:", data);

        setEmotion(data.emotion);
        setStressLevel(data.stress_level || 0);
      } catch (error) {
        console.error("Error analyzing emotion:", error);
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2E0249] to-[#3A0CA3] p-8 text-white font-mono">
      {/* Main Centered Container */}
      <motion.div
        className="flex flex-col items-center bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-2xl border-2 border-white text-center mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <motion.h1 
          className="text-3xl font-extrabold tracking-wide mb-4"
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          Mental Wellness Analysis
        </motion.h1>
  
        {/* Video Section - Centered */}
        <div className="flex flex-col items-center mb-6">
          <div className="border-4 border-white rounded-lg shadow-lg overflow-hidden w-[400px] h-[300px] flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg" />
          </div>
  
          {/* Results Section */}
          <div className="w-full text-center mt-4">
            <p className="text-2xl font-extrabold">Detected Emotion:</p>
            <motion.p
              className="text-3xl mt-2 font-semibold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {emotion ? emotion + " " + getEmoji(emotion) : "Waiting..."}
            </motion.p>
  
            <div className="mt-6">
              <p className="text-2xl font-bold">Stress Level:</p>
              <motion.div
                className="w-full bg-gray-300 rounded-full mt-2 overflow-hidden h-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div
                  className={`h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                    stressLevel > 66 ? "bg-red-600" :
                    stressLevel > 33 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${stressLevel}%` }}
                >
                  {stressLevel}%
                </div>
              </motion.div>
            </div>
          </div>
        </div>
  
        {/* Start Camera Button */}
        <div className="mt-6">
          {!isCameraOn && (
            <motion.button
              className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 text-xl"
              onClick={startCamera}
              whileHover={{ scale: 1.1 }}
            >
              Start Camera
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Emoji Mapper
const getEmoji = (emotion) => {
  const emojiMap = {
    happy: "😊",
    sad: "😢",
    angry: "😡",
    neutral: "😐",
    surprised: "😲",
    fearful: "😨",
    disgusted: "🤢",
  };
  return emojiMap[emotion] || "❓";
};
  
export default LiveCamera;

import React from "react";
import LiveCamera from "../components/LiveCamera";

const Analyze = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Start Your Analysis</h1>
          <p className="text-gray-600 mt-1">Position yourself clearly in the camera frame for best results</p>
        </div>
        
        <div className="p-6">
          <LiveCamera />
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-150 ease-in-out">
            Save Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
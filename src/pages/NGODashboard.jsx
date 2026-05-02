import { useState } from "react";
import Status from "../components/Status";
import NGOView from "../components/NGOView";
import Feedback from "../components/Feedback";
import dashLogo from '../assets/Images/dashBoard_logo.jpg';

export default function NGODashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    if (activeView === "feedback") {
      return <Feedback user={user} />;
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Section */}
        <div className="lg:col-span-2 bg-white/80 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
          <div className="bg-gradient-to-r from-[#A8E0A3] to-[#8DBFC3] text-[#2C4A4E] p-4 md:p-6 rounded-t-xl">
            <h2 className="text-xl md:text-2xl font-bold flex items-center">
              📊 Food Package Status
            </h2>
            <p className="text-sm opacity-80 mt-1">
              Overview of all available food packages
            </p>
          </div>
          <div className="p-4 md:p-6">
            <Status />
          </div>
        </div>

        {/* NGO Actions Section */}
        <div className="bg-white/80 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
          <div className="bg-gradient-to-r from-[#8DBFC3] to-[#6FA3AA] text-white p-4 md:p-6 rounded-t-xl">
            <h2 className="text-xl md:text-2xl font-bold flex items-center">
              🎯 Available Packages
            </h2>
            <p className="text-sm opacity-90 mt-1">
              Accept and manage food deliveries
            </p>
          </div>
          <div className="p-0">
            <NGOView user={user} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#EEF2E0] via-[#C9EAB0] via-[#A8E0A3] to-[#8DBFC3] text-[#5B7A83]">
      {/* Top Header */}
      <div className="bg-white/70 shadow-lg border-b border-[#8DBFC3] backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center space-x-4">
            <img 
              src={dashLogo} 
              alt="SaveNserve Logo" 
              className="object-contain h-10 pb-7 w-32 md:h-auto md:w-40 pt-2 md:pt-7"
            />
            <div className="font-bold text-[#5B7A83] text-sm md:text-base">
              Welcome, {user.name}
            </div>
            <div className="hidden md:block px-3 py-1 bg-[#A8E0A3] text-[#2C4A4E] rounded-full text-xs font-semibold">
              NGO Dashboard
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`px-3 py-1.5 rounded-md transition-colors duration-200 text-sm font-medium ${
                  activeView === 'dashboard' 
                    ? 'bg-[#8DBFC3] text-white' 
                    : 'text-[#5B7A83] hover:bg-[#8DBFC3]/20'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveView("feedback")}
                className={`px-3 py-1.5 rounded-md transition-colors duration-200 text-sm font-medium ${
                  activeView === 'feedback' 
                    ? 'bg-[#8DBFC3] text-white' 
                    : 'text-[#5B7A83] hover:bg-[#8DBFC3]/20'
                }`}
              >
                ⭐ Feedback
              </button>
            </div>

            <button 
              onClick={onLogout} 
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#E57373] to-[#C66B6B] text-white rounded-lg hover:from-[#D45050] hover:to-[#B85555] transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        {renderContent()}
      </div>
    </div>
  );
}

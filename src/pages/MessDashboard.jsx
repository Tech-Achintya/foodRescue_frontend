import { useState } from "react";
import Status from "../components/Status";
import DeliveryForm from "../components/DeliveryForm";
import ManageFood from "../components/ManageFood";
import HamburgerMenu from "../components/HamburgerMenu";
import History from "../components/History";
import NGOContact from "../components/NGOContact";
import dashLogo from "../assets/Images/dashBoard_logo.jpg";
import DeletePackage from "../components/DeletePackage";

export default function MessDashboard({ user, onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");

  const handleMenuSelect = (option) => {
    setActiveView(option);
  };

  const renderContent = () => {
    switch (activeView) {
      case "history":
        return <History user={user} />;
      case "manage-food":
        return <ManageFood />;
      case "ngo-contact":
        return <NGOContact />;
      default:
        return (
          <div className="flex w-full h-full gap-6 items-stretch flex-col z-0 md:flex-row">
            {/* Left Side - Status Section */}
            <div className="flex-1 flex flex-col bg-white/80 rounded-lg z-0 shadow-md backdrop-blur-sm">
              <Status />
            </div>

            {/* Right Side - Column for Add Food + Delete Package */}
            <div className="flex-1 z-0 flex flex-col gap-6">
              {/* Add Food Section */}
              <div className="flex-1 z-0 flex flex-col bg-white/80 rounded-lg shadow-md backdrop-blur-sm">
                <div className="bg-linear-to-r z-0 from-[#A8E0A3] to-[#8DBFC3] text-[#2C4A4E] p-4 rounded-t-lg">
                  <h2 className="text-xl z-1 font-bold">Add Food Items</h2>
                  <p className="text-sm opacity-80 z-1">
                    Create new food rescue packages
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <DeliveryForm user={user} />
                </div>
              </div>

              {/* Delete Package Section */}
              <div className="flex-1 flex flex-col bg-white/80 rounded-lg shadow-md backdrop-blur-sm">
                <div className="bg-gradient-to-r from-[#E57373] to-[#C66B6B] text-white p-4 rounded-t-lg">
                  <h2 className="text-xl font-bold">Delete Package</h2>
                  <p className="text-sm opacity-80">
                    Remove a listed package from database
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <DeletePackage user={user} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#EEF2E0] via-[#C9EAB0] via-[#A8E0A3] to-[#8DBFC3] text-[#5B7A83]">
      {/* Top Header */}
      <div className="bg-white/70 shadow-sm border-b border-[#8DBFC3] backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center space-x-4">
            <div className="flex justify-center md:mb-6">
              <img
                src={dashLogo}
                alt="SaveNserve Logo"
                className="object-contain h-10 w-32 md:h-auto md:w-40 pt-2 md:pt-7"
              />
            </div>
            <div className="font-bold text-[#5B7A83] text-sm md:text-base">
              Welcome, {user.name}
            </div>
          </div>


          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Navigation Buttons */}
            {activeView !== "dashboard" && (
              <button
                onClick={() => setActiveView("dashboard")}
                className="px-3 py-2 md:px-4 bg-[#8DBFC3] text-white rounded-md hover:bg-[#6FA3AA] transition-colors duration-200 text-sm md:text-base"
              >
                ← Back to Dashboard
              </button>
            )}

            {/* Desktop Navigation Items - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleMenuSelect('history')}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  activeView === 'history' 
                    ? 'bg-[#8DBFC3] text-white' 
                    : 'text-[#5B7A83] hover:bg-[#8DBFC3]/20'
                }`}
              >
                📋 History
              </button>
              <button
                onClick={() => handleMenuSelect('manage-food')}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  activeView === 'manage-food' 
                    ? 'bg-[#8DBFC3] text-white' 
                    : 'text-[#5B7A83] hover:bg-[#8DBFC3]/20'
                }`}
              >
                🍽️ Manage Food Item
              </button>
              <button
                onClick={() => handleMenuSelect('ngo-contact')}
                className={`px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                  activeView === 'ngo-contact' 
                    ? 'bg-[#8DBFC3] text-white' 
                    : 'text-[#5B7A83] hover:bg-[#8DBFC3]/20'
                }`}
              >
                📞 NGO Contact
              </button>
            </div>

            {/* Mobile Hamburger Menu - Visible only on mobile */}
            <div className="md:hidden z-50">
              <HamburgerMenu onMenuSelect={handleMenuSelect} />
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="px-3 py-2 md:px-4 bg-[#E57373] text-white rounded-md hover:bg-[#D45050] transition-colors duration-200 text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 h-auto md:h-[calc(100vh-80px)] flex flex-col md:flex-row">
        {renderContent()}
      </div>
    </div>
  );
}

import { useState } from 'react';

export default function HamburgerMenu({ onMenuSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (option) => {
    onMenuSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
      >
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
        <div className={`w-5 h-0.5 bg-gray-600 my-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => handleMenuClick('history')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              📋 History
            </button>
            <button
              onClick={() => handleMenuClick('manage-food')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              🍽️ Manage Food Item
            </button>
            <button
              onClick={() => handleMenuClick('ngo-contact')}
              className="block w-full text-left px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              📞 NGO Contact
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
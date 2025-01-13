import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Trạng thái của dropdown

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogin = () => {
    navigate("/login"); // Chuyển đến trang đăng nhập
  };

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login"); // Chuyển đến trang đăng nhập
  };

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer">
          <Link to="/">SMARTSIGN</Link>
        </div>

        {/* Menu */}
        <nav className="flex space-x-6">
          <Link to="/translate" className="hover:underline">
            Translate
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>

        {/* Tên user hoặc nút Đăng nhập */}
        <div className="relative">
          {isLoggedIn ? (
            <div>
              {/* Tên người dùng */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                className="font-medium hover:underline"
              >
                {user.fullName}
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

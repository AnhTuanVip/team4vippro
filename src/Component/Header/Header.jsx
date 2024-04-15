import React, { useEffect, useState } from "react";
import { FaChevronCircleDown } from "react-icons/fa";
import { AiOutlineGlobal } from "react-icons/ai";
import { IoIosPricetags, IoMdSettings } from "react-icons/io";
import { BiLogInCircle } from "react-icons/bi";
import { FiSun, FiMoon } from "react-icons/fi";
import "./Header.css";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import axios from "axios";

function Header({ darkMode, toggleDarkMode, isLoggedIn, handleLogout }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token1");
        const response = await axios.get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfileImage(response.data.user.image);
        setUsername(response.data.user.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  const handleIconClick = () => {
    handleItemClick("global");
  };
  return (
    <div className="header">
      <div className="icon" onClick={handleIconClick}>
        <NavLink to="/" className="link">
          <img
            src="https://cdn.pixabay.com/photo/2018/04/10/17/23/dragon-3308119_1280.png"
            alt=""
          />
          CPL-T4
        </NavLink>
      </div>

      <ul className="col-8 menu">
        <NavLink to="/" className="link">
          <li
            className={`menu-1 ${selectedItem === "global" ? "selected" : ""}`}
            onClick={() => handleItemClick("global")}
          >
            <FaChevronCircleDown /> Global
          </li>
        </NavLink>
        <NavLink to="./createArticle" className="link">
          <li
            className={`menu-1 ${selectedItem === "write" ? "selected" : ""}`}
            onClick={() => handleItemClick("write")}
          >
            Write Your Article !
          </li>
        </NavLink>
        <NavLink to="./yourfeed" className="link">
          <li
            className={`menu-1 ${
              selectedItem === "yourfeed" ? "selected" : ""
            }`}
            onClick={() => handleItemClick("yourfeed")}
          >
            <FaChevronCircleDown /> Your Feed
          </li>
        </NavLink>

        <NavLink to="./report" className="link">
          <li
            className={`menu-1 ${selectedItem === "report" ? "selected" : ""}`}
            onClick={() => handleItemClick("report")}
          >
            Event!!
          </li>
        </NavLink>
        {isLoggedIn ? (
          <NavLink to="/login" className="link">
            <li
              className={`menu-1 ${
                selectedItem === "logout" ? "selected" : ""
              }`}
              onClick={() => {
                handleItemClick("logout");
                handleLogout();
              }}
            >
              <BiLogInCircle /> Logout
            </li>
          </NavLink>
        ) : (
          <NavLink to="/login" className="link">
            <li
              className={`menu-1 ${selectedItem === "login" ? "selected" : ""}`}
              onClick={() => handleItemClick("login")}
            >
              <BiLogInCircle />
              Login
            </li>
          </NavLink>
        )}
        {/* <li className="menu-1 dropdown">
          <div onClick={toggleMenu}>
            <IoMdSettings /> Setting
          </div>
          {isMenuVisible && (
            <ul className="popup-menu">
              <li>Report!</li>
              <li className="mode darkk" onClick={toggleDarkMode}>
                {darkMode ? <FiSun /> : <FiMoon />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </li>
            </ul>
          )}
        </li> */}
        <NavLink className="link">
          <li className="menu-1">
            {
              <p className="mode darkk" onClick={toggleDarkMode}>
                {darkMode ? <FiSun /> : <FiMoon />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </p>
            }
          </li>
        </NavLink>

        {isLoggedIn && (
          <div className="drop">
            <img src={profileImage} alt="" className="image-ava" />
            <div className="content">
              <NavLink to="/profile" className="link">
                <p>Profile</p>
              </NavLink>
              <NavLink
                to={username ? `/myarticles/${username}` : "/"}
                className="link"
              >
                <p>My Articles</p>
              </NavLink>
              <NavLink to={`./myfavor/${username}`} className="link">
                <p>Favorited Article</p>
              </NavLink>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Header;

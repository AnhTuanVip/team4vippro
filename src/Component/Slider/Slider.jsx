import React from "react";
import "./Slider.css";
import { NavLink } from "react-router-dom";

const Slider = ({ darkMode }) => {
  return (
    <div className={`slider ${darkMode ? "dark" : ""}`}>
      <div>
        <img
          className="img-sli"
          src="https://www.pngarts.com/files/4/Dragon-Ball-Z-Goku-Transparent-Image.png"
          alt=""
        />
      </div>
      <div className="sli-1">
        <div>
          <h1>
            Stay <br />
            currious.
          </h1>
          <h2>
            Discover stories, thinking, and expertise <br /> from writers on any
            topic.
          </h2>
        </div>
        <NavLink to="./createArticle">
          <button className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}>
            Write Your Article !
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Slider;

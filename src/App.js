// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Component/Header/Header";
import Slider from "./Component/Slider/Slider";
import "./App.css";
import Trending from "./Treding/Trending";
import ArticleDetail from "./Component/ArticleDetail/ArticleDetail";
import Login from "./Component/Login/Login";
import SignUp from "./Component/SignUp/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./Component/Profile/Profile";
import ProfileUser from "./Component/ProfileUser/ProfileUser";
import YourFeed from "./Component/YourFeed/YourFeed";
import WriteArticle from "./Component/WriteArticle/WriteArticle";
import MyArticles from "./Component/MyArticles/MyArticles";
import Report from "./Component/Report/Report";
import MyArticleDetail from "./Component/MyArticleDetai/MyArticleDetail";
import MyFavorite from "./Component/MyFavorite/MyFavorite";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className={`App ${darkMode ? "dark" : "light"}`}>
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
        <ToastContainer />

        <Routes>
          <Route path="/articleDetail/:slug" element={<ArticleDetail />} />
          <Route
            path="login"
            element={
              <Login handleLogin={handleLogin} handleLogout={handleLogout} />
            }
          />
          <Route path="signup" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="report" element={<Report />} />
          <Route path="yourfeed" element={<YourFeed />} />
          <Route path="createArticle" element={<WriteArticle />} />
          <Route path="/myarticles/:username" element={<MyArticles />} />
          <Route path="/myfavor/:username" element={<MyFavorite />} />
          <Route path="/articles/:slug" element={<MyArticleDetail />} />
          <Route path="/ProfileUser/:username" element={<ProfileUser />} />
          <Route
            path="/ProfileUser/:username/favorites"
            element={<ProfileUser />}
          />
          <Route
            path="*"
            element={
              <>
                <Slider />
                <Trending />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

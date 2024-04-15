import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileUser.css";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { FaUserPlus, FaUserMinus, FaHeart } from "react-icons/fa";

const ProfileUser = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [following, setFollowing] = useState(false);
  const [articles, setArticles] = useState([]);
  const [showArticles, setShowArticles] = useState(true); // State để điều khiển việc hiển thị danh sách bài viết
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("token1");

        const response = await axios.get(
          `https://api.realworld.io/api/articles?author=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token1");
        const response = await axios.get(
          `https://api.realworld.io/api/profiles/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.profile);
        setFollowing(response.data.profile.following);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    // Kiểm tra nếu đường dẫn hiện tại chứa "/favorites" thì ẩn đi phần content
    if (location.pathname.includes("/favorites")) {
      setShowArticles(false);
    } else {
      setShowArticles(true);
    }
  }, [location.pathname]);

  const toggleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!following) {
        await axios.post(
          `https://api.realworld.io/api/profiles/${username}/follow`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.delete(
          `https://api.realworld.io/api/profiles/${username}/follow`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setFollowing(!following);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <>
      <div>
        {userData ? (
          <div className="user-profile">
            <h1> {username} profile</h1>
            {userData.bio && <p>{userData.bio}</p>}
            <img src={userData.image} alt={userData.username} />
            <p>
              {following ? (
                <button className="btn3" onClick={toggleFollow}>
                  <FaUserMinus /> Unfollow
                </button>
              ) : (
                <button onClick={toggleFollow}>
                  <FaUserPlus className="btn3" /> Follow
                </button>
              )}
            </p>
            <div>
              <NavLink to={`../ProfileUser/${username}`}>
                <button>{userData.username} Articles</button>
              </NavLink>
              <NavLink to={`../ProfileUser/${username}/favorites`}>
                <button>{userData.username} Articles favorites</button>
              </NavLink>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* Ẩn hoặc hiển thị danh sách bài viết tùy thuộc vào giá trị của state showArticles */}
      {showArticles ? (
        <div className="content-my">
          <h2>Articles</h2>
          {articles.map((article, index) => (
            <div className="c345" key={index}>
              <p>
                <img src={article.author.image} alt="" />
                <p className="time">
                  <i>{article.createdAt}</i>
                </p>
              </p>
              <NavLink to={`../articleDetail/${article.slug}`} className="link">
                <h3>
                  <b>{article.slug}</b>
                </h3>
                <p>
                  <b>{article.title}</b>
                </p>
                <p>{article.description}</p>
                <p>#{article.tagList}</p>
              </NavLink>
            </div>
          ))}
        </div>
      ) : (
        <h2>No articles are here... yet.</h2>
      )}
    </>
  );
};

export default ProfileUser;

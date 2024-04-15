import React, { useState, useEffect } from "react";
import axios from "axios";
import "./YourFeed.css";
import { FaHeart } from "react-icons/fa";
import image from "../Assets/thumbnail";
import { NavLink } from "react-router-dom";

const YourFeed = () => {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(
          "https://api.realworld.io/api/articles/feed?limit=20",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxODE0Nn0sImlhdCI6MTcxMjI1MjQwMSwiZXhwIjoxNzE3NDM2NDAxfQ.-OJ_BK21dsxVHaIpnd5WQKFou9-cvoZrQp23e_C0I2Q",
            },
          }
        );
        setArticles(response.data.articles);
      } catch (error) {
        console.error("Error fetching your feed:", error);
      }
    };

    const getRandomImage = () => {
      const defaultImages = image.map((obj) => Object.values(obj)[0]);
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("https://api.realworld.io/api/tags");
        setTags(response.data.tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchFeed();
    fetchTags();
  }, []);

  return (
    <div className="feed">
      <h2>Your Feed</h2>
      {articles.map((article) => (
        <div key={article.slug} className="feed-item">
          <NavLink to={`../articleDetail/${article.slug}`} className="link">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <p>
              <span>
                <img src={article.author.image} alt="" className="image" />
              </span>
              <b>
                <i>{article.author.username}</i>
              </b>
            </p>
            <p>
              <FaHeart /> {article.favoritesCount}
            </p>
            <p className="tag">
              {article.tagList.map((item, i) => {
                return <p key={i}>#{item}</p>;
              })}
            </p>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default YourFeed;

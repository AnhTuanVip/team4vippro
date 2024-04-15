import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import "./MyArticles.css";
import { FaHeart } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaPen } from "react-icons/fa";

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const { username } = useParams();

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

  const toggleFavorite = async (slug) => {
    try {
      const token = localStorage.getItem("token1");
      const articleIndex = articles.findIndex(
        (article) => article.slug === slug
      );
      const newArticles = [...articles];
      if (!newArticles[articleIndex].favorited) {
        await axios.post(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.delete(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
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
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="MyArticle">
      <br />
      <br />
      <br />
      <h1>My Articles</h1>

      <div className="content-my">
        {articles.map((item, index) => (
          <div className="m">
            <div key={index} className="c345">
              <div>
                <p>
                  <img src={item.author.image} alt="" />
                  <p className="time">
                    <i>{item.createdAt}</i>
                  </p>
                </p>
                <NavLink to={`../articleDetail/${item.slug}`} className="link">
                  <h3>
                    <b>{item.slug}</b>
                  </h3>

                  <p>
                    <b>{item.title}</b>
                  </p>
                  <p>{item.description}</p>
                  <p>#{item.tagList}</p>
                  <p className="count">
                    <FaHeart
                      className="heart-icon"
                      style={{ color: item.favorited ? "red" : "gray" }}
                      onClick={() => toggleFavorite(item.slug)}
                    />
                    {item.favoritesCount}
                  </p>
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyArticles;

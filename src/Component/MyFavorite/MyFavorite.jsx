import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./MyFavorite.css";
import Aos from "aos";
import "aos/dist/aos.css";
const MyFavorite = () => {
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  useEffect(() => {
    const fetchFavoriteArticles = async () => {
      try {
        const token = localStorage.getItem("token1");
        const response = await axios.get(
          `https://api.realworld.io/api/articles?favorited=${username}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavoriteArticles(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorite articles:", error);
        setLoading(false);
      }
    };

    fetchFavoriteArticles();
  }, [username]);

  const handleToggleFavorite = async (slug) => {
    try {
      const token = localStorage.getItem("token1");
      const index = favoriteArticles.findIndex(
        (article) => article.slug === slug
      );
      const updatedArticles = [...favoriteArticles];
      const article = updatedArticles[index];
      if (article.favorited) {
        await axios.delete(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      article.favorited = !article.favorited;
      article.favoritesCount += article.favorited ? 1 : -1;
      updatedArticles[index] = article;
      setFavoriteArticles(updatedArticles);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container3">
      <h2>Favorite Articles</h2>
      {favoriteArticles.length > 0 ? (
        <ul data-aos="fade-up">
          {favoriteArticles.map((article) => (
            <li key={article.slug}>
              <NavLink to={`../articleDetail/${article.slug}`} className="link">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </NavLink>
              <NavLink
                to={`../ProfileUser/${article.author.username}`}
                className="link"
              >
                <p style={{ textDecoration: "underline", marginBottom: "5px" }}>
                  <b>
                    <i>Author: {article.author.username}</i>
                  </b>
                </p>
              </NavLink>

              <p>
                <span
                  onClick={(e) => handleToggleFavorite(article.slug, e)}
                  className="count"
                >
                  {article.favoritesCount}

                  <FaHeart
                    className="heart-icon"
                    style={{
                      color: article.favorited ? "red" : "gray",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorite articles found.</p>
      )}
    </div>
  );
};

export default MyFavorite;

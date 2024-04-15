import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MyArticleDetail.css";
import { FaHeart } from "react-icons/fa";

const MyArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [favorited, setFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { slug } = useParams();
  const navi = useNavigate();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const token = localStorage.getItem("token1");
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedArticle = response.data.article;
        setArticle(fetchedArticle);
        setFavorited(fetchedArticle.favorited);
        setFavoritesCount(fetchedArticle.favoritesCount);
      } catch (error) {
        console.error("Error fetching article detail:", error);
      }
    };

    fetchArticleDetail();
  }, [slug]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token1");
      await axios.delete(`https://api.realworld.io/api/articles/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navi(-1);
      toast.error("Delete successfull!");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleUpdate = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleBack = () => {
    navi(-1);
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token1");
      if (favorited) {
        await axios.delete(
          `https://api.realworld.io/api/articles/${slug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavoritesCount(favoritesCount - 1);
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
        setFavoritesCount(favoritesCount + 1);
      }
      setFavorited(!favorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      const token = localStorage.getItem("token1");
      await axios.put(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          article: {
            title: updateTitle,
            description: updateDescription,
            body: updateBody,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPopup(false);
      navi(-1);
      toast.success("Updated successfully!!");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-detail">
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <p>{article.body}</p>
      <br />
      <br />
      <br />
      <hr />
      <p>Created at: {article.createdAt}</p>
      <p className="count">
        {favoritesCount}
        <FaHeart
          className="heart-icon"
          style={{ color: favorited ? "red" : "gray", cursor: "pointer" }}
          onClick={handleToggleFavorite}
        />
      </p>
      <p>
        <b> Author: {article.author.username}</b>
      </p>
      <img src={article.author.image} alt="" className="img" />
      <button onClick={handleUpdate} className="btn btn-success">
        Update
      </button>
      <button onClick={handleDelete} className="btn btn-danger">
        Delete
      </button>
      <button onClick={handleBack} className="btn btn-info">
        Back
      </button>

      {showPopup && (
        <div className="popup">
          <h2>Update Article</h2>
          <label>Title:</label>
          <input
            type="text"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          <label>Description:</label>
          <input
            type="text"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
          />
          <label>Body:</label>
          <textarea
            value={updateBody}
            onChange={(e) => setUpdateBody(e.target.value)}
          ></textarea>
          <button onClick={handleConfirmUpdate} className="btn btn-primary">
            Update
          </button>
          <button onClick={handleClosePopup} className="btn btn-danger">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MyArticleDetail;

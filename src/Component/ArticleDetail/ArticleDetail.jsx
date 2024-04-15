import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useParams } from "react-router-dom";
import "./ArticleDetail.css";
import { FaHeart } from "react-icons/fa";
import image from "../Assets/thumbnail";
import { MdDelete } from "react-icons/md";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [favorited, setFavorited] = useState(false);
  const [following, setFollowing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch article and related data when slug changes
    const fetchArticleAndComments = async () => {
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
        const { article } = response.data;
        setArticle(article);
        setFavorited(article.favorited);
        setFollowing(article.author.following);
        setProfile(article.author);
      } catch (error) {
        console.error("Error fetching article and comments:", error);
      }
    };
    fetchArticleAndComments();
  }, [slug]);

  useEffect(() => {
    // Fetch comments when slug changes
    const getComments = async () => {
      try {
        const token = localStorage.getItem("token1");
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    getComments();
  }, [slug]);

  const getRandomImage = () => {
    const defaultImages = image.map((obj) => Object.values(obj)[0]);
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const postComment = async () => {
    try {
      const token = localStorage.getItem("token1");
      const response = await axios.post(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        { comment: { body: newComment } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token1");
      if (!favorited) {
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
        `https://api.realworld.io/api/articles/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticle(response.data.article);
      setFavorited(!favorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token1");
      await axios.delete(
        `https://api.realworld.io/api/articles/${slug}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleFollow = async () => {
    try {
      const token = localStorage.getItem("token1");
      const username = article.author.username; // Extract author's username
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

      // If viewing own profile, update following state
      if (profile && profile.username === username) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          following: !prevProfile.following,
        }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  return (
    <>
      {article ? (
        <div className="detail-over">
          <div className="detail">
            <p>Create: {article.createdAt}</p>
            <h2 className="detail-title">{article.title}</h2>
            <img src={getRandomImage()} alt="" className="img3" />
            <p className="des">
              <b>{article.description}</b>
            </p>
            <p>{article.body}</p>
            <p className="image">
              <img src={article.author.image} alt="" />
            </p>
            <div>
              <span>like</span>
              <span>like</span>
              <span>like</span>
              <span>like</span>
            </div>
            <p className="author">
              <p>
                <Link to={`/ProfileUser/${article.author.username}`}>
                  {article.author.username}
                </Link>{" "}
                <span>
                  <button className="follow-button" onClick={toggleFollow}>
                    {following ? (
                      <span>
                        <FaUserMinus /> Unfollow
                      </span>
                    ) : (
                      <span>
                        <FaUserPlus /> Follow
                      </span>
                    )}
                  </button>
                </span>
              </p>
            </p>
            <p className="favor">
              <span className="heart" onClick={toggleFavorite}>
                <FaHeart
                  style={{ color: favorited ? "red" : "gray" }}
                  className="heart1"
                />
              </span>
              {article.favoritesCount}(Favorite Article)
            </p>
          </div>
          <div className="mostView">
            <h2>Most View</h2>
            <div>
              <img src={getRandomImage()} alt="" className="img5" />
              <br />
              <NavLink to={`../articleDetail/${slug}`} className="link">
                <b>{article.title}</b>
              </NavLink>
            </div>
            <div>
              <img src={getRandomImage()} alt="" className="img5" />
              <br />
              <NavLink to={`../articleDetail/${slug}`} className="link">
                <b>{article.title}</b>
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="getComment">
        <h1>Comments</h1>
        <div>
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            className="py-3 px-2"
          />
          <button className="py-3 mx-2" onClick={postComment}>
            Post Comment
          </button>
        </div>
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="content-comment">
              <p className="body">{comment.body}</p>
              <div className="box">
                <span>
                  <b className="bo">{comment.author.username}</b>
                </span>
                <span>
                  <img src={comment.author.image} alt="" />
                </span>
                <span>{comment.createdAt}</span>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="dele"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;

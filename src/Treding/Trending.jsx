import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Trending.css";
import image from "../Component/Assets/thumbnail";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
export const Article_API = "https://api.realworld.io/api/articles?limit=40";
export const ArticleTags_API = "https://api.realworld.io/api/tags";

const Trending = () => {
  const [trendy, setTrendy] = useState([]);
  const [tag, setTag] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  useEffect(() => {
    axios.get(Article_API).then((response) => {
      const articles = response.data.articles.map((article) => ({
        ...article,
        image: article.image || getRandomImage(),
      }));
      setTrendy(articles);
    });
  }, []);

  useEffect(() => {
    axios.get(ArticleTags_API).then((response) => {
      setTag(response.data.tags);
    });
  }, []);

  const getRandomImage = () => {
    const defaultImages = image.map((obj) => Object.values(obj)[0]);
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  const handleTagFilter = (tag) => {
    axios.get(`${Article_API}?tag=${tag}&limit=20`).then((response) => {
      const articles = response.data.articles.map((article) => ({
        ...article,
        image: article.image || getRandomImage(),
      }));
      setFilteredArticles(articles);
      setSelectedTag(tag);
    });
  };

  return (
    <>
      <h2 className="hehe">Trending on day!</h2>
      <div className="trendy">
        {trendy.slice(0, 2).map((item, index) => {
          return (
            <div key={index} className="trend" data-aos="fade-up">
              <div>
                <Link to={`/articleDetail/${item.slug}`} className="link">
                  <p className="title">
                    <b>{item.title}</b>
                  </p>
                </Link>
              </div>
              <div className="trendy-content">
                <div className="img">
                  <img src={item.image} loading="lazy" alt="Article" />
                  <p className="tags">
                    {item.tagList.map((tag, index) => (
                      <span key={index}>{tag} </span>
                    ))}
                  </p>
                </div>
                <p>
                  {item.description} Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Sequi cum voluptate harum soluta voluptas
                  magni ducimus iusto commodi itaque ex illum, necessitatibus
                  excepturi voluptatibus natus unde dignissimos facilis beatae
                  esse.
                </p>
              </div>
              <Link to={`/articleDetail/${item.slug}`}>
                <button className="btn-trend btn btn-success">
                  reading now!
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      <>
        <div className="global">
          <div>
            <h2 className="a">Global Feed</h2>
            {filteredArticles.length > 0
              ? filteredArticles.map((item, index) => {
                  return (
                    <div key={index} className="global-fl" data-aos="fade-up">
                      <div>
                        <Link
                          to={`/articleDetail/${item.slug}`}
                          className="link"
                        >
                          <p className="title-global">
                            <b>{item.title}</b>
                          </p>
                        </Link>
                        <p>{item.description}</p>
                        <p className="tags">
                          {item.tagList.map((tag, index) => (
                            <span key={index}>{tag} </span>
                          ))}
                        </p>
                      </div>
                      <img
                        loading="lazy"
                        className="img-global"
                        src={item.image}
                        alt="Article"
                      />
                    </div>
                  );
                })
              : trendy.map((item, index) => {
                  return (
                    <div key={index} className="global-fl" data-aos="fade-up">
                      <div>
                        <Link
                          to={`/articleDetail/${item.slug}`}
                          className="link"
                        >
                          <p className="title-global">
                            <b>{item.title}</b>
                          </p>
                        </Link>
                        <p>{item.description}</p>
                        <p className="tags">
                          {item.tagList.map((tag, index) => (
                            <span key={index}>{tag} </span>
                          ))}
                        </p>
                      </div>
                      <img
                        loading="lazy"
                        className="img-global"
                        src={item.image}
                        alt="Article"
                      />
                    </div>
                  );
                })}
          </div>
          <div className="fix1" data-aos="fade-left">
            <h2 className="tag-center">Discover more of what matters to you</h2>
            <div className="tag1">
              {tag &&
                tag.length > 0 &&
                tag.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`tag2 ${
                        selectedTag === item ? "selected-tag" : ""
                      }`}
                      onClick={() => handleTagFilter(item)}
                    >
                      <p>{item}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Trending;

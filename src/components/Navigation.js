import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ROUTES from "../constants/routes";
import { v4 } from "uuid";
import me from "../assets/me.jpg";
import "../index.css";

const Navigation = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <ul style={{ width: "100%" }}>
      {width < 1000 ? null : (
        <li>
          <img className="avatar" width="80%" src={me} alt="" />
        </li>
      )}
      <Pages />
    </ul>
  );
};

const Pages = () => {
  return (
    <>
      {ROUTES.map((r) =>
        r.icon === undefined ? null : (
          <li key={v4()}>
            <Page route={r} />
          </li>
        )
      )}
    </>
  );
};

const Page = ({ route }) => {
  return (
    <Link id="nav-link" className="link" to={route.path}>
      <i className="link material-icons">{route.icon}</i>
      <span className="link link-text">{route.name}</span>
    </Link>
  );
};

export default Navigation;

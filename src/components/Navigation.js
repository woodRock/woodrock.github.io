import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ROUTES from "../constants/routes";
import logo from "../assets/logo.png";
import { v4 } from "uuid";
import "./Navigation.css";
import { useTheme } from "../api/Theme";

const Navigation = () => {
  const [reload, useReload] = useState("");
  const [theme, setTheme] = useTheme();

  function toggleTheme(e) {
    e.preventDefault();
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="logo nav-item">
          <a href="#" className="nav-link">
            <span className="link-text">Woodrock</span>
            <img src={logo} alt="Brand Logo" />
          </a>
        </li>
        {ROUTES.map((route) =>
          route.icon !== undefined ? (
            <li className="nav-item" key={v4()}>
              <Link className="nav-link" to={route.path}>
                <i className="link-icon material-icons">{route.icon}</i>
                <span className="link-text">{route.name}</span>
              </Link>
            </li>
          ) : null
        )}
        <li className="nav-item has-dropdown">
          <a className="nav-link" href="#" onClick={(e) => toggleTheme(e)}>
            <i className="link-icon material-icons">palette</i>
            <span className="link-text">Theme</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

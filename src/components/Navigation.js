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

  function darkButton(e) {
    e.preventDefault();
    setTheme("dark");
  }

  const lightButton = (e) => {
    e.preventDefault();
    setTheme("light");
  };

  const solarButton = (e) => {
    e.preventDefault();
    setTheme("solar");
  };

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
          <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
            <i className="link-icon material-icons">palette</i>
            <span className="link-text">Theme</span>
          </a>
          <ul className="dropdown">
            <li className="dropdown-item">
              <a
                id="light"
                class="light"
                href="#"
                onClick={(e) => lightButton(e)}
              >
                light
              </a>
            </li>
            <li className="dropdown-item">
              <a id="dark" href="#" onClick={(e) => darkButton(e)}>
                dark
              </a>
            </li>
            <li className="dropdown-item">
              <a id="solar" href="#" onClick={(e) => solarButton(e)}>
                solar
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

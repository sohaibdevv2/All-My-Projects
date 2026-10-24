import { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoImage from "../assets/logo.png";
import "./header.css";
import { Link, useLocation } from "react-router-dom";

const Header = ({ navLinks }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const location = useLocation();
  const [activePath, setActivePath] = useState(
    localStorage.getItem("activePath") || location.pathname
  );

  useEffect(() => {
    setActivePath(localStorage.getItem("activePath") || location.pathname);
  }, [location.pathname]);

  const handleNavLinkClick = (path) => {
    setIsNavExpanded(false);
    setActivePath(path);
    localStorage.setItem("activePath", path);
  };

  return (
    <header>
      <nav className="container grid nav-bar">
        <HashLink className="nav-bar-logo" to="/">
          <img src={logoImage} alt="Little Lemon logo" />
        </HashLink>
        <button
          className="nav-bar-hamburger"
          type="button"
          aria-label="On Click"
          onClick={() => setIsNavExpanded(!isNavExpanded)}
        >
          {isNavExpanded ? (
            <FontAwesomeIcon icon={faXmark} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </button>
        <ul
          className={isNavExpanded ? "nav-bar-links expanded" : "nav-bar-links"}
        >
          {navLinks.map((navLink) => (
            <li
              key={navLink.name}
              onClick={() => handleNavLinkClick(navLink.path)}
              aria-label="On Click"
              className={`hover-underline-animation ${
                activePath === navLink.path ? "active" : ""
              }`}
            >
              {navLink.hashLink ? (
                <HashLink to={navLink.path}>{navLink.name}</HashLink>
              ) : (
                <Link to={navLink.path}>{navLink.name}</Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

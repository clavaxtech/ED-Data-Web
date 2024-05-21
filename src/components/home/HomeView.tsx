import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HomeViewProps } from "../models/page-props";

const HomeView = (props: HomeViewProps) => {
  const [state, setState] = useState({
    isActive: false
  });
  const { isActive } = state;
  const showMenu = () => {
    setState((prev) => ({ ...prev, isActive: !isActive }));
  };

  return (
    <>

      <div className={isActive ? "mobile-menu show" : "mobile-menu"}>
        <ul>
          <li>
            <a onClick={(e) => e.preventDefault()} href="void:(0)">Platform</a>
          </li>
          <li>
            <a onClick={(e) => e.preventDefault()} href="void:(0)">Features</a>
          </li>
          <li>
            <a onClick={(e) => e.preventDefault()} href="void:(0)">Who We Serve</a>
          </li>
          <li>
            <a onClick={(e) => e.preventDefault()} href="void:(0)">Resources</a>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      </div>


      <header className="main-header">
        <div className="container">
          <div className="logo">
            <a href="void:(0)">
              <img src="images/logo.svg" alt="logo" />
            </a>
          </div>
          <nav className="head-right">
            <div className="menu-con">
              <ul>
                <li>
                  <a onClick={(e) => e.preventDefault()} href="void:(0)">Platform</a>
                </li>
                <li>
                  <a onClick={(e) => e.preventDefault()} href="void:(0)">Features</a>
                </li>
                <li>
                  <a onClick={(e) => e.preventDefault()} href="void:(0)">Who We Serve</a>
                </li>
                <li>
                  <a onClick={(e) => e.preventDefault()} href="void:(0)">Resources</a>
                </li>
              </ul>
            </div>
          </nav>
          <nav className="head-right">
            <div className="menu-con">
              <ul className="login-signup">
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/sign-up" className="btn btn-outline-white">Create Account</Link>
                </li>
              </ul>
            </div>
            <button className={isActive ? "hemburger-button active" : "hemburger-button"} onClick={showMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>
      <div className="wapper">
        <div className="main-container">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="unlock-content">
                  <h1>
                    Unlock the Power
                    <br /> of Your Oil &amp; Gas <span>Data</span>
                  </h1>
                  <div className="text-block-cont">
                    <p>Propel your market foresight with Energy Domain Data—access premier well analytics, forecasting, and type curve insights. Make informed decisions with our comprehensive data platform. Shape your operational future today.</p>

                  </div>
                  <Link className="btn btn-primary" to="/sign-up">Start Free Trial</Link>
                </div>
              </div>
            </div>
            <div className="teaser-bottom"></div>
            {/* <div className="viewData-container">
              <div className="bottom-text-content">
                <p>
                  Discover the power of well data with our advanced analytics
                  platform. Energy Domain Data allows you to access and analyze
                  well data from all stages of the well lifecycle, giving you
                  insights that are not available anywhere else.
                </p>
                <a href="void:(0)" className="btn btn-primary btn-long">
                  View Demo
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeView;

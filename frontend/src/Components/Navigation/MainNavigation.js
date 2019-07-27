import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import "./MainNavigation.css";

const MainNavigation = props => {
  return (
    <div>
      <AuthContext.Consumer>
        {context => {
          return (
            <header className="main-navigation">
              <div className="main-navigation-logo">
                <h1>TH</h1>
              </div>

              <nav className="main-nav-items">
                <ul>
                  <li>
                    <NavLink to="/events">Events</NavLink>
                  </li>

                  {context.token && (
                    <React.Fragment>
                      <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                      </li>
                      <li>
                        <button onClick={context.logout}>Logout</button>
                      </li>
                    </React.Fragment>
                  )}
                </ul>
              </nav>
            </header>
          );
        }}
      </AuthContext.Consumer>
    </div>
  );
};

export default MainNavigation;

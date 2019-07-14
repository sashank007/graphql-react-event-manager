import React, { useState } from "react";
import "./App.css";
import Auth from "./Components/Auth/Auth";
import Bookings from "./Components/Bookings/Bookings";
import Events from "./Components/Events/Events";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import MainNavigation from "./Components/Navigation/MainNavigation";

import AuthContext from "./context/auth-context";
function App() {
  const [loginToken, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const login = (token, userId, tokenExpiration) => {
    console.log("token coming in : ", token);
    setToken(token);
    setUserId(userId);
    console.log("login token  changed: ", loginToken);
    console.log("user id changed: ", userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <AuthContext.Provider
            value={{
              token: loginToken,
              userId: userId,
              login: login,
              logout: logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!loginToken && <Redirect from="/" to="/events" exact />}

                {loginToken && <Redirect from="/auth" to="/events" exact />}
                {!loginToken && <Redirect from="/events" to="/auth" exact />}

                {!loginToken && <Redirect from="/bookings" to="/auth" exact />}

                {!loginToken && <Route path="/auth" component={Auth} />}
                {!loginToken && <Redirect to="/auth" exact />}

                <Route path="/events" component={Events} />
                {!loginToken && <Route path="/bookings" component={Bookings} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

import React, { useState, useRef, useContext } from "react";
import "./Auth.css";
import UserContext from "../../context/auth-context";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const graphQLUri = "http://localhost:8000/graphql";
const Auth = () => {
  const emailEl = useRef(null);
  const passEl = useRef(null);

  const notify = () => {
    console.log("notif");
    toast.error("Error logging in!");
  };

  const user = useContext(UserContext);

  const [isLogin, setLoginState] = useState(true);

  const switchMode = () => {
    setLoginState(!isLogin);
    console.log("mode switched : ", isLogin);
  };

  const submitForm = e => {
    e.preventDefault();
    const email = emailEl.current.value;
    const password = passEl.current.value;
    console.log(email, password);

    if (email.trim().length === 0 || password.trim().length === 0) return;

    let requestBody = {
      query: `query 
    { 
      login(email:"${email}" , password: "${password}")
      {
        userId
        token
        tokenExpiration
      }
    }`
    };
    //graphql query syntax
    if (!isLogin) {
      requestBody = {
        query: `
    mutation { 
      createUser(userInput : {email: "${email}" , password: "${password}"})
      {
        _id
        email
      }
    }
    `
      };
    }

    //sending request to backend
    fetch(graphQLUri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          console.log("failed loggin in");
          notify();
          throw new Error("Failed");
        }

        return res.json();
      })
      .then(resData => {
        console.log(resData);
        if (resData.data.login.token) {
          user.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(e => {
        notify();
        console.log(e);
      });
  };
  return (
    <div>
      <form className="auth-form" onSubmit={submitForm}>
        <h3>
          {isLogin ? <span>ACCOUNT LOGIN</span> : <span>ACCOUNT SIGNUP</span>}
        </h3>
        <div className="form-control">
          <label htmlFor="email" id="email-label">
            E-Mail
          </label>
          <input type="email" id="email-login" ref={emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password" id="password-label">
            Password
          </label>
          <input type="password" id="password" ref={passEl} />
        </div>
        <div className="form-actions">
          {isLogin ? (
            // <button type="login">Login</button>
            <a class="button" onClick={submitForm}>
              <span class="away">Login</span>
              <span class="over">Let's Go!</span>
            </a>
          ) : (
            // <button type="signup">Signup</button>
            <a class="button" onClick={submitForm}>
              <span class="away">Signup</span>
              <span class="over">Let's Go!</span>
            </a>
          )}
        </div>
        {isLogin ? (
          <a id="switch" onClick={switchMode}>
            Not signed up yet?
          </a>
        ) : (
          <a id="switch" onClick={switchMode}>
            Already signed up?
          </a>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default Auth;

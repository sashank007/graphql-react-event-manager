import React, { useState, useRef, useContext } from "react";
import "./Auth.css";
import UserContext from "../../context/auth-context";

const graphQLUri = "http://localhost:8000/graphql";
const Auth = () => {
  const emailEl = useRef(null);
  const passEl = useRef(null);

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
        console.log(e);
      });
  };
  return (
    <div>
      <form className="auth-form" onSubmit={submitForm}>
        <div className="form-control">
          <label htmlFor="email">e-mail</label>
          <input type="email" id="email-login" ref={emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">password</label>
          <input type="password" id="password" ref={passEl} />
        </div>
        <div className="form-actions">
          {isLogin ? (
            <button type="login">Login</button>
          ) : (
            <button type="signup">Signup</button>
          )}
        </div>
        {isLogin ? (
          <button className="switch" onClick={switchMode}>
            (Not signed up yet?
          </button>
        ) : (
          <button className="switch" onClick={switchMode}>
            Already signed up?
          </button>
        )}
      </form>
    </div>
  );
};

export default Auth;

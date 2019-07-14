import React from "react";

const UserContext = React.createContext({
  token: null,
  userId: null,
  login: (token, userid, tokenExpiration) => {},
  logout: () => {}
});

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;

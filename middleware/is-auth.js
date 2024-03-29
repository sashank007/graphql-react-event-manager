const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  console.log("my token : ", token);
  if (token === "") {
    req.isAuth = false;
    console.log("token is empty");
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecretkey");
    console.log("decoded token: ", decodedToken);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  console.log("decodedToken", decodedToken);
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  console.log("authenticated");
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

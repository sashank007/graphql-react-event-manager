exports.checkAuth = req => {
  console.log("request : ", req);
  if (!req.isAuth) {
    throw new Error("Unauthorized access");
  }
};

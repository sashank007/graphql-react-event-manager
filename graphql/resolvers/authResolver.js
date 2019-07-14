const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: args => {
    const { userInput } = args;
    return User.findOne({
      email: userInput.email
    })
      .then(user => {
        if (user) {
          throw new Error("Email id already exists");
        }
        return bcrypt.hash(userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, _id: result.id };
      })
      .catch(e => {
        throw e;
      });
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("User does not exist");
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new Error("Password is incorrect");
    //json web token used to create a token with the user id and email
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "supersecretkey",
      {
        expiresIn: "1h"
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};

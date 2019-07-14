const authResolver = require("./authResolver");
const bookingResolver = require("./bookingResolver");
const eventResolver = require("./eventResolver");

const rootResolver = {
  ...authResolver,
  ...bookingResolver,
  ...eventResolver
};
module.exports = rootResolver;

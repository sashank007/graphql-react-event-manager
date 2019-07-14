const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { dateToString } = require("../../helpers/date");
const { user } = require("./merge.js");
const { checkAuth } = require("../../helpers/checkAuth");
module.exports = {
  bookings: async (args, req) => {
    checkAuth(req);
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: dateToString(booking._doc.createdAt),
          updatedAt: dateToString(booking._doc.createdAt)
        };
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    checkAuth(req);
    const fetchedEvent = await Event.findOne({
      _id: args.eventId
    });
    const booking = new Booking({
      event: fetchedEvent,
      user: req.userId
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.createdAt)
    };
  },
  cancelBooking: async (args, req) => {
    checkAuth(req);
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking.event._doc.creator)
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
};

// // {
// "query" : "query { login(email:\"sashank.tungaturthi@gmail.com\" , password : \"sashank007\") { token} }"
// }

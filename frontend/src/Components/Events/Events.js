import React, { useState, useRef, useContext, useEffect } from "react";
import "./Events.css";
import Modal from "../Common/Modal";
import Backdrop from "../Common/Backdrop/Backdrop";
import UserContext from "../../context/auth-context";
import CreatedIcon from "../Common/CreatedIcon";
const Events = () => {
  const user = useContext(UserContext);

  const [eventsList, setEvents] = useState([]);

  const [showDetailedView, setDetailedView] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isLoading, setLoadingState] = useState(false);

  const [showModal, setModalState] = useState(false);

  const [isActive, setActive] = useState(true);

  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    // Update the document title using the browser API
    fetchEvents();
  }, []);

  const graphQLUri = "http://localhost:8000/graphql";

  const titleEl = useRef(null);
  const dateEl = useRef(null);
  const priceEl = useRef(null);
  const descEl = useRef(null);

  const openModal = () => {
    setModalState(true);
  };
  const modalCancel = () => {
    setModalState(false);
    setDetailedView(false);
  };

  const showDetails = e => {
    console.log("show details event selected: ", e);
    setSelectedEvent(e);
    setDetailedView(true);
  };

  const bookEvent = () => {
    // setLoadingState(true);
    if (!user.token) alert("Please login to book an event.");
    console.log("booking event...");
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId:"${selectedEvent._id}"){
              _id
              createdAt
              updatedAt
            }
          }
        `
    };
    //graphql query syntax
    //sending request to backend
    fetch(graphQLUri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token
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
        // const events = resData.data.events;
        // setEvents(events);
        // setLoadingState(false);
      })
      .catch(e => {
        console.log(e);
        setLoadingState(false);
      });
  };

  const fetchEvents = () => {
    setLoadingState(true);
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };
    //graphql query syntax
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
        const events = resData.data.events;
        if (isActive) {
          setEvents(events);
          setLoadingState(false);
        }
      })
      .catch(e => {
        console.log(e);
        setLoadingState(false);
      });
  };

  const modalConfirm = () => {
    setModalState(false);
    const title = titleEl.current.value;
    const date = dateEl.current.value;
    const price = +priceEl.current.value;
    const description = descEl.current.value;

    // if (
    //   title.trim().length === 0 ||
    //   date.trim().length === 0 ||
    //   price.trim().length === 0 ||
    //   description.trim().length === 0
    // ) {
    //   return;
    // }
    const event = { title, price, date, description };
    console.log("event submitted:  ", event);
    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };
    //graphql query syntax

    console.log("user token : ", user.token);
    //sending request to backend
    fetch(graphQLUri, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token
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
        fetchEvents();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const renderEvents = () => {
    console.log("rendering events..");
    return eventsList.map(event => {
      return (
        <li className="events-list-item" key={event._id}>
          <div id="non-detail">
            <h1>{event.title}</h1>
            <h2>${event.price}</h2>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div>
            <button className="btn" onClick={showDetails.bind(this, event)}>
              View Details
            </button>
            <div id="created-icon">
              {/* {event.creator._id === user.userId && */}
              <CreatedIcon />
              {/* } */}
            </div>
          </div>
        </li>
      );
    });
  };
  return (
    <React.Fragment>
      {showModal && <Backdrop />}
      {showModal && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancel}
          onConfirm={modalConfirm}
          canBook={false}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl} />
            </div>
            <div className="form-control">
              <label htmlFor="title">Price</label>
              <input type="number" id="price" ref={priceEl} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateEl} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea rows="4" id="description" ref={descEl} />
            </div>
          </form>
        </Modal>
      )}
      {showDetailedView && (
        <Modal
          title="Detailed View"
          canCancel
          canConfirm={false}
          onCancel={modalCancel}
          onBook={bookEvent}
          canBook
        >
          <div>
            <h1>{selectedEvent.title}</h1>
            <h2>{selectedEvent.description}</h2>
            <h3>{selectedEvent.price}</h3>
            <h4>{selectedEvent.date}</h4>
          </div>
        </Modal>
      )}

      {user.token && (
        <div className="events-control">
          {/* <button className="btn-create" onClick={openModal}>
            Create Event
          </button> */}
          <a class="button" onClick={openModal}>
            <span class="away">Create Event</span>
            <span class="over">Let's Go!</span>
          </a>
        </div>
      )}
      <section>
        <h3 id="events-title">Events Around You</h3>
        {isLoading && (
          <div className="lds-roller">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        )}
        <ul className="events-list">{renderEvents()}</ul>
      </section>
    </React.Fragment>
  );
};

export default Events;

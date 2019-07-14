import React, { useState, useRef, useContext } from "react";
import "./Events.css";
import Modal from "../Common/Modal";
import Backdrop from "../Common/Backdrop/Backdrop";
import UserContext from "../../context/auth-context";

const Events = () => {
  const user = useContext(UserContext);

  const graphQLUri = "http://localhost:8000/graphql";

  const [showModal, setModalState] = useState(false);

  const titleEl = useRef(null);
  const dateEl = useRef(null);
  const priceEl = useRef(null);
  const descEl = useRef(null);

  const openModal = () => {
    setModalState(true);
  };
  const modalCancel = () => {
    setModalState(false);
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
        // if (resData.data.login.token) {
        //   user.login(
        //     resData.data.login.token,
        //     resData.data.login.userId,
        //     resData.data.login.tokenExpiration
        //   );
        // }
      })
      .catch(e => {
        console.log(e);
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
      <div className="events-control">
        <p>Create you own Events!</p>
        <button onClick={openModal}>Create Event</button>
      </div>
    </React.Fragment>
  );
};

export default Events;

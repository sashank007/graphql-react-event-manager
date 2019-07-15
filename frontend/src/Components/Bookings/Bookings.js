import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/auth-context";

const Bookings = () => {
  const user = useContext(UserContext);

  const graphQLUri = "http://localhost:8000/graphql";

  const [isLoading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    console.log("fetching bookings...");
    // setLoadingState(true);
    if (!user.token) alert("Please login to see your bookings.");
    setLoading(true);
    const requestBody = {
      query: `
          query {
           bookings {
              _id
              createdAt
              event { 
                _id
                title
                date
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
        console.log("booking data: ", resData);
        setBookings(resData.data.bookings);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  const renderBookings = () => {
    return bookings.map(booking => {
      return (
        <ul key={booking._id}>
          <li>{booking.event.title}</li>
        </ul>
      );
    });
  };

  return (
    <div>
      <h2>Bookings page</h2>
      {!isLoading && renderBookings()}
    </div>
  );
};

export default Bookings;

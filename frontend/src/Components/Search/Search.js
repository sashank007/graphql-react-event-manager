import React, { useState } from "react";

import SearchBar from "material-ui-search-bar";
import FestImage from "../../assets/music-fest.jpg";
// *snip*
import "./Search.css";

export default function Search() {
  const handleRequest = () => {
    console.log("handling request");
  };

  const [value, setState] = useState("");
  return (
    <div className="searchRoot">
      <div class="bg" />
      <div className="searchBar">
        <h3>Tempe Happenings</h3>
        <SearchBar
          onChange={() => console.log("onChange")}
          onRequestSearch={() => console.log("onRequestSearch")}
          style={{
            margin: "0 auto",
            maxWidth: 800,
            width: 900
          }}
        />
      </div>
    </div>
  );
}

import React from "react";
import ReactMarkdown from "react-markdown";
import "./FlipCard.css";

const FlipCard = ({image, back}) => {
  return (
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <img
            src={image}
            alt="Avatar"
            style={{width: "300px", height: "300px"}}
          />
        </div>
        <div className="flip-card-back">
          <ReactMarkdown source={back}></ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;

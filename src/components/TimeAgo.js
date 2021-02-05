import React from "react";
import ReactTimeAgo from "react-time-ago";

// Setup for the ReactTimeAgo package
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
JavascriptTimeAgo.locale(en);

const style = "Twitter";

const stringToDate = (date) => new Date(date);

const TimeAgo = ({ date }) => (
  <ReactTimeAgo date={stringToDate(date)} timeStyle={style} />
);

export default TimeAgo;

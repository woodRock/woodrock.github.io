import React from "react";
import ReactTimeAgo from "react-time-ago";

// Setup for the ReactTimeAgo package
import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
JavascriptTimeAgo.locale(en);

const style = "Twitter";

export default function TimeAgo({ date }) {
  const stringToDate = new Date(date);
  return (
    <>
      <ReactTimeAgo date={stringToDate} timeStyle={style} />
    </>
  );
}

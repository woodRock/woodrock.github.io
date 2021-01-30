import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown/";
import Loading from "./Loading";

const Markdown = ({ markdown }) => {
  const [terms, setTerms] = useState(null);

  const fetchMarkdown = async (markdown) => {
    fetch(markdown)
      .then((response) => response.text())
      .then((text) => {
        setTerms(text);
      });
  };

  useEffect(() => {
    fetchMarkdown(markdown);
  });

  return <div>{terms ? <ReactMarkdown source={terms} /> : <Loading />}</div>;
};

export default Markdown;

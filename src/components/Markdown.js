import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown/";

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

  return (
    <div className="content">
      {terms ? <ReactMarkdown source={terms} /> : <h1>Loading</h1>}
    </div>
  );
};

export default Markdown;

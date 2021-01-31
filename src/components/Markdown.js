import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown/";
import Loading from "./Loading";

const Markdown = ({ title, markdown }) => {
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
    <>
      {title && <Header title={title} />}
      <div style={{ marginLeft: "15%", marginRight: "30%" }}>
        {terms ? <ReactMarkdown source={terms} /> : <Loading />}
      </div>
    </>
  );
};

const Header = ({ title }) => (
  <>
    <h1>{title}</h1>
    <hr />
  </>
);

export default Markdown;

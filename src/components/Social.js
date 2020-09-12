import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { useFirebase } from "../api/context";

const SocialPage = () => {
  const [social, setSocial] = useState([]);
  const { fetch } = useFirebase();

  useEffect(() => {
    const unsubscribe = fetch("social", "title", {
      next: (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          setSocial((prevSocial) => [...prevSocial, data]);
        });
      },
    });
    return () => unsubscribe();
  }, [fetch]);

  return (
    <div>
      {social.length && <div>...</div>}
      {social ? (
        <SocialList social={social} />
      ) : (
        <div>There are no social links ...</div>
      )}
    </div>
  );
};

const SocialList = ({ social }) => (
  <div className="social">
    {social.map((s) => (
      <SocialLink key={v4()} social={s} />
    ))}
  </div>
);

const SocialLink = ({ social }) => (
  <a href={social.link}>
    <i id="social-link" className={"link fa fa-" + social.title} />
  </a>
);

export default SocialPage;
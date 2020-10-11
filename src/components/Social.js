import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { useFirebase } from "../api/Firebase";
import "./Social.css";

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
      {social ? (
        <ul className="social-links">
          {social.map((s) => (
            <li className="social-link">
              <a className="link-text" href={s.link} key={v4()}>
                <i className={"fa fa-" + s.title} />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default SocialPage;

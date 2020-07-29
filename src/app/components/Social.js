import React, {useState, useEffect} from "react";
import {useFirebase} from "../util/context";
import uuid from "uuid";

const SocialPage = props => {
  const [social, setSocial] = useState([]);
  const {fetch} = useFirebase();

  useEffect(() => {
    const unsubscribe = fetch("social", "title", {
      next: querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            ...doc.data()
          };
          setSocial(prevSocial => [...prevSocial, data]);
        });
      }
    });
    return unsubscribe;
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

const SocialList = ({social}) => (
  <div className="social">
    {social.map(s => (
      <SocialItem key={uuid.v4()} social={s} />
    ))}
  </div>
);

const SocialItem = ({social}) => (
  <span>
    <a href={social.link}>
      <i className={"link fa fa-" + social.title}></i>
    </a>
  </span>
);

export default SocialPage;

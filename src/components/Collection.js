import React, { useState, useEffect } from "react";
import { useFirebase } from "../api/context";
import Loading from "../components/Loading";
import { v4 } from "uuid";
import "../pages/Projects.css";

const Collection = ({ Child, collectionName, sort, styles }) => {
  const [collection, setCollection] = useState([]);
  const { fetch } = useFirebase();

  useEffect(() => {
    const unsubscribe = fetch(collectionName, sort, {
      next: (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          setCollection((prev) => [data, ...prev]);
        });
      },
    });
    return () => unsubscribe();
  }, [fetch, collectionName, sort]);

  return (
    <div>
      <h1>{capitalize(collectionName)}</h1>
      {!collection.length && <Loading />}
      <section className={styles}>
        {collection ? (
          collection.map((item) => <Child key={v4()} item={item} />)
        ) : (
          <div>There are no {collectionName}s ...</div>
        )}
      </section>
    </div>
  );
};

const capitalize = (phrase) => {
  return phrase.replace(/^\w/, (c) => c.toUpperCase());
};

export default Collection;

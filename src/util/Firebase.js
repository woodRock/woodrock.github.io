import * as Firebase from "firebase/";
import "firebase/firestore";
import config from "./config";

Firebase.initializeApp(config);
const db = Firebase.firestore();

const fetch = (collection, sort, observer) =>
  db
    .collection(collection)
    .orderBy(sort)
    .onSnapshot(observer);

export default fetch;

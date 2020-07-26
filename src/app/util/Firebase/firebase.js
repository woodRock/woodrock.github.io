import * as firebase from 'firebase/';
import 'firebase/firestore';
import config from './config';

firebase.initializeApp(config);

const db = firebase.firestore();

const Firebase =  {}

export const fetch = (collection, sort, observer) => {
  return db.collection(collection)
  .orderBy(sort)
  .onSnapshot(observer)
}

export default Firebase;

import * as firebase from 'firebase/';
import 'firebase/firestore';
import config from './config';

firebase.initializeApp(config);

const db = firebase.firestore();

const Firebase =  {

  projects: () => {
    return db.collection('projects')
  },

  social: () => {
    return db.collection('social');
  },

  blog: () => {
    return db.collection('blog');
  }
}

export const fetch = (collection, observer) => {
  return db.collection(collection)
  .orderBy('time')
  .onSnapshot(observer)
}

export default Firebase;

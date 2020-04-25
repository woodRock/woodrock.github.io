import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyA6w14wLmGD4M3zYhUsWc_IZMsAO6Cs7Ng",
    authDomain: "portfolio-7b51b.firebaseapp.com",
    databaseURL: "https://portfolio-7b51b.firebaseio.com",
    projectId: "portfolio-7b51b",
    storageBucket: "portfolio-7b51b.appspot.com",
    messagingSenderId: "888392851400",
    appId: "1:888392851400:web:c91412c8602e7f2e6f2afd",
    measurementId: "G-N4G5H32S57"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');
}
export default Firebase;
